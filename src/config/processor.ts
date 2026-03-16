import { DataHandlerContext } from '@subsquid/batch-processor'
import {
  Block as _BlockData,
  BlockHeader as _BlockHeader,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-objects'
import { type Block, DataSourceBuilder, GetDataSourceBlock } from '@subsquid/evm-stream'

import { network } from './network'
import { addNetworkControllerQuery } from './queries/networkController'
import { addRewardTreasuryQuery } from './queries/rewardTreasury'
import { addRouterQuery } from './queries/router'
import { addStakingQuery } from './queries/staking'
import { addVestingsQuery } from './queries/vestings'
import { addWorkersRegistryQuery } from './queries/workersRegistry'

import type { Logger } from '@subsquid/logger'
import { assertNotNull } from '@subsquid/util-internal'
import * as RewardsDistribution from '~/abi/DistributedRewardsDistribution'
import * as GatewayRegistry from '~/abi/GatewayRegistry'
import * as SQD from '~/abi/SQD'
import * as TemporaryHoldingFactory from '~/abi/TemporaryHoldingFactory'

export const builder = new DataSourceBuilder()
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
  .includeAllBlocks()
  .setBlockRange(network.range)

if (process.env.PORTAL_ENDPOINT) {
  builder.setPortal({
    url: assertNotNull(process.env.PORTAL_ENDPOINT),
    minBytes: 40 * 1024 * 1024,
  })
}

//processor.setGateway({
//  url:
//    network.name === 'mainnet'
//      ? 'https://v2.archive.subsquid.io/network/arbitrum-one'
//      : 'https://v2.archive.subsquid.io/network/arbitrum-sepolia',
//})

builder
  .addLog({
    range: network.contracts.SQD.range,
    where: {
      address: [network.contracts.SQD.address],
      topic0: [SQD.events.Transfer.topic],
    },
    include: {
      transaction: true,
    },
  })
  .addLog({
    range: network.contracts.TemporaryHoldingFactory.range,
    where: {
      address: [network.contracts.TemporaryHoldingFactory.address],
      topic0: [TemporaryHoldingFactory.events.TemporaryHoldingCreated.topic],
    },
    include: {
      transaction: true,
    },
  })
  .addLog({
    range: network.contracts.RewardsDistribution.range,
    where: {
      address: [network.contracts.RewardsDistribution.address],
      topic0: [
        RewardsDistribution.events.Claimed.topic,
        RewardsDistribution.events.Distributed.topic,
      ],
    },
  })
  .addLog({
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
  })

addVestingsQuery(builder)
addWorkersRegistryQuery(builder)
addNetworkControllerQuery(builder)
addStakingQuery(builder)
addRouterQuery(builder)
addRewardTreasuryQuery(builder)

export const processor = builder.build()

export type Fields = GetDataSourceBlock<typeof processor> extends Block<infer F> ? F : never
export type BlockData = _BlockData<Fields>
export type BlockHeader = _BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>

export type ProcessorContext<Store> = DataHandlerContext<BlockData, Store> & {
  log: Logger
}
