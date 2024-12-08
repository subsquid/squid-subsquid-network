import assert from 'assert';

import { MappingContext } from '../../types';

import { GatewayStake, Queue } from '~/model';

export const STAKE_APPLY_QUEUE = 'stake-apply';

export type StakeApplyTask = {
  id: string;
};

export async function ensureGatewayStakeApply(ctx: MappingContext) {
  const queue = await ctx.store.getOrInsert(
    Queue<StakeApplyTask>,
    STAKE_APPLY_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  );

  for (const task of queue.tasks) {
    ctx.store.defer(GatewayStake, task.id);
  }
}

export async function addToGatewayStakeApplyQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<StakeApplyTask>, STAKE_APPLY_QUEUE);

  if (queue.tasks.some((task) => task.id === id)) return;
  queue.tasks.push({ id });

  await ctx.store.upsert(queue);
}

export async function processGatewayStakeApplyQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number },
) {
  const queue = await ctx.store.getOrFail(Queue<StakeApplyTask>, STAKE_APPLY_QUEUE);

  const tasks: StakeApplyTask[] = [];
  for (const task of queue.tasks) {
    const stake = await ctx.store.getOrFail(GatewayStake, task.id);
    if (stake.lockStart && stake.lockStart > block.l1BlockNumber) {
      tasks.push(task);
      continue;
    }

    assert(
      stake.computationUnitsPending != null,
      `pending computation units is equal to ${stake.computationUnitsPending}`,
    );

    stake.computationUnits = stake.computationUnitsPending;
    stake.computationUnitsPending = null;
    await ctx.store.upsert(stake);

    ctx.log.info(`stake(${stake.id}) applied`);
  }

  queue.tasks = tasks;
  await ctx.store.upsert(queue);
}
