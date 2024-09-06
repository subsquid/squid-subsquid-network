import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createWorkerId } from '../helpers/ids';

import * as WorkerRegistry from '~/abi/WorkerRegistration';
import { network } from '~/config/network';
import { Worker } from '~/model';

export const handleExcessiveBondReturned = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.WorkerRegistry.address) &&
      isLog(item) &&
      WorkerRegistry.events.ExcessiveBondReturned.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const { workerId: workerIndex, amount } =
      WorkerRegistry.events.ExcessiveBondReturned.decode(log);

    const workerId = createWorkerId(workerIndex);
    const workerDeferred = ctx.store.defer(Worker, workerId);

    ctx.tasks.add(async () => {
      const worker = await workerDeferred.getOrFail();
      worker.bond -= amount;
      await ctx.store.upsert(worker);
    });
  },
});
