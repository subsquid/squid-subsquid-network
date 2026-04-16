import { HttpClient, HttpError, HttpTimeoutError } from '@subsquid/http-client'
import { compareAsc, startOfDay } from 'date-fns'
import { In, MoreThanOrEqual } from 'typeorm'

import type { MappingContext } from '@sqd/shared'
import { DAY_MS, MINUTE_MS, joinUrl, network, toPercent, toStartOfInterval } from '@sqd/shared'
import type { BlockHeader } from '../types'

import { recalculateWorkerAprs } from './cap'

import { Block, Settings, Worker, WorkerMetrics, WorkerStatus } from '~/model'

const client = new HttpClient({
  baseUrl: process.env.NETWORK_STATS_URL,
  httpTimeout: 2 * MINUTE_MS,
})

const onlineUpdateInterval = 5 * MINUTE_MS
let lastOnlineUpdateTimestamp = -1
let lastOnlineUpdateOffset = 0

type WorkerOnline = {
  peerId: string
  jailed: boolean
  lastDialOk: boolean
  storedBytes: string
  version: string
  jailReason: string
}

export async function updateWorkersOnline(ctx: MappingContext, block: BlockHeader) {
  const statsUrl = process.env.NETWORK_STATS_URL
  if (!statsUrl) return

  const schedulerUrl = process.env.SCHEDULER_URL
  const settingsDefer = ctx.store.defer(Settings, network.name)

  if (
    block.timestamp - onlineUpdateInterval >=
    lastOnlineUpdateTimestamp + lastOnlineUpdateOffset
  ) {
    const onlineStatus: { timestamp: string } | undefined = await client
      .get(joinUrl(statsUrl, '/workers/online/status'))
      .then((r) => JSON.parse(r))
      .catch((e) => {
        ctx.log.warn(e)
        return undefined
      })

    if (!onlineStatus) return

    const snapshotTimestamp = new Date(onlineStatus.timestamp).getTime()
    if (snapshotTimestamp === lastOnlineUpdateTimestamp) {
      lastOnlineUpdateOffset += MINUTE_MS
      return
    }

    const activeWorkers = await ctx.store.find(Worker, {
      where: {
        status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]),
      },
      cacheEntities: false,
    })
    const activeWorkersMap = new Map(activeWorkers.map((w) => [w.peerId, w]))

    const workerStats: WorkerOnline[] | undefined = await client
      .get(joinUrl(statsUrl, '/workers/online/data'))
      .then((r: Buffer) =>
        r
          .toString()
          .split('\n')
          .filter((line) => !!line)
          .map((line) => JSON.parse(line)),
      )
      .catch((e) => {
        ctx.log.warn(e)
        return undefined
      })

    if (workerStats) {
      for (const worker of activeWorkers) {
        worker.online = null
        worker.dialOk = null
        worker.storedData = null
        worker.version = null
      }

      for (const stats of workerStats) {
        const worker = activeWorkersMap.get(stats.peerId)
        if (!worker) continue

        worker.online = true
        worker.dialOk = null
        worker.storedData = BigInt(stats.storedBytes)
        worker.version = stats.version
      }
    }

    const schedulerStatus:
      | {
          config: {
            recommended_worker_versions: string
            supported_worker_versions: string
          }
          workers: {
            peer_id: string
            status: string
          }[]
        }
      | undefined = schedulerUrl
      ? await client.get(joinUrl(schedulerUrl, 'status.json')).catch(() => undefined)
      : undefined

    if (schedulerStatus) {
      for (const worker of activeWorkers.values()) {
        worker.jailed = null
        worker.jailReason = null
      }

      for (const data of schedulerStatus.workers) {
        const worker = activeWorkersMap.get(data.peer_id)
        if (!worker) continue

        worker.jailed = data.status !== 'online'
        worker.jailReason = worker.jailed ? data.status : null
      }

      const {
        recommended_worker_versions: recommendedWorkerVersion,
        supported_worker_versions: minimalWorkerVersion,
      } = schedulerStatus.config

      const settings = await settingsDefer.getOrFail()

      settings.minimalWorkerVersion = minimalWorkerVersion || null
      settings.recommendedWorkerVersion = recommendedWorkerVersion || null
    }

    lastOnlineUpdateTimestamp = new Date(onlineStatus.timestamp).getTime()

    ctx.log.info(
      `workers online of ${activeWorkers.length} updated. ${activeWorkers.filter((w) => !!w.online).length} workers online`,
    )
  }
}

const metricsUpdateInterval = 30 * MINUTE_MS
let lastMetricsUpdateTimestamp = -1
let lastMetricsUpdateOffset = 0

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

export async function updateWorkersMetrics(ctx: MappingContext, block: BlockHeader) {
  const statsUrl = process.env.NETWORK_STATS_URL
  if (!statsUrl) return

  if (
    block.timestamp - metricsUpdateInterval >
    lastMetricsUpdateTimestamp + lastMetricsUpdateOffset
  ) {
    const statsStatus:
      | { timestamp: string; chunks: { timestamp: string; name: string }[] }
      | undefined = await client
      .get(joinUrl(statsUrl, '/workers/stats/status'))
      .then((r) => JSON.parse(r))
      .catch((e) => {
        ctx.log.warn(e)
        return undefined
      })
    if (!statsStatus) return

    const snapshotTimestamp = new Date(statsStatus.timestamp).getTime()
    if (snapshotTimestamp === lastMetricsUpdateTimestamp) {
      lastMetricsUpdateOffset = lastMetricsUpdateOffset
        ? Math.min(lastMetricsUpdateOffset * 2, metricsUpdateInterval)
        : MINUTE_MS
      return
    }

    const workers = await ctx.store.find(Worker, {
      where: {},
      cacheEntities: false,
    })
    const workersMap = new Map(workers.map((w) => [w.peerId, w]))

    const lastProcessedTimestamp = await ctx.store
      .findOne(WorkerMetrics, { where: {}, order: { timestamp: 'DESC' } })
      .then((r) => new Date(r?.timestamp ?? 0))

    const workerMetrics: WorkerMetrics[] = []
    let complete = true
    for (const chunk of statsStatus.chunks.sort((a, b) => compareAsc(a.timestamp, b.timestamp))) {
      if (workerMetrics.length >= 50_000) {
        complete = false
        break
      }

      if (compareAsc(chunk.timestamp, startOfDay(lastProcessedTimestamp)) < 0) continue

      const chunkData: WorkerStat[] | undefined = await client
        .get(joinUrl(statsUrl, `/workers/stats/${chunk.name}`))
        .then(
          (r: Buffer | undefined) =>
            r
              ?.toString()
              .split('\n')
              .filter((line) => !!line)
              .map((line) => JSON.parse(line)) ?? [],
        )
        .catch((e) => {
          ctx.log.warn(e)
          return undefined
        })
      if (!chunkData) break

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

          if (compareAsc(hourTimestamp, lastProcessedTimestamp) < 0) continue
          if (compareAsc(hourTimestamp, worker.createdAt) < 0) continue

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
    }

    await ctx.store.track(workerMetrics, { replace: true })
    if (!complete) return

    lastMetricsUpdateTimestamp = snapshotTimestamp
    lastMetricsUpdateOffset = 0

    ctx.log.info(`workers stats of ${workers.length} updated`)

    await updateWorkerAggregatedMetrics(ctx)
  }
}

async function updateWorkerAggregatedMetrics(ctx: MappingContext) {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - DAY_MS)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * DAY_MS)

  const workers = await ctx.store.find(Worker, {
    where: {},
    cacheEntities: false,
  })

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
  }[] = await (ctx.store as any).em.query(
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

  ctx.log.info(`aggregated metrics updated for ${workers.length} workers`)
}

const rewardMetricsUpdateInterval = 30 * MINUTE_MS
let lastRewardMetricsUpdateTimestamp = -1
let lastRewardMetricsUpdateOffset = 0

type RewardStat = {
  id: string
  traffic: { trafficWeight: number }
  liveness: { livenessCoefficient: number; tenure: number }
}

export async function updateWorkerRewardStats(ctx: MappingContext, block: BlockHeader) {
  const monitorUrl = process.env.REWARDS_MONITOR_API_URL
  if (!monitorUrl) return

  if (
    block.timestamp - rewardMetricsUpdateInterval >
    lastRewardMetricsUpdateTimestamp + lastRewardMetricsUpdateOffset
  ) {
    const { rewardEpochLength: rewardEpochLength_ } = await client.get(
      joinUrl(monitorUrl, `/config`),
    )
    const rewardEpochLength = rewardEpochLength_ * 2

    const snapshotTimestamp = toStartOfInterval(block.timestamp, rewardMetricsUpdateInterval)
    if (snapshotTimestamp > lastRewardMetricsUpdateTimestamp) {
      lastRewardMetricsUpdateTimestamp = snapshotTimestamp
      lastRewardMetricsUpdateOffset = 0
    }

    const endBlock = await ctx.store.findOne(Block, {
      where: { timestamp: MoreThanOrEqual(new Date(snapshotTimestamp)) },
      order: { id: 'ASC' },
    })
    if (!endBlock?.l1BlockNumber) {
      ctx.log.warn(`unable to fetch rewards stats: end block not found`)
      return
    }

    const startBlock = await ctx.store.findOne(Block, {
      where: { l1BlockNumber: MoreThanOrEqual(endBlock.l1BlockNumber - rewardEpochLength) },
      order: { id: 'ASC' },
    })
    if (!startBlock?.l1BlockNumber) {
      ctx.log.warn(`unable to fetch rewards stats: start block not found`)
      return
    }
    const confirmationOffset = 150

    let res: { workers: RewardStat[] }
    try {
      res = await client.get(
        joinUrl(
          monitorUrl,
          `/rewards/${startBlock.l1BlockNumber - confirmationOffset}/${endBlock.l1BlockNumber - confirmationOffset}`,
        ),
      )
    } catch (e) {
      if (e instanceof HttpError || e instanceof HttpTimeoutError) {
        ctx.log.warn(e)
        lastRewardMetricsUpdateOffset = lastRewardMetricsUpdateOffset
          ? Math.min(lastRewardMetricsUpdateOffset * 2, metricsUpdateInterval)
          : 5 * MINUTE_MS
        return
      }
      throw e
    }

    const { workers: data } = res
    const workersStats = data.reduce((r, w) => r.set(w.id, w), new Map<string, RewardStat>())
    const activeWorkers = await ctx.store.find(Worker, {
      where: { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
    })

    for (const worker of activeWorkers) {
      const d = workersStats.get(worker.peerId)
      worker.trafficWeight = d?.traffic.trafficWeight ?? null
      worker.dTenure = d?.liveness.tenure ?? null
      worker.liveness = d?.liveness.livenessCoefficient ?? null
    }

    const settings = await ctx.store.getOrFail(Settings, network.name)

    let currentApy: { apy: number }
    try {
      currentApy = await client.get(
        joinUrl(monitorUrl, `/currentApy/${startBlock.l1BlockNumber - confirmationOffset}`),
      )
    } catch (e) {
      if (e instanceof HttpError || e instanceof HttpTimeoutError) {
        ctx.log.warn(e)
        lastRewardMetricsUpdateOffset = lastRewardMetricsUpdateOffset
          ? Math.min(lastRewardMetricsUpdateOffset * 2, metricsUpdateInterval)
          : 5 * MINUTE_MS
        return
      }
      throw e
    }

    settings.baseApr = currentApy.apy / 10000

    lastRewardMetricsUpdateTimestamp = snapshotTimestamp
    lastRewardMetricsUpdateOffset = 0

    ctx.log.info(`workers reward stats of ${activeWorkers.length} updated`)
    await recalculateWorkerAprs(ctx)
  }
}
