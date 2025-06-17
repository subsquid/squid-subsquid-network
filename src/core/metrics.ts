import { BlockHeader } from '@subsquid/evm-processor'
import { HttpClient, HttpError, HttpTimeoutError } from '@subsquid/http-client'
import { In, MoreThanOrEqual, Not } from 'typeorm'
import { Transform } from 'node:stream'

import { Events, MappingContext } from '../types'

import { recalculateWorkerAprs } from './cap'

import { network } from '~/config/network'
import {
  WorkerStatus,
  Worker,
  Commitment,
  WorkerDayUptime,
  Settings,
  Block,
  WorkerMetrics,
} from '~/model'
import { joinUrl, toPercent } from '~/utils/misc'
import { DAY_MS, MINUTE_MS, toStartOfInterval } from '~/utils/time'
import { startOfDay, compareAsc } from 'date-fns'

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

      await ctx.store.upsert(activeWorkers)
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

      await ctx.store.upsert(activeWorkers)

      const {
        recommended_worker_versions: recommendedWorkerVersion,
        supported_worker_versions: minimalWorkerVersion,
      } = schedulerStatus.config

      const settings = await settingsDefer.getOrFail()

      settings.minimalWorkerVersion = minimalWorkerVersion || null
      settings.recommendedWorkerVersion = recommendedWorkerVersion || null

      await ctx.store.upsert(settings)
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
  data: {
    timestamp: string
    pings: string
    storedBytes: string
    responseBytes: string
    readChunks: string
    queries: string
  }[]
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
    ctx.log.info(`last processed timestamp: ${lastProcessedTimestamp.toISOString()}`)

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

      if (chunkData.length == 0) {
        ctx.log.warn(`No data for chunk ${chunk.name}`)
        continue
      }

      for (const stat of chunkData) {
        const worker = workersMap.get(stat.peerId)
        if (!worker) continue

        for (const hour of stat.data) {
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

    await ctx.store.upsert(workerMetrics)
    if (!complete) return

    lastMetricsUpdateTimestamp = snapshotTimestamp
    lastMetricsUpdateOffset = 0

    ctx.log.info(`workers stats of ${workers.length} updated`)
  }
}

const rewardMetricsUpdateInterval = 30 * MINUTE_MS
let lastRewardMetricsUpdateTimestamp = -1
let lastRewardMetricsUpdateOffset = 0

type RewardStat = {
  id: string
  traffic: {
    trafficWeight: number
  }
  liveness: {
    livenessCoefficient: number
    tenure: number
  }
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
    if (!endBlock) {
      ctx.log.warn(`unable to fetch rewards starts: end block not found`)
      return
    }

    const startBlock = await ctx.store.findOne(Block, {
      where: { l1BlockNumber: MoreThanOrEqual(endBlock.l1BlockNumber - rewardEpochLength) },
      order: { id: 'ASC' },
    })
    if (!startBlock) {
      ctx.log.warn(`unable to fetch rewards starts: start block not found`)
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
      const data = workersStats.get(worker.peerId)

      worker.trafficWeight = data?.traffic.trafficWeight ?? null
      worker.dTenure = data?.liveness.tenure ?? null
      worker.liveness = data?.liveness.livenessCoefficient ?? null
    }

    await ctx.store.upsert(activeWorkers)

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
    await ctx.store.upsert(settings)

    lastRewardMetricsUpdateTimestamp = snapshotTimestamp
    lastRewardMetricsUpdateOffset = 0

    ctx.log.info(`workers reward stats of ${activeWorkers.length} updated`)
    await recalculateWorkerAprs(ctx)
  }
}

// let INIT_APRS = false;

export function listenRewardsDistributed(ctx: MappingContext) {
  // if (!INIT_APRS) {
  //   ctx.events.on(Events.Initialization, async () => {
  //     await calculateAprs(ctx);
  //   });
  //   INIT_APRS = true;
  // }
  // ctx.events.on(Events.RewardsDistributed, async () => {
  //   await calculateAprs(ctx);
  // });
}

export async function calculateAprs(ctx: MappingContext) {
  // const lastCommitments = await ctx.store.find(Commitment, { order: { id: 'DESC' }, take: 1 });
  // if (lastCommitments.length === 0) return;
  // const commitments = await ctx.store
  //   .find(Commitment, {
  //     where: {},
  //     order: { id: 'DESC' },
  //     take: 5,
  //   })
  //   .then((res) => res.reverse());
  // const activeWorkers = await ctx.store.find(Worker, {
  //   where: { status: In([WorkerStatus.ACTIVE]) },
  // });
  // for (const worker of activeWorkers) {
  //   const { workerApr, stakerApr } = calculateApr(worker, commitments);
  //   worker.apr = workerApr;
  //   worker.stakerApr = stakerApr;
  // }
  // await ctx.store.upsert(activeWorkers);
  // ctx.log.info(`workers aprs of ${activeWorkers.length} updated`);
}

function calculateApr(worker: Worker, commitments: Commitment[]) {
  // let intervalFrom: number | null = null;
  // let intervalTo: number | null = null;
  // let workerApr: BigDecimal = BigDecimal(0);
  // let stakerApr: BigDecimal = BigDecimal(0);
  // const createdAt = worker.createdAt.getTime();
  // for (const commitment of commitments) {
  //   intervalTo = commitment.to.getTime();
  //   const payment = commitment.recipients.find((r) => r.workerId === worker.id);
  //   if (!payment) continue;
  //   const commitmentIntervalTo = commitment.to.getTime();
  //   if (createdAt > commitmentIntervalTo) continue;
  //   const commitmentIntervalFrom = commitment.from.getTime();
  //   if (createdAt > commitmentIntervalFrom && payment.workerApr === 0 && payment.stakerApr === 0)
  //     // filter cases when new worker was not included into payment
  //     continue;
  //   const commitmentInterval = commitmentIntervalTo - commitmentIntervalFrom;
  //   if (commitmentInterval === 0) continue;
  //   intervalFrom = intervalFrom ?? Math.max(createdAt, commitmentIntervalFrom);
  //   workerApr = BigDecimal(payment.workerApr).mul(commitmentInterval).add(workerApr);
  //   stakerApr = BigDecimal(payment.stakerApr).mul(commitmentInterval).add(stakerApr);
  // }
  // if (intervalFrom === null || intervalTo === null) {
  //   return { workerApr: null, stakerApr: null };
  // } else {
  //   const interval = intervalTo - intervalFrom;
  //   return {
  //     workerApr: workerApr.div(interval).toNumber(),
  //     stakerApr: worker.totalDelegation > 0 ? stakerApr.div(interval).toNumber() : null,
  //   };
  // }
}

class JsonLinesTransform extends Transform {
  private buffer = ''

  constructor() {
    super({ objectMode: true })
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null, data?: any) => void,
  ) {
    this.buffer += chunk.toString()
    const lines = this.buffer.split('\n')
    this.buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line) continue
      try {
        this.push(JSON.parse(line))
      } catch (e: any) {
        this.emit('error', new Error(`Failed to parse JSON line: ${line}. Error: ${e.message}`))
      }
    }
    callback()
  }

  _flush(callback: (error?: Error | null, data?: any) => void) {
    if (this.buffer) {
      try {
        this.push(JSON.parse(this.buffer))
      } catch (e: any) {
        this.emit(
          'error',
          new Error(`Failed to parse JSON line: ${this.buffer}. Error: ${e.message}`),
        )
      }
    }
    callback()
  }
}
