import {
  type LogItem,
  isContract,
  isLog,
  createHandlerOld,
  timed,
  createAccountId,
  createGatewayOperatorId,
  createWorkerStatusId,
  parsePeerId,
  network,
} from '@subsquid-network/shared'
import * as GatewayRegistry from '@subsquid-network/shared/lib/abi/GatewayRegistry'

import { Gateway, GatewayStake, GatewayStatus, GatewayStatusChange } from '~/model'
import { createGatewayStake } from '../helpers'

export const handleRegistered = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      GatewayRegistry.events.Registered.is(item.value)
    )
  },
  handle(ctx, { value: log }) {
    const event = GatewayRegistry.events.Registered.decode(log)

    const ownerId = createAccountId(event.gatewayOperator)
    const stakeId = createGatewayOperatorId(event.gatewayOperator)
    const stakeDeferred = ctx.store.defer(GatewayStake, stakeId)
    const gatewayId = parsePeerId(event.peerId)

    return timed(ctx, async (elapsed) => {
      const stake = await ctx.store.getOrCreate(GatewayStake, stakeId, (id) =>
        createGatewayStake(id, ownerId),
      )

      const gateway = new Gateway({
        id: gatewayId,
        status: GatewayStatus.UNKNOWN,
        createdAt: new Date(log.block.timestamp),
        owner: ownerId,
        stake,
        description: null,
        email: null,
        endpointUrl: null,
        name: null,
        website: null,
      })

      const statusChange = new GatewayStatusChange({
        id: createWorkerStatusId(gatewayId, log.block.l1BlockNumber),
        blockNumber: log.block.height,
        gateway,
        status: GatewayStatus.REGISTERED,
        timestamp: new Date(log.block.timestamp),
      })
      await ctx.store.track(statusChange)

      gateway.status = statusChange.status
      await ctx.store.track(gateway, { replace: true })

      ctx.log.info(`operator(${ownerId}) registered gateway(${gatewayId}) (${elapsed()}ms)`)
    })
  },
})
