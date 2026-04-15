import {
  createBaseBuilder,
  addPortalPoolsQuery,
  network,
} from '@subsquid-network/shared'
import * as GatewayRegistry from '@subsquid-network/shared/lib/abi/GatewayRegistry'

const builder = createBaseBuilder()

builder.addLog({
  range: network.contracts.GatewayRegistry.range,
  where: {
    address: [network.contracts.GatewayRegistry.address],
    topic0: [
      GatewayRegistry.events.Registered.topic,
      GatewayRegistry.events.Unregistered.topic,
      GatewayRegistry.events.Staked.topic,
      GatewayRegistry.events.Unstaked.topic,
      GatewayRegistry.events.MetadataChanged.topic,
      GatewayRegistry.events.AutoextensionEnabled.topic,
      GatewayRegistry.events.AutoextensionDisabled.topic,
    ],
  },
  include: {
    transaction: true,
  },
})

addPortalPoolsQuery(builder)

export const processor = builder.build()
