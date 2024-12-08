import assert from 'assert';

import { MappingContext } from '../../types';

import { Delegation, Queue } from '~/model';

export const DELEGATION_UNLOCK_QUEUE = 'delegation-unlock';

export type DelegationUnlockTask = {
  id: string;
};

export async function ensureDelegationUnlockQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrInsert(
    Queue<DelegationUnlockTask>,
    DELEGATION_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  );

  for (const task of queue.tasks) {
    ctx.store.defer(Delegation, task.id);
  }
}

export async function addToDelegationUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<DelegationUnlockTask>, DELEGATION_UNLOCK_QUEUE);

  if (queue.tasks.some((task) => task.id === id)) return;
  queue.tasks.push({ id });

  await ctx.store.upsert(queue);
}

export async function processDelegationUnlockQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number },
) {
  const queue = await ctx.store.getOrFail(Queue<DelegationUnlockTask>, DELEGATION_UNLOCK_QUEUE);

  const tasks: DelegationUnlockTask[] = [];
  for (const task of queue.tasks) {
    const delegation = await ctx.store.getOrFail(Delegation, task.id);
    assert(delegation.lockEnd);
    if (delegation.lockEnd > block.l1BlockNumber) return;

    delegation.locked = false;
    await ctx.store.upsert(delegation);

    ctx.log.info(`delegation(${delegation.id}) unlocked`);
  }

  queue.tasks = tasks;
  await ctx.store.upsert(queue);
}
