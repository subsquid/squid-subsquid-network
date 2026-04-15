import {
  WORKER_REGISTRATION_TEMPLATE_KEY,
  createHandler,
  createWorkerId,
  createWorkerStatusId,
  isLog,
  network,
  timed,
} from '@sqd/shared'
import * as WorkerRegistry from '@sqd/shared/lib/abi/WorkerRegistration'

import { Settings, Worker, WorkerStatus, WorkerStatusChange } from '~/model'
import { addToWorkerStatusApplyQueue } from './WorkerStatusApply.queue'
import { addToWorkerUnlockQueue } from './WorkerUnlock.queue'

export const handleWorkerDeregistered = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!WorkerRegistry.events.WorkerDeregistered.is(item.value)) return
  if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const log = item.value
  const { workerId: workerIndex, deregistedAt } =
    WorkerRegistry.events.WorkerDeregistered.decode(log)

  const workerId = createWorkerId(workerIndex)
  const workerDeferred = ctx.store.defer(Worker, workerId)

  return timed(ctx, async (elapsed) => {
    const settings = await ctx.store.getOrFail(Settings, network.name)

    const worker = await workerDeferred.getOrFail()
    if (worker.status === WorkerStatus.DEREGISTERING) return

    const statusChange = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
      worker,
      blockNumber: log.block.l1BlockNumber,
      timestamp: new Date(log.block.timestamp),
      status: WorkerStatus.DEREGISTERING,
      pending: false,
    })
    await ctx.store.track(statusChange)

    worker.status = statusChange.status
    if (settings.epochLength) {
      worker.locked = true
      worker.lockEnd = Number(deregistedAt) + (settings.lockPeriod ?? settings.epochLength)
    } else {
      worker.locked = true
      worker.lockEnd = Number(deregistedAt)
    }
    await addToWorkerUnlockQueue(ctx, worker.id)

    const pendingStatusChange = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, deregistedAt),
      worker,
      blockNumber: Number(deregistedAt),
      status: WorkerStatus.DEREGISTERED,
      pending: true,
    })
    await ctx.store.track(pendingStatusChange)
    await addToWorkerStatusApplyQueue(ctx, pendingStatusChange.id)

    ctx.log.info(`worker(${worker.id}) deregistered (${elapsed()}ms)`)
  })
})
