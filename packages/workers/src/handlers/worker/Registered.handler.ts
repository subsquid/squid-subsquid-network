import { assertNotNull } from '@subsquid/util-internal'

import {
  isLog,
  createHandler,
  timed,
  createAccountId,
  createWorkerId,
  createWorkerStatusId,
  parsePeerId,
  parseWorkerMetadata,
  toHumanSQD,
  network,
  WORKER_REGISTRATION_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as WorkerRegistry from '@subsquid-network/shared/lib/abi/WorkerRegistration'

import { Settings, Worker, WorkerStatus, WorkerStatusChange } from '~/model'
import { createWorker } from '../../helpers'
import { addToWorkerStatusApplyQueue } from './WorkerStatusApply.queue'

export const handleWorkerRegistered = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!WorkerRegistry.events.WorkerRegistered.is(item.value)) return
  if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const log = item.value
  const event = WorkerRegistry.events.WorkerRegistered.decode(log)

  const ownerId = createAccountId(event.registrar)
  const workerId = createWorkerId(event.workerId)

  const settingsDeferred = ctx.store.defer(Settings, network.name)
  const workerDeferred = ctx.store.defer(Worker, workerId)

  return timed(ctx, async (elapsed) => {
    const settings = await settingsDeferred.getOrFail()
    const bond = assertNotNull(settings.bondAmount, `bond amount is not defined`)
    const metadata = parseWorkerMetadata(ctx, event.metadata)

    let worker = await workerDeferred.get()
    const isNewWorker = worker == null
    if (worker != null) {
      worker.owner = ownerId
      worker.peerId = parsePeerId(event.peerId)
      worker.name = metadata.name
      worker.email = metadata.email
      worker.website = metadata.website
      worker.description = metadata.description
    } else {
      worker = createWorker(workerId, {
        owner: ownerId,
        peerId: parsePeerId(event.peerId),
        createdAt: new Date(log.block.timestamp),
        metadata,
      })
    }

    const statusChange = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
      worker,
      blockNumber: log.block.l1BlockNumber,
      timestamp: new Date(log.block.timestamp),
      status: WorkerStatus.REGISTERING,
      pending: false,
    })
    await ctx.store.track(statusChange)

    worker.status = statusChange.status
    worker.bond = bond
    worker.locked = true
    worker.lockStart = log.block.l1BlockNumber
    if (isNewWorker) await ctx.store.track(worker)

    const pendingStatus = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, event.registeredAt),
      worker,
      blockNumber: Number(event.registeredAt),
      status: WorkerStatus.ACTIVE,
      pending: true,
    })
    await ctx.store.track(pendingStatus)
    await addToWorkerStatusApplyQueue(ctx, pendingStatus.id)

    ctx.log.info(
      `operator(${ownerId}) registered worker(${worker.id}), bonded ${toHumanSQD(worker.bond)} (${elapsed()}ms)`,
    )
  })
})
