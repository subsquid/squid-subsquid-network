import { HttpClient } from '@subsquid/http-client';
import { keyBy } from 'lodash';
import { In } from 'typeorm';

import { Events, MappingContext } from '../types';

import { WorkerStatus, Worker, WorkerReward, Commitment } from '~/model';
import { toPercent } from '~/utils/misc';
import { MINUTE_MS } from '~/utils/time';

const client = new HttpClient({
  baseUrl: process.env.NETWORK_STATS_URL,
});

const onlineUpdateInterval = 5 * MINUTE_MS;
let lastOnlineUpdateTimestamp = -1;
let lastOnlineUpdateOffest = 0;

type WorkerOnline = {
  peerId: string;
  jailed: boolean;
  lastDialOk: boolean;
  storedBytes: string;
  version: string;
  jailedReason: string;
};

export function listenOnlineUpdate(ctx: MappingContext) {
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
};

export function listenMetricsUpdate(ctx: MappingContext) {
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

        worker.uptime90Days = data ? toPercent(data.uptime90Days) : 0;
        worker.servedData90Days = data ? BigInt(data.responseBytes90Days) : 0n;
        worker.scannedData90Days = data ? BigInt(data.readChunks90Days) : 0n;
        worker.queries90Days = data ? BigInt(data.queryCount90Days) : 0n;

        worker.uptime24Hours = data ? toPercent(data.uptime24Hours) : 0;
        worker.servedData24Hours = data ? BigInt(data.responseBytes24Hours) : 0n;
        worker.scannedData24Hours = data ? BigInt(data.readChunks24Hours) : 0n;
        worker.queries24Hours = data ? BigInt(data.queryCount24Hours) : 0n;
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

  const commitments = await ctx.store.find(Commitment, { take: 30, order: { id: 'DESC' } });

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

    if (apr.count) {
      worker.apr = apr.worker / apr.count;
      worker.stakerApr = apr.staker / apr.count;
    }
  }

  await ctx.store.upsert(activeWorkers);

  ctx.log.info(`workers aprs of ${activeWorkers.length} updated`);
}
