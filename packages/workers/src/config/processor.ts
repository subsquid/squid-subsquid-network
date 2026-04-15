import {
  createBaseBuilder,
  addRouterQuery,
  addStakingQuery,
  addWorkersRegistryQuery,
  addNetworkControllerQuery,
  addRewardTreasuryQuery,
  addRewardCalculationQuery,
  network,
} from '@subsquid-network/shared'
import * as RewardsDistribution from '@subsquid-network/shared/lib/abi/DistributedRewardsDistribution'

const builder = createBaseBuilder()

builder.addLog({
  range: network.contracts.RewardsDistribution.range,
  where: {
    address: [network.contracts.RewardsDistribution.address],
    topic0: [
      RewardsDistribution.events.Claimed.topic,
      RewardsDistribution.events.Distributed.topic,
    ],
  },
})

addRouterQuery(builder)
addStakingQuery(builder)
addWorkersRegistryQuery(builder)
addNetworkControllerQuery(builder)
addRewardTreasuryQuery(builder)
addRewardCalculationQuery(builder)

export const processor = builder.build()
