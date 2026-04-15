import {
  type LogItem,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  createAccountId,
  createHandlerOld,
  createWorkerId,
  findTransfer,
  isLog,
  network,
  timed,
  toHumanSQD,
} from '@sqd/shared'
import * as WorkerRegistry from '@sqd/shared/lib/abi/WorkerRegistration'

import { TransferType } from '~/model'
import { saveTransfer } from './Transfer.handler'

export const handleWorkerRegistered = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.WorkerRegistered.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const event = WorkerRegistry.events.WorkerRegistered.decode(log)
    const ownerId = createAccountId(event.registrar)
    const workerId = createWorkerId(event.workerId)

    return timed(ctx, async (elapsed) => {
      const transfer = findTransfer(log.getTransaction().logs, {
        from: ownerId,
        to: log.address,
        logIndex: log.logIndex - 1,
      })
      if (!transfer) {
        throw new Error(`transfer not found for worker(${workerId})`)
      }
      await saveTransfer(ctx, transfer, {
        type: TransferType.DEPOSIT,
        workerId,
      })

      ctx.log.info(`classified worker(${workerId}) registration deposit (${elapsed()}ms)`)
    })
  },
})

export const handleWorkerWithdrawn = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.WorkerWithdrawn.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const event = WorkerRegistry.events.WorkerWithdrawn.decode(log)
    const workerId = createWorkerId(event.workerId)

    return timed(ctx, async (elapsed) => {
      const transfer = findTransfer(log.transaction?.logs ?? [], {
        from: log.address,
        logIndex: log.logIndex - 1,
      })
      if (!transfer) {
        throw new Error(`transfer not found for worker(${workerId}) withdrawal`)
      }
      await saveTransfer(ctx, transfer, {
        type: TransferType.WITHDRAW,
        workerId,
      })

      ctx.log.info(`classified worker(${workerId}) withdrawal (${elapsed()}ms)`)
    })
  },
})

export const handleExcessiveBondReturned = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.ExcessiveBondReturned.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const event = WorkerRegistry.events.ExcessiveBondReturned.decode(log)
    const workerId = createWorkerId(event.workerId)

    return timed(ctx, async (elapsed) => {
      const transfer = findTransfer(log.transaction?.logs ?? [], {
        from: log.address,
        logIndex: log.logIndex - 1,
      })
      if (!transfer) {
        throw new Error(`transfer not found for worker(${workerId}) excessive bond return`)
      }
      await saveTransfer(ctx, transfer, {
        type: TransferType.WITHDRAW,
        workerId,
      })

      ctx.log.info(`classified worker(${workerId}) excessive bond return (${elapsed()}ms)`)
    })
  },
})
