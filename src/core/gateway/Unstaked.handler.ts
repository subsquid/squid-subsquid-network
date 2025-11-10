import { isContract, isLog } from '../../item'
import { createHandler } from '../base'
import { createGatewayOperatorId } from '../helpers/ids'

import * as GatewayRegistry from '~/abi/GatewayRegistry'
import { network } from '~/config/network'
import { GatewayStake, TransferType } from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { saveTransfer } from '../token/Transfer.handler'
import { findTransfer } from '../helpers/misc'

export const handleUnstaked = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Unstaked.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Unstaked.decode(log)

  const stakeId = createGatewayOperatorId(event.gatewayOperator)
  const stakeDeferred = ctx.store.defer(GatewayStake, {
    id: stakeId,
    relations: { owner: true },
  })

  return async () => {
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

    ctx.log.info(`account(${account.id}) unstaked ${toHumanSQD(event.amount)}`)
  }
})
