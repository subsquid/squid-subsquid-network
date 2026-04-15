import {
  createBaseBuilder,
  addRouterQuery,
  addStakingQuery,
  addWorkersRegistryQuery,
  addPortalPoolsQuery,
  addRewardTreasuryQuery,
  addVestingsQuery,
  network,
} from '@subsquid-network/shared'
import * as SQD from '@subsquid-network/shared/lib/abi/SQD'
import * as GatewayRegistry from '@subsquid-network/shared/lib/abi/GatewayRegistry'
import * as RewardsDistribution from '@subsquid-network/shared/lib/abi/DistributedRewardsDistribution'

const builder = createBaseBuilder()

builder.addLog({
  range: network.contracts.SQD.range,
  where: {
    address: [network.contracts.SQD.address],
    topic0: [SQD.events.Transfer.topic],
  },
  include: {
    transaction: true,
  },
})

builder.addLog({
  range: network.contracts.GatewayRegistry.range,
  where: {
    address: [network.contracts.GatewayRegistry.address],
    topic0: [
      GatewayRegistry.events.Staked.topic,
      GatewayRegistry.events.Unstaked.topic,
    ],
  },
  include: {
    transaction: true,
  },
})

builder.addLog({
  range: network.contracts.RewardsDistribution.range,
  where: {
    address: [network.contracts.RewardsDistribution.address],
    topic0: [RewardsDistribution.events.Claimed.topic],
  },
})

addRouterQuery(builder)
addStakingQuery(builder)
addWorkersRegistryQuery(builder)
addPortalPoolsQuery(builder)
addRewardTreasuryQuery(builder)
addVestingsQuery(builder)

export const processor = builder.build()
