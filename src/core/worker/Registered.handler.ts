import { assertNotNull, Log } from '@subsquid/evm-processor'

import { isLog } from '../../item'
import { createHandler } from '../base'
import { createAccount, createWorker } from '../helpers/entities'
import { createAccountId, createWorkerId, createWorkerStatusId } from '../helpers/ids'

import { addToWorkerStatusApplyQueue } from './WorkerStatusApply.queue'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import * as SQD from '~/abi/SQD'
import { network } from '~/config/network'
import {
  Account,
  Settings,
  Transfer,
  TransferType,
  WorkerStatus,
  WorkerStatusChange,
} from '~/model'
import { parseWorkerMetadata, parsePeerId, toHumanSQD } from '~/utils/misc'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleWorkerRegistered = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!WorkerRegistry.events.WorkerRegistered.is(item.value)) return

  const log = item.value
  const event = WorkerRegistry.events.WorkerRegistered.decode(log)

  const ownerId = createAccountId(event.registrar)
  const ownerDeferred = ctx.store.defer(Account, {
    id: ownerId,
    relations: {
      owner: true,
    },
  })

  const workerId = createWorkerId(event.workerId)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    if (log.address !== settings.contracts.workerRegistration) return

    const bond = assertNotNull(settings.bondAmount, `bond amount is not defined`)
    const metadata = parseWorkerMetadata(ctx, event.metadata)

    const owner = await ownerDeferred.getOrFail()

    const worker = createWorker(workerId, {
      owner,
      realOwner: owner.owner ? owner.owner : owner,
      peerId: parsePeerId(event.peerId),
      createdAt: new Date(log.block.timestamp),
      metadata,
    })

    ctx.log.info(`registered worker(${worker.id})`)

    const statusChange = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
      worker,
      blockNumber: log.block.l1BlockNumber,
      timestamp: new Date(log.block.timestamp),
      status: WorkerStatus.REGISTERING,
      pending: false,
    })
    await ctx.store.insert(statusChange)

    worker.status = statusChange.status
    worker.bond = bond
    worker.locked = true
    worker.lockStart = log.block.l1BlockNumber
    await ctx.store.upsert(worker)

    const pendingStatus = new WorkerStatusChange({
      id: createWorkerStatusId(workerId, event.registeredAt),
      worker,
      blockNumber: Number(event.registeredAt),
      status: WorkerStatus.ACTIVE,
      pending: true,
    })
    await ctx.store.insert(pendingStatus)
    await addToWorkerStatusApplyQueue(ctx, pendingStatus.id)

    const transfer = findTransfer(log.getTransaction().logs, {
      from: ownerId,
      to: settings.contracts.workerRegistration,
    })
    if (!transfer) {
      throw new Error(`transfer not found for worker(${worker.id})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.DEPOSIT,
      worker,
    })

    ctx.log.info(`account(${worker.realOwner.id}) registered worker(${worker.id})`)
    ctx.log.info(
      `account(${worker.realOwner.id}) bonded ${toHumanSQD(worker.bond)} to worker(${worker.id})`,
    )
  }
})
