import {
  type LogItem,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  createHandlerOld,
  createWorkerId,
  isLog,
  timed,
  toHumanSQD,
} from '@sqd/shared'
import * as WorkerRegistry from '@sqd/shared/lib/abi/WorkerRegistration'

import { Worker } from '~/model'

export const handleExcessiveBondReturned = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.ExcessiveBondReturned.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const { workerId: workerIndex, amount } =
      WorkerRegistry.events.ExcessiveBondReturned.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, workerId)

    return timed(ctx, async (elapsed) => {
      const worker = await workerDeferred.getOrFail()
      worker.bond -= amount

      ctx.log.info(
        `worker(${worker.id}) returned excessive bond ${toHumanSQD(amount)} (${elapsed()}ms)`,
      )
    })
  },
})
