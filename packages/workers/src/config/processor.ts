import {
  NETWORK_CONTROLLER_TEMPLATE_KEY,
  STAKING_TEMPLATE_KEY,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  network,
} from '@sqd/shared'
import * as RewardsDistribution from '@sqd/shared/lib/abi/DistributedRewardsDistribution'
import * as NetworkController from '@sqd/shared/lib/abi/NetworkController'
import * as Router from '@sqd/shared/lib/abi/Router'
import * as Staking from '@sqd/shared/lib/abi/Staking'
import * as WorkerRegistry from '@sqd/shared/lib/abi/WorkerRegistration'
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
  .setBlockRange({ from: network.range.from })

if (process.env.PORTAL_ENDPOINT) {
  builder.setPortal({
    url: assertNotNull(process.env.PORTAL_ENDPOINT),
    maxBytes: 100 * 1024 * 1024,
  })
}

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

builder.addLog({
  range: network.contracts.Router.range,
  where: {
    address: [network.contracts.Router.address],
    topic0: [
      Router.events.NetworkControllerSet.topic,
      Router.events.RewardCalculationSet.topic,
      Router.events.RewardTreasurySet.topic,
      Router.events.WorkerRegistrationSet.topic,
      Router.events.StakingSet.topic,
    ],
  },
})

builder.addLog(STAKING_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: {
    topic0: [
      Staking.events.Claimed.topic,
      Staking.events.Deposited.topic,
      Staking.events.Withdrawn.topic,
    ],
  },
})

builder.addLog(WORKER_REGISTRATION_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: {
    topic0: [
      WorkerRegistry.events.WorkerRegistered.topic,
      WorkerRegistry.events.WorkerDeregistered.topic,
      WorkerRegistry.events.WorkerWithdrawn.topic,
      WorkerRegistry.events.MetadataUpdated.topic,
      WorkerRegistry.events.ExcessiveBondReturned.topic,
    ],
  },
})

builder.addLog(NETWORK_CONTROLLER_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: {
    topic0: [
      NetworkController.events.BondAmountUpdated.topic,
      NetworkController.events.EpochLengthUpdated.topic,
      NetworkController.events.LockPeriodUpdated.topic,
    ],
  },
})

export const processor = builder.build()
