import { LogItem, isLog } from '../../item'
import { createHandlerOld, timed } from '../base'
import { createWorkerId, createWorkerStatusId } from '../helpers/ids'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import { network } from '~/config/network'
import { WORKER_REGISTRATION_TEMPLATE_KEY } from '~/config/queries/workersRegistry'
import {
  Account,
  Settings,
  Transfer,
  TransferType,
  Worker,
  WorkerStatus,
  WorkerStatusChange,
} from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { createAccount } from '../helpers/entities'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleWorkerWithdrawn = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.WorkerWithdrawn.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const { workerId: workerIndex } = WorkerRegistry.events.WorkerWithdrawn.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, {
      id: workerId,
      relations: { owner: { owner: true } },
    })

    return timed(ctx, async (elapsed) => {
      const settings = await ctx.store.getOrFail(Settings, network.name)

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
        `account(${worker.owner.id}) unbonded ${toHumanSQD(worker.bond)} from worker(${worker.id}) (${elapsed()}ms)`,
      )
    })
  },
})
