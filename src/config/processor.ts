import {
  EvmBatchProcessor,
  assertNotNull,
  BlockHeader as _BlockHeader,
  BlockData as _BlockData,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
  DataHandlerContext,
} from '@subsquid/evm-processor'

import { network } from './network'
import { addNetworkControllerQuery } from './queries/networkController'
import { addRouterQuery } from './queries/router'
import { addStakingQuery } from './queries/staking'
import { addVestingsQuery } from './queries/vestings'
import { addWorkersRegistryQuery } from './queries/workersRegistry'
import { addRewardTreasuryQuery } from './queries/rewardTreasury'

import * as RewardsDistribution from '~/abi/DistributedRewardsDistribution'
import * as GatewayRegistry from '~/abi/GatewayRegistry'
import * as SQD from '~/abi/SQD'
import * as TemporaryHoldingFactory from '~/abi/TemporaryHoldingFactory'

export const processor = new EvmBatchProcessor()
  .setRpcEndpoint({
    url: assertNotNull(process.env.RPC_ENDPOINT),
    rateLimit: 10,
  })
  .setRpcDataIngestionSettings({
    newHeadTimeout: 30_000,
  })
  .setFinalityConfirmation(10)
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

//if (process.env.PORTAL_ENDPOINT) {
//  processor.setPortal({
//    url: assertNotNull(process.env.PORTAL_ENDPOINT),
//    minBytes: 20 * 1024 * 1024,
//  })
//}

processor.setGateway({
  url:
    network.name === 'mainnet'
      ? 'https://v2.archive.subsquid.io/network/arbitrum-one'
      : 'https://v2.archive.subsquid.io/network/arbitrum-sepolia',
})

processor
  .addLog({
    address: [network.contracts.SQD.address],
    range: network.contracts.SQD.range,
    topic0: [SQD.events.Transfer.topic],
    transaction: true,
  })
  .addLog({
    address: [network.contracts.TemporaryHoldingFactory.address],
    range: network.contracts.TemporaryHoldingFactory.range,
    topic0: [TemporaryHoldingFactory.events.TemporaryHoldingCreated.topic],
  })
  .addLog({
    address: [network.contracts.RewardsDistribution.address],
    range: network.contracts.RewardsDistribution.range,
    topic0: [
      RewardsDistribution.events.Claimed.topic,
      RewardsDistribution.events.Distributed.topic,
    ],
  })
  .addLog({
    address: [network.contracts.GatewayRegistry.address],
    range: network.contracts.GatewayRegistry.range,
    topic0: [
      GatewayRegistry.events.Registered.topic,
      GatewayRegistry.events.Unregistered.topic,
      GatewayRegistry.events.Staked.topic,
      GatewayRegistry.events.Unstaked.topic,
      GatewayRegistry.events.MetadataChanged.topic,
      GatewayRegistry.events.AutoextensionEnabled.topic,
      GatewayRegistry.events.AutoextensionDisabled.topic,
    ],
  })

addVestingsQuery(processor)
addWorkersRegistryQuery(processor)
addNetworkControllerQuery(processor)
addStakingQuery(processor)
addRouterQuery(processor)
addRewardTreasuryQuery(processor)

export type Fields = EvmBatchProcessorFields<typeof processor>
export type BlockData = _BlockData<Fields>
export type BlockHeader = _BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>

export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
