import { isContract, isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createGatewayOperatorId } from '../helpers/ids'

import * as GatewayRegistry from '~/abi/GatewayRegistry'
import { network } from '~/config/network'
import { GatewayStake, PortalPool, TransferType } from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleUnstaked = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Unstaked.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Unstaked.decode(log)

  const operatorId = createGatewayOperatorId(event.gatewayOperator)
  const stakeDeferred = ctx.store.defer(GatewayStake, {
    id: operatorId,
    relations: { owner: true },
  })
  const poolDeferred = ctx.store.defer(PortalPool, operatorId)

  return timed(ctx, async (elapsed) => {
    if (await poolDeferred.get()) {
      ctx.log.info(`skipped Unstaked: operator ${operatorId} is a portal pool (${elapsed()}ms)`)
      return
    }

    const stake = await stakeDeferred.getOrFail()
    const account = stake.owner

    stake.amount = 0n
    stake.computationUnits = 0n
    stake.lockStart = null
    stake.lockEnd = null
    stake.computationUnitsPending = null

    await ctx.store.upsert(stake)

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: network.contracts.GatewayRegistry.address,
      to: account.id,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for account(${account.id})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      gatewayStake: stake,
    })

    ctx.log.info(`account(${account.id}) unstaked ${toHumanSQD(event.amount)} (${elapsed()}ms)`)
  })
})
