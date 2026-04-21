import {
  type LogItem,
  createHandlerOld,
  isContract,
  isLog,
  network,
  parseGatewayMetadata,
  parsePeerId,
  timed,
} from '@sqd/shared'
import * as GatewayRegistry from '@sqd/shared/lib/abi/GatewayRegistry'

import { Gateway } from '~/model'

export const handleMetadataChanged = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      GatewayRegistry.events.MetadataChanged.is(item.value)
    )
  },
  handle(ctx, { value: log }) {
    const event = GatewayRegistry.events.MetadataChanged.decode(log)

    const gatewayId = parsePeerId(event.peerId)
    const gatewayDeferred = ctx.store.defer(Gateway, gatewayId)

    return timed(ctx, async (elapsed) => {
      const gateway = await gatewayDeferred.getOrFail()

      const metadata = parseGatewayMetadata(ctx, event.metadata)
      gateway.name = metadata.name
      gateway.website = metadata.website
      gateway.description = metadata.description
      gateway.email = metadata.email
      gateway.endpointUrl = metadata.endpointUrl

      ctx.log.info(`updated metadata of gateway(${gatewayId}) (${elapsed()}ms)`)
    })
  },
})
