import { isContract, isLog, LogItem } from '../../item'
import { createHandlerOld } from '../base'
import { createWorkerId } from '../helpers/ids'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import { network } from '~/config/network'
import { Settings, Worker } from '~/model'

export const handleExcessiveBondReturned = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.ExcessiveBondReturned.is(item.value)
  },
  handle(ctx, { value: log }) {
    const { workerId: workerIndex, amount } =
      WorkerRegistry.events.ExcessiveBondReturned.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, workerId)

    return async () => {
      const settings = await ctx.store.getOrFail(Settings, network.name)
      if (log.address !== settings.contracts.workerRegistration) return

      const worker = await workerDeferred.getOrFail()
      worker.bond -= amount
      await ctx.store.upsert(worker)
    }
  },
})
