import assert from 'assert';

import { MappingContext } from '../../types';

import { Worker, Queue } from '~/model';

export const WORKER_UNLOCK_QUEUE = 'worker-unlock';

export type WorkerUnlockTask = {
  id: string;
};

export async function ensureWorkerUnlock(ctx: MappingContext) {
  const queue = await ctx.store.getOrInsert(
    Queue<WorkerUnlockTask>,
    WORKER_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  );

  for (const task of queue.tasks) {
    ctx.store.defer(Worker, task.id);
  }
}

export async function addToWorkerUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<WorkerUnlockTask>, WORKER_UNLOCK_QUEUE);

  if (queue.tasks.some((task) => task.id === id)) return;
  queue.tasks.push({ id });

  await ctx.store.upsert(queue);

  ctx.store.defer(Worker, id);
}

export async function removeFromWorkerUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<WorkerUnlockTask>, WORKER_UNLOCK_QUEUE);

  queue.tasks = queue.tasks.filter((task) => task.id !== id);

  await ctx.store.upsert(queue);
}

export async function processWorkerUnlockQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number },
) {
  const queue = await ctx.store.getOrFail(Queue<WorkerUnlockTask>, WORKER_UNLOCK_QUEUE);

  const tasks: WorkerUnlockTask[] = [];
  for (const task of queue.tasks) {
    const worker = await ctx.store.getOrFail(Worker, task.id);
    assert(worker.locked, `worker(${worker.id}) is not locked`);
    if (worker.lockEnd! > block.l1BlockNumber) return;

    worker.locked = false;

    await ctx.store.upsert(worker);

    ctx.log.info(`worker(${worker.id}) unlocked`);
  }

  queue.tasks = tasks;
  await ctx.store.upsert(queue);
}
