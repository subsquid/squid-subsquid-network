import { isLog } from '../../item'
import { createHandler } from '../base'
import { createWorkerId, createWorkerStatusId } from '../helpers/ids'

import { addToWorkerStatusApplyQueue } from './WorkerStatusApply.queue'
import { addToWorkerUnlockQueue } from './WorkerUnlock.queue'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import { network } from '~/config/network'
import { WorkerStatusChange, WorkerStatus, Worker, Settings } from '~/model'

export const handleWorkerDeregistered = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!WorkerRegistry.events.WorkerDeregistered.is(item.value)) return

  const log = item.value
  const { workerId: workerIndex, deregistedAt } =
    WorkerRegistry.events.WorkerDeregistered.decode(log)

  const workerId = createWorkerId(workerIndex)
  const workerDeferred = ctx.store.defer(Worker, {
    id: workerId,
    relations: { realOwner: true },
  })

  return async () => {
    const settings = await ctx.store.getOrFail(Settings, network.name)
    if (log.address !== settings.contracts.workerRegistration) return

    const worker = await workerDeferred.getOrFail()
    if (worker.status === WorkerStatus.DEREGISTERING) return // handle contract bug with duplicated deregistering calls

    const statusChange = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
      worker,
      blockNumber: log.block.l1BlockNumber,
      timestamp: new Date(log.block.timestamp),
      status: WorkerStatus.DEREGISTERING,
      pending: false,
    })
    await ctx.store.insert(statusChange)

    worker.status = statusChange.status
    if (settings.epochLength) {
      worker.locked = true
      worker.lockEnd = Number(deregistedAt) + (settings.lockPeriod ?? settings.epochLength)
    } else {
      worker.locked = true
      worker.lockEnd = Number(deregistedAt)
    }
    await ctx.store.upsert(worker)
    addToWorkerUnlockQueue(ctx, worker.id)

    const pendingStatusChange = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, deregistedAt),
      worker,
      blockNumber: Number(deregistedAt),
      status: WorkerStatus.DEREGISTERED,
      pending: true,
    })
    await ctx.store.insert(pendingStatusChange)
    addToWorkerStatusApplyQueue(ctx, pendingStatusChange.id)

    ctx.log.info(`account(${worker.realOwner.id}) deregistered worker(${worker.id})`)
  }
})
