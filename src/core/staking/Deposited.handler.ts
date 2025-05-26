import assert from 'assert'

import { isContract, isLog } from '../../item'
import { createHandler } from '../base'
import { addToWorkerCapQueue } from '../cap'
import { createDelegation } from '../helpers/entities'
import { createAccountId, createDelegationId, createWorkerId } from '../helpers/ids'

import { addToDelegationUnlockQueue } from './CheckDelegationUnlock.listener'

import * as Staking from '~/abi/Staking'
import { network } from '~/config/network'
import { Worker, Account, Delegation, Settings } from '~/model'
import { toHumanSQD, toNextEpochStart } from '~/utils/misc'

export const handleDeposited = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Staking.events.Deposited.is(item.value)) return

  const log = item.value
  const {
    worker: workerIndex,
    staker: stakerAccount,
    amount,
  } = Staking.events.Deposited.decode(log)

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
    relations: { worker: true, realOwner: true },
  })

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    if (settings.contracts.staking !== log.address) return

    const delegation = await delegationDeferred.getOrInsert(async (id) => {
      const worker = await workerDeferred.getOrFail()
      const owner = await accountDeferred.getOrFail()

      ctx.log.info(`created delegation(${id})`)

      return createDelegation(id, {
        owner,
        realOwner: owner.owner || undefined,
        worker,
      })
    })

    delegation.deposit += amount
    if (settings.epochLength) {
      delegation.locked = true
      delegation.lockStart = toNextEpochStart(log.block.l1BlockNumber, settings.epochLength)
      delegation.lockEnd = delegation.lockStart + (settings.lockPeriod ?? settings.epochLength)
      addToDelegationUnlockQueue(ctx, delegation.id)
    } else {
      delegation.locked = false
      delegation.lockStart = log.block.l1BlockNumber
      delegation.lockEnd = log.block.l1BlockNumber
    }
    await ctx.store.upsert(delegation)

    const worker = delegation.worker
    assert(worker.id === workerId)
    if (delegation.deposit === amount) {
      worker.delegationCount += 1
    }
    worker.totalDelegation += amount
    await ctx.store.upsert(worker)

    await addToWorkerCapQueue(ctx, worker.id)

    ctx.log.info(
      `account(${delegation.realOwner.id}) delegated ${toHumanSQD(amount)} to worker(${worker.id})`,
    )
  }
})
