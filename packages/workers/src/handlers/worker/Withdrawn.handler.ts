import {
  type LogItem,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  createHandlerOld,
  createWorkerId,
  createWorkerStatusId,
  isLog,
  timed,
  toHumanSQD,
} from '@sqd/shared'
import * as WorkerRegistry from '@sqd/shared/lib/abi/WorkerRegistration'

import { Worker, WorkerStatus, WorkerStatusChange } from '~/model'

export const handleWorkerWithdrawn = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.WorkerWithdrawn.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const { workerId: workerIndex } = WorkerRegistry.events.WorkerWithdrawn.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, workerId)

    return timed(ctx, async (elapsed) => {
      const worker = await workerDeferred.getOrFail()

      const statusChange = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
        worker,
        blockNumber: log.block.l1BlockNumber,
        timestamp: new Date(log.block.timestamp),
        status: WorkerStatus.WITHDRAWN,
        pending: false,
      })
      await ctx.store.track(statusChange)

      worker.status = statusChange.status
      worker.bond = 0n

      ctx.log.info(`worker(${worker.id}) withdrawn (${elapsed()}ms)`)
    })
  },
})
