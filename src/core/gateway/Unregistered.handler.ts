import { isContract, isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createWorkerStatusId } from '../helpers/ids'

import { assertNotNull } from '@subsquid/util-internal'
import * as GatewayRegistry from '~/abi/GatewayRegistry'
import { network } from '~/config/network'
import { Gateway, GatewayStatus, GatewayStatusChange } from '~/model'
import { parsePeerId } from '~/utils/misc'

export const handleUnregistered = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (!GatewayRegistry.events.Unregistered.is(item.value)) return

  const log = item.value
  const event = GatewayRegistry.events.Unregistered.decode(log)

  const gatewayId = parsePeerId(event.peerId)
  const gatewayDeferred = ctx.store.defer(Gateway, {
    id: gatewayId,
    relations: { owner: true },
  })

  return timed(ctx, async (elapsed) => {
    const gateway = await gatewayDeferred.getOrFail()
    const owner = assertNotNull(gateway.owner)

    const statusChange = new GatewayStatusChange({
      id: createWorkerStatusId(gatewayId, log.block.height),
      blockNumber: log.block.height,
      gateway,
      status: GatewayStatus.DEREGISTERED,
      timestamp: new Date(log.block.timestamp),
    })
    await ctx.store.track(statusChange)

    gateway.status = statusChange.status

    ctx.log.info(`account(${owner.id}) deregistered gateway(${gatewayId}) (${elapsed()}ms)`)
  })
})
