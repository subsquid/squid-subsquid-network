import assert from 'assert'

import {
  isLog,
  createHandler,
  timed,
  createAccountId,
  createDelegationId,
  createDelegationStatusChangeId,
  createWorkerId,
  toHumanSQD,
  toNextEpochStart,
  network,
  STAKING_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as Staking from '@subsquid-network/shared/lib/abi/Staking'

import {
  Delegation,
  DelegationStatus,
  DelegationStatusChange,
  Settings,
  Worker,
} from '~/model'
import { createDelegation } from '../../helpers'
import { addToWorkerCapQueue } from '../cap'
import { addToDelegationUnlockQueue } from './DelegationUnlock.queue'

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

  const delegationId = createDelegationId(workerId, accountId)
  const delegationDeferred = ctx.store.defer(Delegation, {
    id: delegationId,
    relations: { worker: true },
  })

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return timed(ctx, async (elapsed) => {
    const settings = await settingsDeferred.getOrFail()

    const delegation = await ctx.store.getOrCreate(
      Delegation,
      { id: delegationId, relations: { worker: true } },
      async (id) => {
        const worker = await workerDeferred.getOrFail()

        ctx.log.info(`created delegation(${id})`)

        return createDelegation(id, {
          owner: accountId,
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

    ctx.log.info(
      `operator(${accountId}) delegated ${toHumanSQD(amount)} to worker(${worker.id}) (${elapsed()}ms)`,
    )
  })
})
