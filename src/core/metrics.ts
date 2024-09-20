import { BigDecimal } from '@subsquid/big-decimal';
import { HttpClient, HttpError, HttpTimeoutError } from '@subsquid/http-client';
import { keyBy, last } from 'lodash';
import { In, MoreThanOrEqual } from 'typeorm';

import { Events, MappingContext } from '../types';

import { recalculateWorkerAprs } from './cap';

import { network } from '~/config/network';
import { WorkerStatus, Worker, Commitment, WorkerDayUptime, Settings, Block } from '~/model';
import { joinUrl, toPercent } from '~/utils/misc';
import { DAY_MS, HOUR_MS, MINUTE_MS, toStartOfDay, toStartOfInterval } from '~/utils/time';

const client = new HttpClient({
  baseUrl: process.env.NETWORK_STATS_URL,
  httpTimeout: 2 * MINUTE_MS,
});

const onlineUpdateInterval = 5 * MINUTE_MS;
let lastOnlineUpdateTimestamp = -1;
let lastOnlineUpdateOffset = 0;

type WorkerOnline = {
  peerId: string;
  jailed: boolean;
  lastDialOk: boolean;
  storedBytes: string;
  version: string;
  jailReason: string;
};

export function listenOnlineUpdate(ctx: MappingContext) {
  if (!ctx.isHead) return;

  const statsUrl = process.env.NETWORK_STATS_URL;
  if (!statsUrl) return;

  const schedulerUrl = process.env.SCHEDULER_API_URL;
  const settingsDefer = ctx.store.defer(Settings, network.name);

  ctx.log.debug(`listening for worker online updates`);

  ctx.events.on(Events.Initialization, async (block) => {
    if (
      block.timestamp - onlineUpdateInterval >=
      lastOnlineUpdateTimestamp + lastOnlineUpdateOffset
    ) {
      const { timestamp, data }: { timestamp: string; data: WorkerOnline[] } = await client
        .get(joinUrl(statsUrl, '/workers/online.json'))
        .then((r) => JSON.parse(r));

      const snapshotTimestamp = new Date(timestamp).getTime();
      if (snapshotTimestamp === lastOnlineUpdateTimestamp) {
        lastOnlineUpdateOffset += MINUTE_MS;
        return;
      }

      const onlineWorkers = keyBy(data, (w) => w.peerId);
      const activeWorkers = await ctx.store.find(Worker, {
        where: {
          status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]),
        },
      });

      try {
        const jailInfo: {
          peer_id: string;
          jailed: boolean;
          jail_reason: string | null;
        }[] = schedulerUrl ? await client.get(joinUrl(schedulerUrl, 'workers/jail_info')) : [];
        const jailedWorkers = keyBy(jailInfo, (w) => w.peer_id);

        for (const worker of activeWorkers) {
          const data = onlineWorkers[worker.peerId];
          const jailData = jailedWorkers[worker.peerId];

          worker.online = !!data;
          worker.dialOk = null;
          worker.storedData = data ? BigInt(data.storedBytes) : null;
          worker.version = data ? data.version : worker.version;
          worker.jailed = jailData ? jailData.jailed : null;
          worker.jailReason = jailData ? jailData.jail_reason : null;
        }

        await ctx.store.upsert(activeWorkers);

        lastOnlineUpdateTimestamp = snapshotTimestamp;
        lastOnlineUpdateOffset = 0;

        const config = schedulerUrl
          ? await client.get<{
              recommended_worker_versions?: string;
              supported_worker_versions?: string;
            }>(joinUrl(schedulerUrl, '/config'))
          : undefined;
        if (config) {
          const {
            recommended_worker_versions: recommendedWorkerVersion,
            supported_worker_versions: minimalWorkerVersion,
          } = config;

          const settings = await settingsDefer.getOrFail();

          settings.minimalWorkerVersion = minimalWorkerVersion || null;
          settings.recommendedWorkerVersion = recommendedWorkerVersion || null;

          await ctx.store.upsert(settings);
        }
      } catch (e: any) {
        ctx.log.warn(e);
      }

      await ctx.store.upsert(activeWorkers);

      ctx.log.info(
        `workers online of ${activeWorkers.length} updated. ${data?.length} workers online`,
      );
    }
  });
}

const metricsUpdateInterval = 30 * MINUTE_MS;
let lastMetricsUpdateTimestamp = -1;
let lastMetricsUpdateOffset = 0;

type WorkerStat = {
  peerId: string;
  uptime24Hours: number;
  responseBytes24Hours: string;
  readChunks24Hours: string;
  queryCount24Hours: string;
  uptime90Days: number;
  responseBytes90Days: string;
  readChunks90Days: string;
  queryCount90Days: string;
  dayUptimes: [date: string, uptime: number][];
};

export function listenMetricsUpdate(ctx: MappingContext) {
  if (!ctx.isHead) return;

  const statsUrl = process.env.NETWORK_STATS_URL;
  if (!statsUrl) return;

  ctx.log.debug(`listening for worker stats updates`);

  ctx.events.on(Events.Initialization, async (block) => {
    if (
      block.timestamp - metricsUpdateInterval >
      lastMetricsUpdateTimestamp + lastMetricsUpdateOffset
    ) {
      const { timestamp, data }: { timestamp: string; data: WorkerStat[] } = await client
        .get(joinUrl(statsUrl, '/workers/stats.json'))
        .then((r) => JSON.parse(r));

      const snapshotTimestamp = new Date(timestamp).getTime();
      if (snapshotTimestamp === lastMetricsUpdateTimestamp) {
        lastMetricsUpdateOffset = lastMetricsUpdateOffset
          ? Math.min(lastMetricsUpdateOffset * 2, metricsUpdateInterval)
          : MINUTE_MS;
        return;
      }

      const workersStats = keyBy(data, (w) => w.peerId);
      const activeWorkers = await ctx.store.find(Worker, {
        where: { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
      });

      for (const worker of activeWorkers) {
        const data = workersStats[worker.peerId];

        worker.servedData90Days = data ? BigInt(data.responseBytes90Days) : 0n;
        worker.scannedData90Days = data ? BigInt(data.readChunks90Days) : 0n;
        worker.queries90Days = data ? BigInt(data.queryCount90Days) : 0n;

        worker.servedData24Hours = data ? BigInt(data.responseBytes24Hours) : 0n;
        worker.scannedData24Hours = data ? BigInt(data.readChunks24Hours) : 0n;
        worker.queries24Hours = data ? BigInt(data.queryCount24Hours) : 0n;

        const createdTimestamp = worker.createdAt.getTime();

        worker.uptime24Hours = data
          ? toPercent(
              createdTimestamp > snapshotTimestamp - DAY_MS
                ? data.uptime24Hours / ((snapshotTimestamp - createdTimestamp) / DAY_MS)
                : data.uptime24Hours,
            )
          : null;

        if (data?.dayUptimes) {
          const dayUptimes = keyBy(data.dayUptimes, ([date]) => new Date(date).getTime());

          worker.dayUptimes = [];

          const from = toStartOfDay(createdTimestamp);
          const to = toStartOfDay(snapshotTimestamp);

          for (let t = from; t <= to; t += DAY_MS) {
            let uptime = dayUptimes[t]?.[1] ?? 0;

            if (t === from) {
              uptime = uptime / ((t + DAY_MS - createdTimestamp) / DAY_MS);
            }

            if (t === to) {
              uptime = uptime / ((snapshotTimestamp - to - MINUTE_MS) / DAY_MS);
            }

            worker.dayUptimes.push(
              new WorkerDayUptime({ timestamp: new Date(t), uptime: toPercent(uptime) }),
            );
          }

          worker.uptime90Days = worker.dayUptimes
            .slice(-90)
            .reduce((s, i, _, arr) => s + i.uptime / arr.length, 0);
        } else {
          worker.dayUptimes = null;
          worker.uptime90Days = null;
        }
      }

      await ctx.store.upsert(activeWorkers);

      lastMetricsUpdateTimestamp = snapshotTimestamp;
      lastMetricsUpdateOffset = 0;

      ctx.log.info(`workers stats of ${activeWorkers.length} updated`);
    }
  });
}

const rewardMetricsUpdateInterval = 30 * MINUTE_MS;
let lastRewardMetricsUpdateTimestamp = -1;
let lastRewardMetricsUpdateOffset = 0;

type RewardStat = {
  id: string;
  traffic: {
    trafficWeight: number;
  };
  liveness: {
    livenessCoefficient: number;
    tenure: number;
  };
};

export function listenRewardMetricsUpdate(ctx: MappingContext) {
  if (!ctx.isHead) return;

  const monitorUrl = process.env.REWARDS_MONITOR_API_URL;
  if (!monitorUrl) return;

  ctx.log.debug(`listening for worker reward stats updates`);

  ctx.events.on(Events.Initialization, async (block) => {
    if (
      block.timestamp - rewardMetricsUpdateInterval >
      lastRewardMetricsUpdateTimestamp + lastRewardMetricsUpdateOffset
    ) {
      const { rewardEpochLength: rewardEpochLength_ } = await client.get(
        joinUrl(monitorUrl, `/config`),
      );
      const rewardEpochLength = rewardEpochLength_ * 2;

      const snapshotTimestamp = toStartOfInterval(block.timestamp, rewardMetricsUpdateInterval);
      if (snapshotTimestamp > lastRewardMetricsUpdateTimestamp) {
        lastRewardMetricsUpdateTimestamp = snapshotTimestamp;
        lastRewardMetricsUpdateOffset = 0;
      }

      const endBlock = await ctx.store.findOne(Block, {
        where: { timestamp: MoreThanOrEqual(new Date(snapshotTimestamp)) },
        order: { id: 'ASC' },
      });
      if (!endBlock) {
        ctx.log.warn(`unable to fetch rewards starts: end block not found`);
        return;
      }

      const startBlock = await ctx.store.findOne(Block, {
        where: { l1BlockNumber: MoreThanOrEqual(endBlock.l1BlockNumber - rewardEpochLength) },
        order: { id: 'ASC' },
      });
      if (!startBlock) {
        ctx.log.warn(`unable to fetch rewards starts: start block not found`);
        return;
      }

      let res: { workers: RewardStat[] };
      try {
        res = await client.get(
          joinUrl(monitorUrl, `/rewards/${startBlock.l1BlockNumber}/${endBlock.l1BlockNumber}`),
        );
      } catch (e) {
        if (e instanceof HttpError || e instanceof HttpTimeoutError) {
          ctx.log.warn(e);
          lastRewardMetricsUpdateOffset = lastRewardMetricsUpdateOffset
            ? Math.min(lastRewardMetricsUpdateOffset * 2, metricsUpdateInterval)
            : 5 * MINUTE_MS;
          return;
        }

        throw e;
      }
      const { workers: data } = res;

      const workersStats = keyBy(data, (w) => w.id);
      const activeWorkers = await ctx.store.find(Worker, {
        where: { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
      });

      for (const worker of activeWorkers) {
        const data = workersStats[worker.peerId];

        worker.trafficWeight = data?.traffic.trafficWeight ?? null;
        worker.dTenure = data?.liveness.tenure ?? null;
        worker.liveness = data?.liveness.livenessCoefficient ?? null;
      }

      await ctx.store.upsert(activeWorkers);

      lastRewardMetricsUpdateTimestamp = snapshotTimestamp;
      lastRewardMetricsUpdateOffset = 0;

      ctx.log.info(`workers reward stats of ${activeWorkers.length} updated`);

      await recalculateWorkerAprs(ctx);
    }
  });
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
