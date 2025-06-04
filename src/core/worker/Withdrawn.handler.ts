import { isContract, isLog, LogItem } from '../../item'
import { createHandlerOld } from '../base'
import { createWorkerId, createWorkerStatusId } from '../helpers/ids'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import { network } from '~/config/network'
import {
  WorkerStatusChange,
  WorkerStatus,
  Worker,
  Settings,
  Transfer,
  TransferType,
  Account,
} from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { findTransfer } from '../helpers/misc'
import { createAccount } from '../helpers/entities'
import { saveTransfer } from '../token/Transfer.handler'

export const handleWorkerWithdrawn = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.WorkerWithdrawn.is(item.value)
  },
  handle(ctx, { value: log }) {
    const { workerId: workerIndex } = WorkerRegistry.events.WorkerWithdrawn.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, {
      id: workerId,
      relations: { owner: true, realOwner: true },
    })

    return async () => {
      const settings = await ctx.store.getOrFail(Settings, network.name)
      if (log.address !== settings.contracts.workerRegistration) return

      const worker = await workerDeferred.getOrFail()

      const statusChange = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
        worker,
        blockNumber: log.block.l1BlockNumber,
        timestamp: new Date(log.block.timestamp),
        status: WorkerStatus.WITHDRAWN,
        pending: false,
      })
      await ctx.store.insert(statusChange)

      worker.status = statusChange.status
      worker.bond = 0n

      await ctx.store.upsert(worker)

      const transfer = findTransfer(log.transaction?.logs ?? [], {
        to: worker.owner.id,
        from: settings.contracts.workerRegistration,
      })
      if (!transfer) {
        throw new Error(`transfer not found for worker(${worker.id})`)
      }
      await saveTransfer(ctx, transfer, {
        type: TransferType.WITHDRAW,
        worker,
      })

      ctx.log.info(
        `account(${worker.realOwner.id}) unbonded ${toHumanSQD(worker.bond)} from worker(${worker.id})`,
      )
    }
  },
})
