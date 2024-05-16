import { HttpClient } from '@subsquid/http-client';
import { keyBy, last } from 'lodash';
import { In } from 'typeorm';

import { Events, MappingContext } from '../types';

import { WorkerStatus, Worker, WorkerReward, Commitment, WorkerDayUptime } from '~/model';
import { toPercent } from '~/utils/misc';
import { DAY_MS, MINUTE_MS, toEndOfDay, toStartOfDay } from '~/utils/time';

const client = process.env.NETWORK_STATS_URL
  ? new HttpClient({
      baseUrl: process.env.NETWORK_STATS_URL,
    })
  : undefined;

const onlineUpdateInterval = 5 * MINUTE_MS;
let lastOnlineUpdateTimestamp = -1;
let lastOnlineUpdateOffest = 0;

type WorkerOnline = {
  peerId: string;
  jailed: boolean;
  lastDialOk: boolean;
  storedBytes: string;
  version: string;
  jailReason: string;
};

export function listenOnlineUpdate(ctx: MappingContext) {
  if (!client) return;

  ctx.log.debug(`listening for worker online updates`);

  ctx.events.on(Events.BlockEnd, async (block) => {
    if (
      block.timestamp - onlineUpdateInterval >=
      lastOnlineUpdateTimestamp + lastOnlineUpdateOffest
    ) {
      const { timestamp, data }: { timestamp: string; data: WorkerOnline[] } = await client
        .get('/workers/online.json')
        .then((r) => JSON.parse(r));

      const snapshotTimestamp = new Date(timestamp).getTime();
      if (snapshotTimestamp === lastOnlineUpdateTimestamp) {
        lastOnlineUpdateOffest += MINUTE_MS;
        return;
      }

      const onlineWorkers = keyBy(data, (w) => w.peerId);
      const activeWorkers = await ctx.store.find(Worker, {
        where: {
          status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]),
        },
      });

      for (const worker of activeWorkers) {
        const data = onlineWorkers[worker.peerId];

        worker.online = data ? !data.jailed && data.lastDialOk : false;
        worker.jailed = data ? data.jailed : null;
        worker.dialOk = data ? data.lastDialOk : null;
        worker.storedData = data ? BigInt(data.storedBytes) : null;
        worker.version = data ? data.version : null;
        worker.jailReason = data ? data.jailReason : null;
      }

      await ctx.store.upsert(activeWorkers);

      lastOnlineUpdateTimestamp = snapshotTimestamp;
      lastOnlineUpdateOffest = 0;

      ctx.log.info(
        `workers online of ${activeWorkers.length} updated. ${data?.length} workers online`,
      );
    }
  });
}

const metricsUpdateInterval = 30 * MINUTE_MS;
let lastMetricsUpdateTimestamp = -1;
let lastMetricsUpdateOffest = 0;

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
  if (!client) return;

  ctx.log.debug(`listening for worker stats updates`);

  ctx.events.on(Events.BlockEnd, async (block) => {
    if (
      block.timestamp - metricsUpdateInterval >
      lastMetricsUpdateTimestamp + lastMetricsUpdateOffest
    ) {
      const { timestamp, data }: { timestamp: string; data: WorkerStat[] } = await client
        .get('/workers/stats.json')
        .then((r) => JSON.parse(r));

      const snapshotTimestamp = new Date(timestamp).getTime();
      if (snapshotTimestamp === lastMetricsUpdateTimestamp) {
        lastMetricsUpdateOffest += MINUTE_MS;
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

        if (data?.dayUptimes) {
          const dayUptimes = keyBy(data.dayUptimes, ([date]) => new Date(date).getTime());

          worker.dayUptimes = [];

          const createdTimestamp = worker.createdAt.getTime();
          const from = toStartOfDay(createdTimestamp);
          const to = toStartOfDay(snapshotTimestamp);

          for (let t = from; t <= to; t += DAY_MS) {
            let uptime = dayUptimes[t]?.[1] ?? 0;

            if (t === from) {
              uptime = uptime / ((t + DAY_MS - createdTimestamp) / DAY_MS);
            }

            if (t === to) {
              uptime = uptime / ((snapshotTimestamp - to - 1) / DAY_MS);
            }

            worker.dayUptimes.push(
              new WorkerDayUptime({ timestamp: new Date(t), uptime: toPercent(uptime) }),
            );
          }

          worker.uptime24Hours = last(worker.dayUptimes)?.uptime ?? null;
          worker.uptime90Days = worker.dayUptimes
            .slice(-90)
            .reduce((s, i, _, arr) => s + i.uptime / arr.length, 0);
        } else {
          worker.dayUptimes = null;
          worker.uptime24Hours = null;
          worker.uptime90Days = null;
        }
      }

      await ctx.store.upsert(activeWorkers);

      lastMetricsUpdateTimestamp = snapshotTimestamp;
      lastMetricsUpdateOffest = 0;

      ctx.log.info(`workers stats of ${activeWorkers.length} updated`);
    }
  });
}

let INIT_APRS = false;

export function listenRewardsDistributed(ctx: MappingContext) {
  if (!INIT_APRS) {
    ctx.events.on(Events.Initialization, async () => {
      await calculateAprs(ctx);
    });

    INIT_APRS = true;
  }

  ctx.events.on(Events.RewardsDistibuted, async () => {
    await calculateAprs(ctx);
  });
}

export async function calculateAprs(ctx: MappingContext) {
  const activeWorkers = await ctx.store.find(Worker, {
    where: { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
  });

  const commitments = await ctx.store.find(Commitment, { take: 7, order: { id: 'DESC' } });

  for (const worker of activeWorkers) {
    const apr = commitments.reduce(
      (r, c) => {
        const payment = c.recipients.find((r) => r.workerId === worker.id);

        if (payment) {
          r.worker += payment.workerApr;
          r.staker += payment.stakerApr;
          r.count += 1;
        }
        return r;
      },
      { worker: 0, staker: 0, count: 0 },
    );

    if (apr.count > 0) {
      worker.apr = apr.worker / apr.count;
      worker.stakerApr = worker.delegationCount > 0 ? apr.staker / apr.count : null;
    } else {
      worker.apr = null;
      worker.stakerApr = null;
    }
  }

  await ctx.store.upsert(activeWorkers);

  ctx.log.info(`workers aprs of ${activeWorkers.length} updated`);
}
