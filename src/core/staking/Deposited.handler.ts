import assert from 'assert'

import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { addToWorkerCapQueue } from '../cap'
import { createDelegation } from '../helpers/entities'
import {
  createAccountId,
  createDelegationId,
  createDelegationStatusChangeId,
  createWorkerId,
} from '../helpers/ids'

import { addToDelegationUnlockQueue } from './CheckDelegationUnlock.listener'

import * as Staking from '~/abi/Staking'
import { network } from '~/config/network'
import { STAKING_TEMPLATE_KEY } from '~/config/queries/staking'
import {
  Account,
  Delegation,
  DelegationStatus,
  DelegationStatusChange,
  Settings,
  TransferType,
  Worker,
} from '~/model'
import { toHumanSQD, toNextEpochStart } from '~/utils/misc'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleDeposited = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Staking.events.Deposited.is(item.value)) return
  if (!ctx.templates.has(STAKING_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const {
    worker: workerIndex,
    staker: stakerAccount,
    amount,
  } = Staking.events.Deposited.decode(log)
  if (amount === 0n) return

  const workerId = createWorkerId(workerIndex)
  const workerDeferred = ctx.store.defer(Worker, workerId)

  const accountId = createAccountId(stakerAccount)
  const accountDeferred = ctx.store.defer(Account, {
    id: accountId,
    relations: { owner: true },
  })

  const delegationId = createDelegationId(workerId, accountId)
  const delegationDeferred = ctx.store.defer(Delegation, {
    id: delegationId,
    relations: { worker: true, owner: true },
  })

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return timed(ctx, async (elapsed) => {
    const settings = await settingsDeferred.getOrFail()

    const delegation = await ctx.store.getOrCreate(
      Delegation,
      { id: delegationId, relations: { worker: true, owner: true } },
      async (id) => {
        const worker = await workerDeferred.getOrFail()
        const owner = await accountDeferred.getOrFail()

        ctx.log.info(`created delegation(${id})`)

        return createDelegation(id, {
          owner,
          realOwner: owner.owner || owner,
          worker,
        })
      },
    )

    delegation.deposit += amount
    if (settings.epochLength) {
      delegation.locked = true
      delegation.lockStart = toNextEpochStart(log.block.l1BlockNumber, settings.epochLength)
      delegation.lockEnd = delegation.lockStart + (settings.lockPeriod ?? settings.epochLength)
      await addToDelegationUnlockQueue(ctx, delegation.id)
    } else {
      delegation.locked = false
      delegation.lockStart = log.block.l1BlockNumber
      delegation.lockEnd = log.block.l1BlockNumber
    }

    if (delegation.status !== DelegationStatus.ACTIVE) {
      delegation.status = DelegationStatus.ACTIVE
      await ctx.store.track(
        new DelegationStatusChange({
          id: createDelegationStatusChangeId(delegation.id, log.block.height),
          delegation,
          status: DelegationStatus.ACTIVE,
          timestamp: new Date(log.block.timestamp),
          blockNumber: log.block.height,
          pending: false,
        }),
      )
    }

    const worker = delegation.worker
    assert(worker.id === workerId)
    if (delegation.deposit === amount) {
      worker.delegationCount += 1
    }
    worker.totalDelegation += amount

    await addToWorkerCapQueue(ctx, worker.id)

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: accountId,
      to: log.address,
      amount,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for delegation(${delegation.id})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.DEPOSIT,
      delegation,
    })

    ctx.log.info(
      `account(${delegation.owner.id}) delegated ${toHumanSQD(amount)} to worker(${worker.id}) (${elapsed()}ms)`,
    )
  })
})
