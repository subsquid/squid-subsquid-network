import assert from 'assert';

import { MappingContext, Events } from '../../types';

import { WorkerStatusChange, WorkerStatus, Worker } from '~/model';

export function listenStatusCheck(ctx: MappingContext, id: string) {
  const statusDeferred = ctx.store.defer(WorkerStatusChange, {
    id,
    relations: { worker: true },
  });

  const listenerId = `worker-status-check-${id}`;
  ctx.events.off(Events.BlockStart, listenerId);
  ctx.events.on(
    Events.BlockStart,
    async (block: { l1BlockNumber: number; timestamp: number }) => {
      const statusChange = await statusDeferred.getOrFail();
      assert(statusChange.pending, `status ${id} is not pending`);
      if (statusChange.blockNumber > block.l1BlockNumber) return;

      statusChange.pending = false;
      if (
        statusChange.blockNumber >= block.l1BlockNumber &&
        statusChange.blockNumber < block.l1BlockNumber + 10
      ) {
        statusChange.timestamp = new Date(block.timestamp);
      }
      await ctx.store.upsert(statusChange);

      const worker = statusChange.worker;
      worker.status = statusChange.status;

      if (worker.status === WorkerStatus.DEREGISTERED) {
        worker.storedData = null;
        worker.queries24Hours = null;
        worker.queries90Days = null;
        worker.scannedData24Hours = null;
        worker.scannedData90Days = null;
        worker.servedData24Hours = null;
        worker.servedData90Days = null;
        worker.uptime24Hours = null;
        worker.uptime90Days = null;
        worker.apr = null;
        worker.stakerApr = null;
      }

      ctx.log.info(`status of worker(${worker.id}) changed to ${worker.status}`);

      await ctx.store.upsert(worker);

      ctx.events.off(Events.BlockStart, listenerId);
    },
    {
      id: listenerId,
    },
  );
}
