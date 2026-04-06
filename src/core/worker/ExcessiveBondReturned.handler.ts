import { LogItem, isLog } from '../../item'
import { createHandlerOld, timed } from '../base'
import { createWorkerId } from '../helpers/ids'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import { network } from '~/config/network'
import { WORKER_REGISTRATION_TEMPLATE_KEY } from '~/config/queries/workersRegistry'
import { Settings, TransferType, Worker } from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleExcessiveBondReturned = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.ExcessiveBondReturned.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const { workerId: workerIndex, amount } =
      WorkerRegistry.events.ExcessiveBondReturned.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, { id: workerId, relations: { owner: true } })

    return timed(ctx, async (elapsed) => {
      const settings = await ctx.store.getOrFail(Settings, network.name)

      const worker = await workerDeferred.getOrFail()
      worker.bond -= amount

      const transfer = findTransfer(log.transaction?.logs ?? [], {
        to: worker.owner.id,
        from: log.address,
        logIndex: log.logIndex - 1,
      })
      if (!transfer) {
        throw new Error(`transfer not found for worker(${worker.id})`)
      }
      await saveTransfer(ctx, transfer, {
        type: TransferType.WITHDRAW,
        worker,
      })

      ctx.log.info(
        `account(${worker.owner.id}) returned excessive bond ${toHumanSQD(amount)} from worker(${worker.id}) (${elapsed()}ms)`,
      )
    })
  },
})
