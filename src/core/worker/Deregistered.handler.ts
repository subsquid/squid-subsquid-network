import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createWorkerId, createWorkerStatusId } from '../helpers/ids';

import { listenStatusCheck } from './CheckStatus.listener';

import * as WorkerRegistry from '~/abi/WorkerRegistration';
import { network } from '~/config/network';
import { WorkerStatusChange, WorkerStatus, Worker } from '~/model';

export const handleWorkerDeregistered = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.WorkerRegistry) &&
      isLog(item) &&
      WorkerRegistry.events.WorkerDeregistered.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const { workerId: workerIndex, deregistedAt } =
      WorkerRegistry.events.WorkerDeregistered.decode(log);

    const workerId = createWorkerId(workerIndex);
    const workerDeferred = ctx.store.defer(Worker, {
      id: workerId,
      relations: { realOwner: true },
    });

    ctx.queue.add(async () => {
      const worker = await workerDeferred.getOrFail();
      if (worker.status === WorkerStatus.DEREGISTERING) return; // handle contract bug with duplicated deregistering calls

      const statusChange = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
        worker,
        blockNumber: log.block.l1BlockNumber,
        timestamp: new Date(log.block.timestamp),
        status: WorkerStatus.DEREGISTERING,
        pending: false,
      });
      await ctx.store.insert(statusChange);

      worker.status = statusChange.status;
      await ctx.store.upsert(worker);

      const pendingStatusChange = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, deregistedAt),
        worker,
        blockNumber: Number(deregistedAt),
        status: WorkerStatus.DEREGISTERED,
        pending: true,
      });
      await ctx.store.insert(pendingStatusChange);

      listenStatusCheck(ctx, pendingStatusChange.id);

      ctx.log.info(`account(${worker.realOwner.id}) deregistered worker(${worker.id})`);
    });
  },
});
