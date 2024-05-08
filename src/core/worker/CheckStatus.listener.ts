import assert from 'assert';

import { MappingContext, Events } from '../../types';
import { resetWorkerStats } from '../helpers/entities';

import { listenUnlockCheck } from './CheckUnlock.listener';

import { network } from '~/config/network';
import { WorkerStatusChange, WorkerStatus, Worker, Settings } from '~/model';

export function listenStatusCheck(ctx: MappingContext, id: string) {
  const statusDeferred = ctx.store.defer(WorkerStatusChange, {
    id,
    relations: { worker: true },
  });
  const settingsDefer = ctx.store.defer(Settings, { id: network.name });

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
        resetWorkerStats(worker);

        const settings = await settingsDefer.getOrFail();

        if (settings.epochLength) {
          worker.lockEnd = block.l1BlockNumber + settings.epochLength;

          listenUnlockCheck(ctx, worker.id);
        }
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
