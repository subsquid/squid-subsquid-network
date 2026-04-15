import {
  isContract,
  isLog,
  createHandler,
  timed,
  createGatewayOperatorId,
  toHumanSQD,
  network,
} from '@subsquid-network/shared'
import * as GatewayRegistry from '@subsquid-network/shared/lib/abi/GatewayRegistry'

import { GatewayStake, PortalPool } from '~/model'

export const handleUnstaked = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Unstaked.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Unstaked.decode(log)

  const operatorId = createGatewayOperatorId(event.gatewayOperator)
  const stakeDeferred = ctx.store.defer(GatewayStake, operatorId)
  const poolDeferred = ctx.store.defer(PortalPool, operatorId)

  return timed(ctx, async (elapsed) => {
    if (await poolDeferred.get()) {
      ctx.log.info(`skipped Unstaked: operator ${operatorId} is a portal pool (${elapsed()}ms)`)
      return
    }

    const stake = await stakeDeferred.getOrFail()

    stake.amount = 0n
    stake.computationUnits = 0n
    stake.lockStart = null
    stake.lockEnd = null
    stake.computationUnitsPending = null

    ctx.log.info(`operator(${operatorId}) unstaked ${toHumanSQD(event.amount)} (${elapsed()}ms)`)
  })
})
