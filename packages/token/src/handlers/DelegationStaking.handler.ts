import {
  STAKING_TEMPLATE_KEY,
  createAccountId,
  createDelegationId,
  createHandler,
  createWorkerId,
  findTransfer,
  isLog,
  network,
  timed,
  toHumanSQD,
} from '@sqd/shared'
import * as Staking from '@sqd/shared/lib/abi/Staking'

import { TransferType } from '~/model'
import { saveTransfer } from './Transfer.handler'

export const handleStakingDeposited = createHandler((ctx, item) => {
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
  const accountId = createAccountId(stakerAccount)
  const delegationId = createDelegationId(workerId, accountId)

  return timed(ctx, async (elapsed) => {
    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: accountId,
      to: log.address,
      amount,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for delegation(${delegationId})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.DEPOSIT,
      delegationId,
    })

    ctx.log.info(`classified delegation(${delegationId}) deposit (${elapsed()}ms)`)
  })
})

export const handleStakingWithdrawn = createHandler((ctx, item) => {
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

  return timed(ctx, async (elapsed) => {
    const transfer = findTransfer(log.transaction?.logs ?? [], {
      to: accountId,
      from: log.address,
      amount,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for delegation(${delegationId})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      delegationId,
    })

    ctx.log.info(`classified delegation(${delegationId}) withdrawal (${elapsed()}ms)`)
  })
})
