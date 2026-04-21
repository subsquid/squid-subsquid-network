import { HttpClient, HttpError, HttpTimeoutError } from '@subsquid/http-client'
import { createLogger } from '@subsquid/logger'
import { compareAsc } from 'date-fns'
import { In, MoreThanOrEqual } from 'typeorm'

import type { MappingContext } from '@sqd/shared'
import { AsyncTask, DAY_MS, MINUTE_MS, joinUrl, network, toPercent, toStartOfInterval } from '@sqd/shared'
import type { BlockHeader } from '../types'

import { recalculateWorkerAprs, refreshWorkerCap } from './cap'

import { Block, Settings, Worker, WorkerMetrics, WorkerStatus } from '~/model'

// Dedicated module-level loggers. Enable a section with e.g.
//   SQD_DEBUG=sqd:workers:metrics:*
// or just one of:
//   SQD_DEBUG=sqd:workers:metrics:online
//   SQD_DEBUG=sqd:workers:metrics:stats
//   SQD_DEBUG=sqd:workers:metrics:rewards
const onlineLog = createLogger('sqd:workers:metrics:online')
const statsLog = createLogger('sqd:workers:metrics:stats')
const rewardsLog = createLogger('sqd:workers:metrics:rewards')

const client = new HttpClient({
  baseUrl: process.env.NETWORK_STATS_URL,
  httpTimeout: 2 * MINUTE_MS,
})

function formatTimestamp(ts: number): string {
  return ts > 0 ? new Date(ts).toISOString() : 'never'
}

// =============================================================================
// Workers online
// =============================================================================
//
// One processor batch → at most one step: start HTTP, wait (pending), move a
// finished response into a stash, or apply a stashed snapshot to the DB.
//
// Cursor semantics on restart: `lastOnlineUpdateTimestamp` is module-local
// and resets to -1. The first batch after restart therefore always refetches
// the snapshot and re-applies it, overwriting the same values that were
// already in the DB. This is intentional — the online snapshot has no
// database-persisted cursor, and re-applying an identical payload is cheap
// and idempotent (see `applyOnlineUpdate`).

const onlineUpdateInterval = 5 * MINUTE_MS
let lastOnlineUpdateTimestamp = -1
let onlineStartupLogged = false

type WorkerOnline = {
  peerId: string
  jailed: boolean
  lastDialOk: boolean
  storedBytes: string
  version: string
  jailReason: string
}

type SchedulerStatus = {
  config: {
    recommended_worker_versions: string
    supported_worker_versions: string
  }
  workers: { peer_id: string; status: string }[]
}

type OnlineFetched = {
  snapshotTimestamp: number
  workerStats?: WorkerOnline[]
  schedulerStatus?: SchedulerStatus
}

/** Background HTTP slot for online snapshot (`/workers/online/*`). */
let onlineFetchSlot: AsyncTask<OnlineFetched | null> | null = null

async function fetchOnlineSnapshot(
  statsUrl: string,
  schedulerUrl: string | undefined,
): Promise<OnlineFetched | null> {
  const onlineStatus: { timestamp: string } | undefined = await client
    .get(joinUrl(statsUrl, '/workers/online/status'))
    .then((r) => JSON.parse(r))
    .catch((e) => {
      onlineLog.warn(e)
      return undefined
    })
  if (!onlineStatus) {
    onlineLog.debug('no online snapshot status available')
    return null
  }

  const snapshotTimestamp = new Date(onlineStatus.timestamp).getTime()
  onlineLog.debug(`server reports online snapshot from ${formatTimestamp(snapshotTimestamp)}`)

  const [workerStats, schedulerStatus] = await Promise.all([
    client
      .get(joinUrl(statsUrl, '/workers/online/data'))
      .then(
        (r: Buffer) =>
          r
            .toString()
            .split('\n')
            .filter((line) => !!line)
            .map((line) => JSON.parse(line)) as WorkerOnline[],
      )
      .catch((e) => {
        onlineLog.warn(e)
        return undefined
      }),
    schedulerUrl
      ? (client.get(joinUrl(schedulerUrl, 'status.json')).catch((e) => {
          onlineLog.warn(e)
          return undefined
        }) as Promise<SchedulerStatus | undefined>)
      : Promise.resolve(undefined),
  ])

  const workerStatsCount = workerStats ? `${workerStats.length} workers` : 'unavailable'
  const schedulerCount = schedulerStatus
    ? `${schedulerStatus.workers.length} workers`
    : 'unavailable'
  onlineLog.debug(
    `online snapshot loaded: stats from network (${workerStatsCount}), status from scheduler (${schedulerCount})`,
  )

  return { snapshotTimestamp, workerStats, schedulerStatus }
}

export async function updateWorkersOnline(ctx: MappingContext, block: BlockHeader) {
  const statsUrl = process.env.NETWORK_STATS_URL
  if (!statsUrl) return
  const schedulerUrl = process.env.SCHEDULER_URL

  if (!onlineStartupLogged) {
    onlineStartupLogged = true
    onlineLog.debug(
      `online cursor not persisted; will refetch+re-apply the first snapshot after restart`,
    )
  }

  if (onlineFetchSlot == null) {
    if (block.timestamp - onlineUpdateInterval < lastOnlineUpdateTimestamp) return
    onlineLog.info(
      `fetching online workers snapshot (last applied: ${formatTimestamp(lastOnlineUpdateTimestamp)})`,
    )
    onlineFetchSlot = AsyncTask.start(() => fetchOnlineSnapshot(statsUrl, schedulerUrl))
  }

  const result = onlineFetchSlot.get()
  if (result.state === 'pending') return

  if (result.state === 'fulfilled') {
    onlineFetchSlot = null
    const data = result.value
    if (data == null) {
      onlineLog.debug('latest online fetch returned no data; nothing to apply')
      return
    }
    if (data.snapshotTimestamp === lastOnlineUpdateTimestamp) {
      onlineLog.debug(
        `online snapshot from ${formatTimestamp(data.snapshotTimestamp)} is the same one ` +
          `we already applied; nothing to do`,
      )
      return
    }
    onlineLog.debug(`applying online snapshot from ${formatTimestamp(data.snapshotTimestamp)}`)
    await applyOnlineUpdate(ctx, data)
    lastOnlineUpdateTimestamp = data.snapshotTimestamp
    return
  }

  onlineLog.warn(result.error as Error)
  onlineFetchSlot = AsyncTask.start(() => fetchOnlineSnapshot(statsUrl, schedulerUrl))
}

async function applyOnlineUpdate(ctx: MappingContext, data: OnlineFetched) {
  const activeWorkers = await ctx.store.find(Worker, {
    where: {
      status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]),
    },
  })
  const activeWorkersMap = new Map(activeWorkers.map((w) => [w.peerId, w]))

  if (data.workerStats) {
    for (const worker of activeWorkers) {
      worker.online = null
      worker.dialOk = null
      worker.storedData = null
      worker.version = null
    }

    for (const stats of data.workerStats) {
      const worker = activeWorkersMap.get(stats.peerId)
      if (!worker) continue

      worker.online = true
      worker.dialOk = null
      worker.storedData = BigInt(stats.storedBytes)
      worker.version = stats.version
    }
  }

  if (data.schedulerStatus) {
    for (const worker of activeWorkers) {
      worker.jailed = null
      worker.jailReason = null
    }

    for (const d of data.schedulerStatus.workers) {
      const worker = activeWorkersMap.get(d.peer_id)
      if (!worker) continue

      worker.jailed = d.status !== 'online'
      worker.jailReason = worker.jailed ? d.status : null
    }

    const {
      recommended_worker_versions: recommendedWorkerVersion,
      supported_worker_versions: minimalWorkerVersion,
    } = data.schedulerStatus.config

    const settings = await ctx.store.getOrFail(Settings, network.name)
    settings.minimalWorkerVersion = minimalWorkerVersion || null
    settings.recommendedWorkerVersion = recommendedWorkerVersion || null
  }

  const onlineCount = activeWorkers.filter((w) => !!w.online).length
  onlineLog.info(
    `online status updated: ${onlineCount} of ${activeWorkers.length} active workers are online ` +
      `(snapshot ${formatTimestamp(data.snapshotTimestamp)})`,
  )
}

// =============================================================================
// Workers metrics
// =============================================================================
//
// The stats endpoint exposes a list of hourly chunks. Cursor:
// `lastAppliedHourTimestamp`. **One batch → one step**: wait on pending HTTP,
// stash a finished response, apply a stashed result to the DB, or start the
// next HTTP fetch (including a deferred fetch after applying a chunk).
//
// Head-only `updateWorkers*` calls run from the batch `complete` phase in
// main.ts.

const metricsUpdateInterval = 30 * MINUTE_MS
let lastMetricsFetchAt = -1
let lastAppliedHourTimestamp = -1
let aggregatesPending = false
/** True while we are chaining chunk downloads until caught_up (interval ignored). */
let metricsBurstActive = false

type WorkerStat = {
  peerId: string
  data: (
    | {
        timestamp: string
        pings: string
        storedBytes: string
        responseBytes: string
        readChunks: string
        queries: string
      }
    | [string, string, string, string, string, string]
  )[]
}

type ChunkMeta = { timestamp: string; name: string }

type StatsChunkResult =
  | { kind: 'chunk'; chunkTimestamp: number; chunkName: string; data: WorkerStat[] }
  | { kind: 'caught_up' }

/** Background HTTP slot for `/workers/stats/*` (one in-flight fetch at a time). */
let metricsFetchSlot: AsyncTask<StatsChunkResult | null> | null = null

async function refreshHourCursor(ctx: MappingContext) {
  const settings = await ctx.store.getOrFail(Settings, network.name)
  const dbTimestamp = settings.statsChunkCursor?.getTime() ?? -1
  if (dbTimestamp > lastAppliedHourTimestamp) {
    statsLog.debug(
      `stats cursor restored from DB: ${formatTimestamp(dbTimestamp)} ` +
        `(was ${formatTimestamp(lastAppliedHourTimestamp)})`,
    )
    lastAppliedHourTimestamp = dbTimestamp
  }
}

async function persistHourCursor(ctx: MappingContext, timestamp: number) {
  const settings = await ctx.store.getOrFail(Settings, network.name)
  settings.statsChunkCursor = new Date(timestamp)
}

async function fetchNextStatsChunk(
  statsUrl: string,
  cursor: number,
): Promise<StatsChunkResult | null> {
  const statsStatus: { timestamp: string; chunks: ChunkMeta[] } | undefined = await client
    .get(joinUrl(statsUrl, '/workers/stats/status'))
    .then((r) => JSON.parse(r))
    .catch((e) => {
      statsLog.warn(e)
      return undefined
    })
  if (!statsStatus) {
    statsLog.debug('stats status endpoint returned no data')
    return null
  }

  const next = statsStatus.chunks
    .filter((c) => new Date(c.timestamp).getTime() > cursor)
    .sort((a, b) => compareAsc(a.timestamp, b.timestamp))[0]

  if (!next) {
    statsLog.debug(
      `no chunks newer than ${formatTimestamp(cursor)} ` +
        `(server snapshot at ${formatTimestamp(new Date(statsStatus.timestamp).getTime())})`,
    )
    return { kind: 'caught_up' }
  }

  const chunkTimestamp = new Date(next.timestamp).getTime()
  statsLog.debug(`downloading stats chunk ${next.name} for ${formatTimestamp(chunkTimestamp)}`)
  const data = await fetchMetricsChunk(statsUrl, next.name)
  if (data == null) return null

  return { kind: 'chunk', chunkTimestamp, chunkName: next.name, data }
}

function fetchMetricsChunk(statsUrl: string, name: string): Promise<WorkerStat[] | null> {
  return client
    .get(joinUrl(statsUrl, `/workers/stats/${name}`))
    .then((r: Buffer | undefined) => {
      const stats = (r
        ?.toString()
        .split('\n')
        .filter((line) => !!line)
        .map((line) => JSON.parse(line)) ?? []) as WorkerStat[]
      statsLog.debug(`stats chunk ${name} contains entries for ${stats.length} workers`)
      return stats
    })
    .catch((e) => {
      statsLog.warn(e)
      return null
    })
}

export async function updateWorkersMetrics(ctx: MappingContext, block: BlockHeader) {
  const statsUrl = process.env.NETWORK_STATS_URL
  if (!statsUrl) return

  if (metricsFetchSlot == null) {
    if (!metricsBurstActive && block.timestamp - lastMetricsFetchAt < metricsUpdateInterval) return
    const syncingMoreChunks = metricsBurstActive
    await refreshHourCursor(ctx)
    if (!syncingMoreChunks) {
      lastMetricsFetchAt = block.timestamp
      statsLog.info(
        `polling stats endpoint for chunks newer than ${formatTimestamp(lastAppliedHourTimestamp)}`,
      )
    } else {
      statsLog.info(
        `syncing stats: fetching next chunk after hour cursor ${formatTimestamp(lastAppliedHourTimestamp)}`,
      )
    }
    metricsBurstActive = true
    metricsFetchSlot = AsyncTask.start(() =>
      fetchNextStatsChunk(statsUrl, lastAppliedHourTimestamp),
    )
  }

  const result = metricsFetchSlot.get()
  if (result.state === 'pending') return

  if (result.state === 'fulfilled') {
    metricsFetchSlot = null
    const chunkResult = result.value
    if (chunkResult == null) {
      metricsBurstActive = false
      return
    }
    if (chunkResult.kind === 'chunk') {
      await applyMetricsChunk(
        ctx,
        chunkResult.data,
        chunkResult.chunkTimestamp,
        chunkResult.chunkName,
      )
      if (chunkResult.chunkTimestamp > lastAppliedHourTimestamp) {
        lastAppliedHourTimestamp = chunkResult.chunkTimestamp
        await persistHourCursor(ctx, lastAppliedHourTimestamp)
      }
      aggregatesPending = true
      metricsBurstActive = true
      return
    }
    // caught_up
    metricsBurstActive = false
    if (aggregatesPending) {
      aggregatesPending = false
      statsLog.info(
        `applied all available chunks up to ${formatTimestamp(lastAppliedHourTimestamp)}; ` +
          `recomputing 24h/90d aggregates`,
      )
      await updateWorkerAggregatedMetrics(ctx)
    }
    return
  }

  statsLog.warn(result.error as Error)
  metricsBurstActive = false
  metricsFetchSlot = AsyncTask.start(() =>
    fetchNextStatsChunk(statsUrl, lastAppliedHourTimestamp),
  )
}

async function applyMetricsChunk(
  ctx: MappingContext,
  chunkData: WorkerStat[],
  chunkTimestamp: number,
  chunkName: string,
) {
  const workers = await ctx.store.find(Worker, {
    where: {},
    cacheEntities: false,
  })
  const workersMap = new Map(workers.map((w) => [w.peerId, w]))
  const cursor = new Date(lastAppliedHourTimestamp > 0 ? lastAppliedHourTimestamp : 0)

  let alreadyApplied = 0
  let beforeWorkerRegistration = 0
  const workerMetrics: WorkerMetrics[] = []
  for (const stat of chunkData) {
    const worker = workersMap.get(stat.peerId)
    if (!worker) continue

    for (let hour of stat.data) {
      hour = Array.isArray(hour)
        ? {
            timestamp: hour[0],
            pings: hour[1],
            storedBytes: hour[2],
            responseBytes: hour[3],
            readChunks: hour[4],
            queries: hour[5],
          }
        : hour
      const hourTimestamp = new Date(hour.timestamp)

      if (compareAsc(hourTimestamp, cursor) <= 0) {
        alreadyApplied++
        continue
      }
      if (compareAsc(hourTimestamp, worker.createdAt) < 0) {
        beforeWorkerRegistration++
        continue
      }

      workerMetrics.push(
        new WorkerMetrics({
          id: `${worker.id.padStart(5, '0')}-${Math.floor(hourTimestamp.getTime() / 1000)
            .toString()
            .padStart(10, '0')}`,
          timestamp: hourTimestamp,
          pings: Number(hour.pings),
          uptime: toPercent(Number(hour.pings) / 30),
          storedData: BigInt(hour.storedBytes),
          servedData: BigInt(hour.responseBytes),
          scannedData: BigInt(hour.readChunks),
          queries: Number(hour.queries),
          worker,
        }),
      )
    }
  }

  await ctx.store.track(workerMetrics, { replace: true })

  const ignored: string[] = []
  if (alreadyApplied) ignored.push(`${alreadyApplied} already in DB`)
  if (beforeWorkerRegistration) {
    ignored.push(`${beforeWorkerRegistration} from before worker registration`)
  }
  statsLog.info(
    `stored ${workerMetrics.length} new hourly metrics from ${chunkData.length} workers ` +
      `(chunk ${chunkName}, hour ${formatTimestamp(chunkTimestamp)})` +
      (ignored.length ? `; ignored: ${ignored.join(', ')}` : ''),
  )
}

async function updateWorkerAggregatedMetrics(ctx: MappingContext) {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - DAY_MS)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * DAY_MS)

  // Flush pending tracked WorkerMetrics so the raw query below sees them.
  await ctx.store.sync()

  const rows: {
    worker_id: string
    total_queries_24h: string
    total_served_data_24h: string
    total_scanned_data_24h: string
    uptime_sum_24h: string
    uptime_count_24h: string
    max_stored_data_24h: string
    total_queries_90d: string
    total_served_data_90d: string
    total_scanned_data_90d: string
    uptime_sum_90d: string
    uptime_count_90d: string
  }[] = await ctx.store['em'].query(
    `SELECT
      worker_id,
      COALESCE(SUM(queries)      FILTER (WHERE timestamp >= $1), 0) AS total_queries_24h,
      COALESCE(SUM(served_data)  FILTER (WHERE timestamp >= $1), 0) AS total_served_data_24h,
      COALESCE(SUM(scanned_data) FILTER (WHERE timestamp >= $1), 0) AS total_scanned_data_24h,
      COALESCE(SUM(uptime)       FILTER (WHERE timestamp >= $1), 0) AS uptime_sum_24h,
      COUNT(*)                   FILTER (WHERE timestamp >= $1)      AS uptime_count_24h,
      COALESCE(MAX(stored_data)  FILTER (WHERE timestamp >= $1), 0) AS max_stored_data_24h,
      COALESCE(SUM(queries), 0)                                      AS total_queries_90d,
      COALESCE(SUM(served_data), 0)                                  AS total_served_data_90d,
      COALESCE(SUM(scanned_data), 0)                                 AS total_scanned_data_90d,
      COALESCE(SUM(uptime), 0)                                       AS uptime_sum_90d,
      COUNT(*)                                                       AS uptime_count_90d
    FROM worker_metrics
    WHERE timestamp >= $2
    GROUP BY worker_id`,
    [oneDayAgo, ninetyDaysAgo],
  )

  const workers = await ctx.store.find(Worker, {
    where: {},
  })

  const workerMap = new Map(workers.map((w) => [w.id, w]))
  const seenWorkerIds = new Set<string>()

  for (const row of rows) {
    const worker = workerMap.get(row.worker_id)
    if (!worker) continue
    seenWorkerIds.add(worker.id)

    const count24h = Number(row.uptime_count_24h)
    const count90d = Number(row.uptime_count_90d)

    worker.storedData = count24h > 0 ? BigInt(row.max_stored_data_24h) : null
    worker.queries24Hours = count24h > 0 ? BigInt(row.total_queries_24h) : null
    worker.servedData24Hours = count24h > 0 ? BigInt(row.total_served_data_24h) : null
    worker.scannedData24Hours = count24h > 0 ? BigInt(row.total_scanned_data_24h) : null
    worker.uptime24Hours = count24h > 0 ? Number(row.uptime_sum_24h) / count24h : null

    worker.queries90Days = count90d > 0 ? BigInt(row.total_queries_90d) : null
    worker.servedData90Days = count90d > 0 ? BigInt(row.total_served_data_90d) : null
    worker.scannedData90Days = count90d > 0 ? BigInt(row.total_scanned_data_90d) : null
    worker.uptime90Days = count90d > 0 ? Number(row.uptime_sum_90d) / count90d : null
  }

  for (const worker of workers) {
    if (seenWorkerIds.has(worker.id)) continue
    worker.storedData = null
    worker.queries24Hours = null
    worker.servedData24Hours = null
    worker.scannedData24Hours = null
    worker.uptime24Hours = null
    worker.queries90Days = null
    worker.servedData90Days = null
    worker.scannedData90Days = null
    worker.uptime90Days = null
  }

  statsLog.info(
    `24h/90d aggregated metrics recomputed for ${workers.length} workers ` +
      `(hour cursor ${formatTimestamp(lastAppliedHourTimestamp)})`,
  )
}

// =============================================================================
// Reward stats
// =============================================================================
//
// `/config` then L1 window resolution (DB) then `/rewards` + `/currentApy`.
// One batch → one step: HTTP pending wait, stash HTTP result, resolve window,
// start next HTTP, or apply payload to workers.

const rewardMetricsUpdateInterval = 30 * MINUTE_MS
let lastRewardMetricsUpdateTimestamp = -1
let rewardsStartupLogged = false

// Cursor semantics on restart: like the online snapshot, the rewards cursor
// is module-local and resets to -1. First head batch refetches `/config` +
// `/rewards` + `/currentApy` and re-applies; since settings.baseApr, workers'
// trafficWeight/dTenure/liveness, and the cap recompute are all idempotent
// on identical inputs, this is safe. Persisting the cursor would save one
// HTTP cycle per restart but is not a correctness concern.

type RewardStat = {
  id: string
  traffic: { trafficWeight: number }
  liveness: { livenessCoefficient: number; tenure: number }
}

type RewardConfig = { rewardEpochLength: number }
type RewardData = { rewards: { workers: RewardStat[] }; apy: { apy: number } }

let rewardCycleSnapshotTs = 0
let rewardConfigSlot: AsyncTask<RewardConfig> | null = null
let rewardDataSlot: AsyncTask<RewardData> | null = null

function resetRewardPipeline() {
  rewardCycleSnapshotTs = 0
  rewardConfigSlot = null
  rewardDataSlot = null
}

export async function updateWorkerRewardStats(ctx: MappingContext, block: BlockHeader) {
  const monitorUrl = process.env.REWARDS_MONITOR_API_URL
  if (!monitorUrl) return

  if (!rewardsStartupLogged) {
    rewardsStartupLogged = true
    rewardsLog.debug(
      `reward cursor not persisted; will refetch+re-apply the first snapshot after restart`,
    )
  }

  // Data slot: process rewards + APY when ready.
  if (rewardDataSlot) {
    const result = rewardDataSlot.get()
    if (result.state === 'pending') return

    if (result.state === 'fulfilled') {
      rewardDataSlot = null
      const { rewards, apy } = result.value
      rewardsLog.debug(
        `applying rewards snapshot for ${formatTimestamp(rewardCycleSnapshotTs)}: ` +
          `${rewards.workers.length} workers in payload, base APR ${(apy.apy / 10000).toFixed(4)}`,
      )
      const workersStats = rewards.workers.reduce(
        (r, w) => r.set(w.id, w),
        new Map<string, RewardStat>(),
      )
      const activeWorkers = await ctx.store.find(Worker, {
        where: { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
      })
      const settings = await ctx.store.getOrFail(Settings, network.name)
      settings.baseApr = apy.apy / 10000
      for (const worker of activeWorkers) {
        const d = workersStats.get(worker.peerId)
        worker.trafficWeight = d?.traffic.trafficWeight ?? null
        worker.dTenure = d?.liveness.tenure ?? null
        worker.liveness = d?.liveness.livenessCoefficient ?? null
        refreshWorkerCap(worker, settings)
      }
      rewardsLog.info(
        `reward stats updated for ${activeWorkers.length} active workers ` +
          `(snapshot ${formatTimestamp(rewardCycleSnapshotTs)})`,
      )
      await recalculateWorkerAprs(ctx)
      return
    }

    const e = result.error
    resetRewardPipeline()
    if (e instanceof HttpError || e instanceof HttpTimeoutError) {
      rewardsLog.warn(e)
      rewardCycleSnapshotTs = toStartOfInterval(block.timestamp, rewardMetricsUpdateInterval)
      rewardConfigSlot = AsyncTask.start(
        () => client.get(joinUrl(monitorUrl, `/config`)) as Promise<RewardConfig>,
      )
      return
    }
    throw e
  }

  // Config slot: on fulfilled resolve L1 window inline, then start data slot.
  if (rewardConfigSlot) {
    const result = rewardConfigSlot.get()
    if (result.state === 'pending') return

    if (result.state === 'fulfilled') {
      rewardConfigSlot = null
      const config = result.value
      const rewardEpochLength = config.rewardEpochLength * 2
      rewardsLog.debug(
        `rewards config received: epoch length is ${config.rewardEpochLength} blocks ` +
          `(window size: ${rewardEpochLength} blocks)`,
      )
      const endBlock = await ctx.store.findOne(Block, {
        where: { timestamp: MoreThanOrEqual(new Date(rewardCycleSnapshotTs)) },
        order: { id: 'ASC' },
      })
      if (!endBlock?.l1BlockNumber) {
        rewardsLog.warn(
          `cannot compute rewards window: no L1 block at or after ${formatTimestamp(rewardCycleSnapshotTs)} yet`,
        )
        resetRewardPipeline()
        return
      }
      const startBlock = await ctx.store.findOne(Block, {
        where: { l1BlockNumber: MoreThanOrEqual(endBlock.l1BlockNumber - rewardEpochLength) },
        order: { id: 'ASC' },
      })
      if (!startBlock?.l1BlockNumber) {
        rewardsLog.warn(
          `cannot compute rewards window: no L1 block ${rewardEpochLength} ahead of L1 ${endBlock.l1BlockNumber} yet`,
        )
        resetRewardPipeline()
        return
      }
      const confirmationOffset = 150
      const startL1 = startBlock.l1BlockNumber - confirmationOffset
      const endL1 = endBlock.l1BlockNumber - confirmationOffset
      rewardsLog.debug(`downloading rewards and APY for L1 blocks ${startL1}..${endL1}`)
      rewardDataSlot = AsyncTask.start(async () => {
        const [rewards, apy] = await Promise.all([
          client.get(joinUrl(monitorUrl, `/rewards/${startL1}/${endL1}`)) as Promise<{
            workers: RewardStat[]
          }>,
          client.get(joinUrl(monitorUrl, `/currentApy/${startL1}`)) as Promise<{ apy: number }>,
        ])
        return { rewards, apy }
      })
      return
    }

    const e = result.error
    rewardConfigSlot = null
    resetRewardPipeline()
    if (e instanceof HttpError || e instanceof HttpTimeoutError) {
      rewardsLog.warn(e)
      rewardCycleSnapshotTs = toStartOfInterval(block.timestamp, rewardMetricsUpdateInterval)
      rewardConfigSlot = AsyncTask.start(
        () => client.get(joinUrl(monitorUrl, `/config`)) as Promise<RewardConfig>,
      )
      return
    }
    throw e
  }

  // Idle — start config fetch when the poll interval allows.
  if (block.timestamp - rewardMetricsUpdateInterval <= lastRewardMetricsUpdateTimestamp) return

  const snapshotTimestamp = toStartOfInterval(block.timestamp, rewardMetricsUpdateInterval)
  if (snapshotTimestamp > lastRewardMetricsUpdateTimestamp) {
    lastRewardMetricsUpdateTimestamp = snapshotTimestamp
  }
  rewardCycleSnapshotTs = snapshotTimestamp
  rewardsLog.info(`fetching workers rewards snapshot for ${formatTimestamp(snapshotTimestamp)}`)
  rewardConfigSlot = AsyncTask.start(
    () => client.get(joinUrl(monitorUrl, `/config`)) as Promise<RewardConfig>,
  )
}
