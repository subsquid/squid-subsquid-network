import {
  createHandler,
  createWorkerStatusId,
  isContract,
  isLog,
  network,
  parsePeerId,
  timed,
} from '@sqd/shared'
import * as GatewayRegistry from '@sqd/shared/lib/abi/GatewayRegistry'

import { Gateway, GatewayStatus, GatewayStatusChange } from '~/model'

export const handleUnregistered = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Unregistered.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Unregistered.decode(log)

  const gatewayId = parsePeerId(event.peerId)
  const gatewayDeferred = ctx.store.defer(Gateway, gatewayId)

  return timed(ctx, async (elapsed) => {
    const gateway = await gatewayDeferred.getOrFail()

    const statusChange = new GatewayStatusChange({
      id: createWorkerStatusId(gatewayId, log.block.height),
      blockNumber: log.block.height,
      gateway,
      status: GatewayStatus.DEREGISTERED,
      timestamp: new Date(log.block.timestamp),
    })
    await ctx.store.track(statusChange)

    gateway.status = statusChange.status

    ctx.log.info(`gateway(${gatewayId}) deregistered (${elapsed()}ms)`)
  })
})
