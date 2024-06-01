import assert from 'assert';

import { BigDecimal } from '@subsquid/big-decimal';
import { HttpClient } from '@subsquid/http-client';
import { keyBy, last } from 'lodash';
import { And, In, LessThan, MoreThanOrEqual } from 'typeorm';

import { Events, MappingContext } from '../types';

import { Block } from '~/config/processor';
import { WorkerStatus, Worker, WorkerReward, Commitment, WorkerDayUptime } from '~/model';
import { toPercent } from '~/utils/misc';
import { DAY_MS, MINUTE_MS, toEndOfDay, toStartOfDay, YEAR_MS } from '~/utils/time';

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
              uptime = uptime / ((snapshotTimestamp - to - MINUTE_MS) / DAY_MS);
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

  ctx.events.on(Events.RewardsDistributed, async () => {
    await calculateAprs(ctx);
  });
}

export async function calculateAprs(ctx: MappingContext) {
  const lastCommitments = await ctx.store.find(Commitment, { order: { id: 'DESC' }, take: 2 });
  if (lastCommitments.length === 0) return;

  const commitments = await ctx.store.find(Commitment, {
    where: { to: MoreThanOrEqual(new Date(lastCommitments[0].to!.getTime() - 7 * DAY_MS)) },
    order: { id: 'asc' },
  });

  const commitmentsOld = lastCommitments[1]
    ? await ctx.store.find(Commitment, {
        where: {
          to: And(
            MoreThanOrEqual(new Date(lastCommitments[1].to!.getTime() - 7 * DAY_MS)),
            LessThan(lastCommitments[0].to),
          ),
        },
        order: { id: 'asc' },
      })
    : [];

  const activeWorkers = await ctx.store.find(Worker, {
    where: { status: In([WorkerStatus.ACTIVE]) },
  });

  for (const worker of activeWorkers) {
    const { workerApr, stakerApr } = calculateApr(worker, commitments);
    const { workerApr: workerAprOld, stakerApr: stakerAprOld } = calculateApr(
      worker,
      commitmentsOld,
    );

    worker.apr = workerApr;
    worker.aprDiff = workerApr !== null ? workerApr - (workerAprOld ?? 0) : null;
    worker.stakerApr = stakerApr;
    worker.stakerAprDiff = stakerApr !== null ? stakerApr - (stakerAprOld ?? 0) : null;
  }

  await ctx.store.upsert(activeWorkers);

  ctx.log.info(`workers aprs of ${activeWorkers.length} updated`);
}

function calculateApr(worker: Worker, commitments: Commitment[]) {
  const intervalFrom = commitments[0].from!.getTime();
  const intervalTo = last(commitments)!.to!.getTime();

  let workerApr: number | null = null;
  let stakerApr: number | null = null;

  const createdAt = worker.createdAt.getTime();
  const interval = intervalTo - Math.max(createdAt, intervalFrom);

  if (interval > 0) {
    for (const commitment of commitments) {
      const payment = commitment.recipients.find((r) => r.workerId === worker.id);
      if (!payment) continue;

      const commitmentIntervalFrom = commitment.from!.getTime();
      const commitmentIntervalTo = commitment.to!.getTime();
      const commitmentInterval = commitmentIntervalTo - Math.max(createdAt, commitmentIntervalFrom);
      if (commitmentInterval <= 0) continue;

      const mul = commitmentInterval / interval;

      workerApr = (workerApr ?? 0) + payment.workerApr * mul;
      stakerApr = (stakerApr ?? 0) + payment.stakerApr * mul;
    }
  }
  return { workerApr, stakerApr };
}
