import { In } from 'typeorm';

import { Events, MappingContext } from '../types';

import { Multicall } from '~/abi/multicall';
import * as SoftCap from '~/abi/SoftCap';
import { network } from '~/config/network';
import { Block } from '~/config/processor';
import { Worker } from '~/model';

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

  const capedDelegations = await multicall.aggregate(
    SoftCap.functions.capedStake,
    network.contracts.SoftCap,
    workers.map((w) => ({
      workerId: BigInt(w.id),
    })),
    100,
  );

  workers.forEach((w, i) => {
    w.capedDelegation = capedDelegations[i];
  });

  await ctx.store.upsert(workers);
}
