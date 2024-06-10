import { BigDecimal } from '@subsquid/big-decimal';
import { In } from 'typeorm';

import { Events, MappingContext } from '../types';

import { Multicall } from '~/abi/multicall';
import * as SoftCap from '~/abi/SoftCap';
import { network } from '~/config/network';
import { Block } from '~/config/processor';
import { Statistics, Worker, WorkerStatus } from '~/model';

let INIT_CAPS = false;

export function listenUpdateWorkersCap(ctx: MappingContext) {
  if (!INIT_CAPS) {
    ctx.events.on(Events.Initialization, async (block) => {
      await updateWorkersCap(ctx, block, true);
    });

    INIT_CAPS = true;
  }

  ctx.events.on(Events.Finalization, async (block) => {
    await updateWorkersCap(ctx, block);
  });
}

async function updateWorkersCap(ctx: MappingContext, block: Block, all = false) {
  if (!all && ctx.delegatedWorkers.size === 0) return;

  const multicall = new Multicall(ctx, block, network.contracts.Multicall3);

  const workers = await ctx.store.find(Worker, {
    where: all ? {} : { id: In([...ctx.delegatedWorkers]) },
  });
  if (workers.length === 0) return;

  const capedDelegations = await multicall.aggregate(
    SoftCap.functions.capedStake,
    network.contracts.SoftCap,
    workers.map((w) => ({
      workerId: BigInt(w.id),
    })),
    100,
  );

  workers.forEach((w, i) => {
    const capedDelegation = capedDelegations[i];
    w.capedDelegation = capedDelegation;
  });

  await ctx.store.upsert(workers);

  ctx.recalculateAprs = true;
}

export function scheduleUpdateWorkerAprs(ctx: MappingContext) {
  ctx.events.on(Events.Finalization, async (block) => {
    if (!ctx.recalculateAprs) return;
    await recalculateWorkerAprs(ctx);
  });
}

async function recalculateWorkerAprs(ctx: MappingContext) {
  const statistics = await ctx.store.getOrFail(Statistics, network.name);

  const workers = await ctx.store.find(Worker, {
    where: { status: WorkerStatus.ACTIVE },
  });

  const baseApr = BigDecimal(0.2);
  const utilizedStake = workers.reduce(
    (r, w) => (w.liveness ? r + w.bond + w.capedDelegation : r),
    0n,
  );

  statistics.baseApr = baseApr.toNumber();
  statistics.utilizedStake = utilizedStake;

  for (const worker of workers) {
    const supplyRatio = BigDecimal(worker.capedDelegation).add(worker.bond).div(utilizedStake);

    const dTraffic = Math.min(
      BigDecimal(worker.trafficWeight || 0)
        .div(supplyRatio)
        .toNumber() ** 0.1,
      1,
    );

    const actualYield = baseApr
      .mul(worker.liveness || 0)
      .mul(dTraffic)
      .mul(worker.dTenure || 0);

    const workerReward = actualYield.mul(worker.bond + worker.capedDelegation / 2n);
    worker.apr = workerReward.div(worker.bond).mul(100).toNumber();

    const stakerReward = actualYield.mul(worker.capedDelegation / 2n);
    worker.stakerApr = worker.totalDelegation
      ? stakerReward.div(worker.totalDelegation).mul(100).toNumber()
      : null;
  }

  await ctx.store.upsert(workers);
  await ctx.store.upsert(statistics);
}
