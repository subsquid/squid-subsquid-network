import assert from 'assert'

import { isLog } from '../../item'
import { createHandler } from '../base'
import { addToWorkerCapQueue } from '../cap'
import {
  createAccountId,
  createDelegationId,
  createDelegationStatusChangeId,
  createWorkerId,
} from '../helpers/ids'

import * as Staking from '~/abi/Staking'
import { network } from '~/config/network'
import {
  Delegation,
  DelegationStatus,
  DelegationStatusChange,
  Settings,
  TransferType,
} from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleWithdrawn = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Staking.events.Withdrawn.is(item.value)) return

  const log = item.value
  const {
    worker: workerIndex,
    staker: stakerAccount,
    amount,
  } = Staking.events.Withdrawn.decode(log)

  const workerId = createWorkerId(workerIndex)
  const accountId = createAccountId(stakerAccount)
  const delegationId = createDelegationId(workerId, accountId)
  const delegationDeferred = ctx.store.defer(Delegation, {
    id: delegationId,
    relations: { worker: true, owner: true },
  })

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    if (settings.contracts.staking !== log.address) return

    const delegation = await delegationDeferred.getOrFail()
    delegation.deposit -= amount

    if (delegation.deposit === 0n) {
      delegation.status = DelegationStatus.WITHDRAWN
      await ctx.store.insert(
        new DelegationStatusChange({
          id: createDelegationStatusChangeId(delegation.id, log.block.height),
          delegation,
          status: DelegationStatus.WITHDRAWN,
          timestamp: new Date(log.block.timestamp),
          blockNumber: log.block.height,
          pending: false,
        }),
      )
    }

    await ctx.store.upsert(delegation)

    const worker = delegation.worker
    assert(worker.id === workerId)
    if (delegation.deposit === 0n) {
      worker.delegationCount -= 1
    }
    worker.totalDelegation -= amount

    await ctx.store.upsert(worker)

    await addToWorkerCapQueue(ctx, worker.id)

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      to: accountId,
      from: settings.contracts.staking,
      amount,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for delegation(${delegation.id})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      delegation,
    })

    ctx.log.info(
      `account(${delegation.owner.id}) undelegated ${toHumanSQD(amount)} from worker(${worker.id})`,
    )
  }
})
