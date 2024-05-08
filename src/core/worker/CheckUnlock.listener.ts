import assert from 'assert';

import { MappingContext, Events } from '../../types';

import { Worker } from '~/model';

export function listenUnlockCheck(ctx: MappingContext, id: string) {
  const workerDeferred = ctx.store.defer(Worker, {
    id,
  });

  const listenerId = `worker-unlock-check-${id}`;
  ctx.events.off(Events.BlockStart, listenerId);
  ctx.events.on(
    Events.BlockStart,
    async (block: { l1BlockNumber: number; timestamp: number }) => {
      const worker = await workerDeferred.getOrFail();
      assert(worker.locked, `worker ${id} is not locked`);
      if (worker.lockEnd! > block.l1BlockNumber) return;

      worker.locked = false;

      await ctx.store.upsert(worker);

      ctx.log.info(`worker(${worker.id}) unlocked`);

      ctx.events.off(Events.BlockStart, listenerId);
    },
    {
      id: listenerId,
    },
  );
}
