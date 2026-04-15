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
  network,
  STAKING_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as Staking from '@subsquid-network/shared/lib/abi/Staking'

import {
  Delegation,
  DelegationStatus,
  DelegationStatusChange,
  Settings,
} from '~/model'
import { addToWorkerCapQueue } from '../cap'

export const handleWithdrawn = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Staking.events.Withdrawn.is(item.value)) return
  if (!ctx.templates.has(STAKING_TEMPLATE_KEY, item.address, item.value.block.height)) return

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
    relations: { worker: true },
  })

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return timed(ctx, async (elapsed) => {
    const settings = await settingsDeferred.getOrFail()
    const delegation = await delegationDeferred.getOrFail()
    delegation.deposit -= amount

    if (delegation.deposit === 0n) {
      delegation.status = DelegationStatus.WITHDRAWN
      await ctx.store.track(
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

    const worker = delegation.worker
    assert(worker.id === workerId)
    if (delegation.deposit === 0n) {
      worker.delegationCount -= 1
    }
    worker.totalDelegation -= amount

    await addToWorkerCapQueue(ctx, worker.id)

    ctx.log.info(
      `operator(${accountId}) undelegated ${toHumanSQD(amount)} from worker(${worker.id}) (${elapsed()}ms)`,
    )
  })
})
