import assert from 'assert'

import {
  type MappingContext,
  STAKING_TEMPLATE_KEY,
  createAccountId,
  createDelegationId,
  createDelegationStatusChangeId,
  createHandler,
  createWorkerId,
  isLog,
  network,
  timed,
  toHumanSQD,
} from '@sqd/shared'
import * as Staking from '@sqd/shared/lib/abi/Staking'

import { Delegation, DelegationStatus, DelegationStatusChange, Settings, Worker } from '~/model'
import { createDelegation } from '../../helpers'
import { refreshWorkerCap } from '../cap'
import { addToDelegationUnlockQueue } from './DelegationUnlock.queue'
import { computeDelegationLock } from './lock'

async function applyDepositLock(
  ctx: MappingContext,
  delegation: Delegation,
  settings: Settings,
  l1BlockNumber: number,
) {
  const lock = computeDelegationLock(l1BlockNumber, settings)
  delegation.locked = lock.locked
  delegation.lockStart = lock.lockStart
  delegation.lockEnd = lock.lockEnd
  if (lock.locked) {
    await addToDelegationUnlockQueue(ctx, delegation.id)
  }
}

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

  const workerId = createWorkerId(workerIndex)
  const accountId = createAccountId(stakerAccount)
  const delegationId = createDelegationId(workerId, accountId)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  // Staking.deposit(worker, 0) moves no tokens but still rewrites the staker's unlock block for
  // that worker, so it re-locks an existing delegation for a full lock period. Nothing else
  // changes: no new delegation, no status change, no worker totals.
  if (amount === 0n) {
    const delegationDeferred = ctx.store.defer(Delegation, {
      id: delegationId,
      relations: { worker: true },
    })

    return timed(ctx, async (elapsed) => {
      const delegation = await delegationDeferred.get()
      // Nothing is staked, so there is nothing to lock (the contract accepts the call anyway).
      if (!delegation || delegation.deposit === 0n) return

      const settings = await settingsDeferred.getOrFail()
      await applyDepositLock(ctx, delegation, settings, log.block.l1BlockNumber)

      ctx.log.info(
        `operator(${accountId}) re-locked delegation(${delegation.id}) until L1 block ${delegation.lockEnd} with a zero-amount deposit (${elapsed()}ms)`,
      )
    })
  }

  const workerDeferred = ctx.store.defer(Worker, workerId)

  return timed(ctx, async (elapsed) => {
    const settings = await settingsDeferred.getOrFail()

    const delegation = await ctx.store.getOrCreate(
      Delegation,
      { id: delegationId, relations: { worker: true } },
      async (id) => {
        const worker = await workerDeferred.getOrFail()

        ctx.log.info(`created delegation(${id})`)

        return createDelegation(id, {
          ownerId: accountId,
          worker,
        })
      },
    )

    delegation.deposit += amount
    await applyDepositLock(ctx, delegation, settings, log.block.l1BlockNumber)

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

    refreshWorkerCap(worker, settings)

    ctx.log.info(
      `operator(${accountId}) delegated ${toHumanSQD(amount)} to worker(${worker.id}) (${elapsed()}ms)`,
    )
  })
})
