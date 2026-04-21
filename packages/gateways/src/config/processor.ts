import { PORTAL_POOL_TEMPLATE_KEY, network } from '@sqd/shared'
import * as GatewayRegistry from '@sqd/shared/lib/abi/GatewayRegistry'
import * as PortalPoolFactory from '@sqd/shared/lib/abi/PortalPoolFactory'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'
import { DataSourceBuilder } from '@subsquid/evm-stream'
import { assertNotNull } from '@subsquid/util-internal'

const builder = new DataSourceBuilder()
  .setFields({
    block: {
      timestamp: true,
      l1BlockNumber: true,
    },
    log: {
      address: true,
      topics: true,
      data: true,
      transactionHash: true,
    },
  })
  .setBlockRange(network.range)
//.includeAllBlocks()

if (process.env.PORTAL_ENDPOINT) {
  builder.setPortal({
    url: assertNotNull(process.env.PORTAL_ENDPOINT),
    minBytes: 40 * 1024 * 1024,
  })
}

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
  include: { transaction: true },
})

builder.addLog({
  range: network.contracts.PortalPoolFactory.range,
  where: {
    address: [network.contracts.PortalPoolFactory.address],
    topic0: [PortalPoolFactory.events.PoolCreated.topic],
  },
  include: { transaction: true },
})

builder.addLog(PORTAL_POOL_TEMPLATE_KEY, {
  range: { from: network.contracts.PortalPoolFactory.range.from },
  where: {
    topic0: [
      PortalPoolImplementation.events.Deposited.topic,
      PortalPoolImplementation.events.Withdrawn.topic,
      PortalPoolImplementation.events.ExitRequested.topic,
      PortalPoolImplementation.events.ExitClaimed.topic,
      PortalPoolImplementation.events.RewardsToppedUp.topic,
      PortalPoolImplementation.events.RewardsClaimed.topic,
      PortalPoolImplementation.events.CapacityUpdated.topic,
      PortalPoolImplementation.events.DistributionRateChanged.topic,
      PortalPoolImplementation.events.PoolClosed.topic,
    ],
  },
  include: { transaction: true },
})

export const processor = builder.build()
