import { isContract, isLog } from '../../item'
import { createHandler } from '../base'
import { createGatewayStake, unwrapAccount } from '../helpers/entities'
import { createAccountId, createGatewayOperatorId } from '../helpers/ids'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

import { addToGatewayStakeApplyQueue } from './StakeApply.queue'
import { addToGatewayStakeUnlockQueue } from './StakeUnlock.queue'

import * as GatewayRegistry from '~/abi/GatewayRegistry'
import { network } from '~/config/network'
import { Account, GatewayStake, TransferType } from '~/model'
import { toHumanSQD } from '~/utils/misc'

export const gatewayStakedHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Staked.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Staked.decode(log)

  const accountId = createAccountId(event.gatewayOperator)
  const accountDeferred = ctx.store.defer(Account, {
    id: accountId,
    relations: { owner: true },
  })

  const stakeId = createGatewayOperatorId(event.gatewayOperator)
  const stakeDeferred = ctx.store.defer(GatewayStake, stakeId)

  return async () => {
    const account = await accountDeferred.getOrFail()

    const stake = await stakeDeferred.getOrInsert(async (id) =>
      createGatewayStake(id, {
        owner: account,
        realOwner: unwrapAccount(account),
      }),
    )

    stake.amount += event.amount
    stake.computationUnitsPending = event.computationUnits

    stake.lockStart = Number(event.lockStart)
    stake.lockEnd = event.lockEnd > INT32_MAX ? INT32_MAX : Number(event.lockEnd)
    stake.locked = true

    await ctx.store.upsert(stake)

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      to: network.contracts.GatewayRegistry.address,
      from: account.id,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for account(${account.id})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.DEPOSIT,
      gatewayStake: stake,
    })

    ctx.log.info(
      `account(${account.id}) staked ${toHumanSQD(stake.amount)} for [${stake.lockStart}, ${stake.lockEnd}]`,
    )

    await addToGatewayStakeApplyQueue(ctx, stake.id)
    await addToGatewayStakeUnlockQueue(ctx, stake.id)
  }
})

export const INT32_MAX = 2_147_483_647
