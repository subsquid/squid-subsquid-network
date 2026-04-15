import {
  isContract,
  isLog,
  createHandler,
  timed,
  createAccountId,
  createGatewayOperatorId,
  findTransfer,
  toHumanSQD,
  network,
} from '@subsquid-network/shared'
import * as GatewayRegistry from '@subsquid-network/shared/lib/abi/GatewayRegistry'

import { TransferType } from '~/model'
import { saveTransfer } from './Transfer.handler'

export const handleGatewayStaked = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Staked.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Staked.decode(log)

  const accountId = createAccountId(event.gatewayOperator)
  const gatewayStakeId = createGatewayOperatorId(event.gatewayOperator)

  return timed(ctx, async (elapsed) => {
    const transfer = findTransfer(log.transaction?.logs ?? [], {
      to: network.contracts.GatewayRegistry.address,
      from: accountId,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for gateway stake(${gatewayStakeId})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.DEPOSIT,
      gatewayStakeId,
    })

    ctx.log.info(`classified gateway stake(${gatewayStakeId}) deposit (${elapsed()}ms)`)
  })
})

export const handleGatewayUnstaked = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Unstaked.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Unstaked.decode(log)

  const gatewayStakeId = createGatewayOperatorId(event.gatewayOperator)

  return timed(ctx, async (elapsed) => {
    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: network.contracts.GatewayRegistry.address,
      to: gatewayStakeId,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for gateway stake(${gatewayStakeId})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      gatewayStakeId,
    })

    ctx.log.info(`classified gateway stake(${gatewayStakeId}) withdrawal (${elapsed()}ms)`)
  })
})
