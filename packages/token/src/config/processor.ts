import {
  PORTAL_POOL_TEMPLATE_KEY,
  REWARD_TREASURY_TEMPLATE_KEY,
  STAKING_TEMPLATE_KEY,
  VESTING_TEMPLATE_KEY,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  network,
} from '@sqd/shared'
import * as RewardsDistribution from '@sqd/shared/lib/abi/DistributedRewardsDistribution'
import * as GatewayRegistry from '@sqd/shared/lib/abi/GatewayRegistry'
import * as PortalPoolFactory from '@sqd/shared/lib/abi/PortalPoolFactory'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'
import * as RewardTreasury from '@sqd/shared/lib/abi/RewardTreasury'
import * as Router from '@sqd/shared/lib/abi/Router'
import * as SQD from '@sqd/shared/lib/abi/SQD'
import * as Staking from '@sqd/shared/lib/abi/Staking'
import * as Vesting from '@sqd/shared/lib/abi/SubsquidVesting'
import * as VestingFactory from '@sqd/shared/lib/abi/VestingFactory'
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
  .setBlockRange(network.range)

if (process.env.PORTAL_ENDPOINT) {
  builder.setPortal({
    url: assertNotNull(process.env.PORTAL_ENDPOINT),
    minBytes: 40 * 1024 * 1024,
  })
}

builder.addLog({
  range: network.contracts.SQD.range,
  where: {
    address: [network.contracts.SQD.address],
    topic0: [SQD.events.Transfer.topic],
  },
  include: { transaction: true },
})

builder.addLog({
  range: network.contracts.GatewayRegistry.range,
  where: {
    address: [network.contracts.GatewayRegistry.address],
    topic0: [GatewayRegistry.events.Staked.topic, GatewayRegistry.events.Unstaked.topic],
  },
  include: { transaction: true },
})

builder.addLog({
  range: network.contracts.RewardsDistribution.range,
  where: {
    address: [network.contracts.RewardsDistribution.address],
    topic0: [RewardsDistribution.events.Claimed.topic],
  },
})

builder.addLog({
  range: network.contracts.Router.range,
  where: {
    address: [network.contracts.Router.address],
    topic0: [
      Router.events.StakingSet.topic,
      Router.events.WorkerRegistrationSet.topic,
      Router.events.RewardTreasurySet.topic,
    ],
  },
})

builder.addLog(STAKING_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: {
    topic0: [Staking.events.Deposited.topic, Staking.events.Withdrawn.topic],
  },
})

builder.addLog(WORKER_REGISTRATION_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: {
    topic0: [
      WorkerRegistry.events.WorkerRegistered.topic,
      WorkerRegistry.events.WorkerDeregistered.topic,
      WorkerRegistry.events.WorkerWithdrawn.topic,
    ],
  },
})

builder.addLog(REWARD_TREASURY_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: { topic0: [RewardTreasury.events.Claimed.topic] },
})

builder.addLog({
  range: network.contracts.VestingFactory.range,
  where: {
    address: [network.contracts.VestingFactory.address],
    topic0: [VestingFactory.events.VestingCreated.topic],
  },
})

if (network.name === 'tethys') {
  builder.addLog(VESTING_TEMPLATE_KEY, {
    range: { from: network.range.from },
    where: { topic0: [Vesting.events.OwnershipTransferred.topic] },
  })
}

builder.addLog(VESTING_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: { topic0: [Vesting.events.ERC20Released.topic] },
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
      PortalPoolImplementation.events.ExitClaimed.topic,
    ],
  },
  include: { transaction: true },
})

export const processor = builder.build()
