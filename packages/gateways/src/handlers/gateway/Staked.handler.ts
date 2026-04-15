import {
  createAccountId,
  createGatewayOperatorId,
  createHandler,
  isContract,
  isLog,
  network,
  timed,
  toHumanSQD,
} from '@sqd/shared'
import * as GatewayRegistry from '@sqd/shared/lib/abi/GatewayRegistry'

import { GatewayStake, PortalPool } from '~/model'
import { createGatewayStake } from '../../helpers'
import { addToGatewayStakeApplyQueue } from './StakeApply.queue'
import { addToGatewayStakeUnlockQueue } from './StakeUnlock.queue'

export const INT32_MAX = 2_147_483_647

export const gatewayStakedHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Staked.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Staked.decode(log)

  const ownerId = createAccountId(event.gatewayOperator)
  const stakeId = createGatewayOperatorId(event.gatewayOperator)
  const stakeDeferred = ctx.store.defer(GatewayStake, stakeId)
  const poolDeferred = ctx.store.defer(PortalPool, ownerId)

  return timed(ctx, async (elapsed) => {
    if (await poolDeferred.get()) {
      ctx.log.info(`skipped Staked: operator ${ownerId} is a portal pool (${elapsed()}ms)`)
      return
    }

    const stake = await ctx.store.getOrCreate(GatewayStake, stakeId, (id) =>
      createGatewayStake(id, ownerId),
    )

    stake.amount += event.amount
    stake.computationUnitsPending = event.computationUnits

    stake.lockStart = Number(event.lockStart)
    stake.lockEnd = event.lockEnd > INT32_MAX ? INT32_MAX : Number(event.lockEnd)
    stake.locked = true

    ctx.log.info(
      `operator(${ownerId}) staked ${toHumanSQD(stake.amount)} for [${stake.lockStart}, ${stake.lockEnd}] (${elapsed()}ms)`,
    )

    await addToGatewayStakeApplyQueue(ctx, stake.id)
    await addToGatewayStakeUnlockQueue(ctx, stake.id)
  })
})
