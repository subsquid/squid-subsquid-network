import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createWorkerId, createWorkerStatusId } from '../helpers/ids';

import * as WorkerRegistry from '~/abi/WorkerRegistration';
import { network } from '~/config/network';
import { WorkerStatusChange, WorkerStatus, Worker } from '~/model';
import { toHumanSQD } from '~/utils/misc';

export const handleWorkerWithdrawn = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.WorkerRegistry) &&
      isLog(item) &&
      WorkerRegistry.events.WorkerWithdrawn.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const { workerId: workerIndex } = WorkerRegistry.events.WorkerWithdrawn.decode(log);

    const workerId = createWorkerId(workerIndex);
    const workerDeferred = ctx.store.defer(Worker, {
      id: workerId,
      relations: { realOwner: true },
    });

    return async () => {
      const worker = await workerDeferred.getOrFail();

      const statusChange = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
        worker,
        blockNumber: log.block.l1BlockNumber,
        timestamp: new Date(log.block.timestamp),
        status: WorkerStatus.WITHDRAWN,
        pending: false,
      });
      await ctx.store.insert(statusChange);

      worker.status = statusChange.status;
      worker.bond = 0n;

      await ctx.store.upsert(worker);

      ctx.log.info(
        `account(${worker.realOwner.id}) unbonded ${toHumanSQD(worker.bond)} from worker(${worker.id})`,
      );
    };
  },
});
