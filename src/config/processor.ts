import {
  EvmBatchProcessor,
  assertNotNull,
  BlockHeader as _BlockHeader,
  BlockData as _BlockData,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
  DataHandlerContext,
} from '@subsquid/evm-processor';

import { network } from './network';

import * as RewardsDistribution from '~/abi/DistributedRewardsDistribution';
import * as GatewayRegistry from '~/abi/GatewayRegistry';
import * as NetworkController from '~/abi/NetworkController';
import * as SQD from '~/abi/SQD';
import * as Staking from '~/abi/Staking';
import * as Vesting from '~/abi/SubsquidVesting';
import * as TemporaryHoldingFactory from '~/abi/TemporaryHoldingFactory';
import * as VestingFactory from '~/abi/VestingFactory';
import * as WorkerRegistry from '~/abi/WorkerRegistration';
import { loadVestings } from '~/utils/loaders';

const vestings = loadVestings();

export const processor = new EvmBatchProcessor()
  .setRpcEndpoint({
    url: assertNotNull(process.env.RPC_ARBITRUM_SEPOLIA_HTTP || process.env.RPC_ENDPOINT),
    rateLimit: 10,
  })
  .setRpcDataIngestionSettings({
    newHeadTimeout: 30_000,
  })
  .setBlockRange(network.range)
  .setFinalityConfirmation(10)
  .setFields({
    block: {
      l1BlockNumber: true,
    },
  })
  .includeAllBlocks()
  .addLog({
    address: [network.contracts.WorkerRegistry.address],
    range: { from: network.contracts.WorkerRegistry.from },
    topic0: [
      WorkerRegistry.events.WorkerRegistered.topic,
      WorkerRegistry.events.WorkerDeregistered.topic,
      WorkerRegistry.events.WorkerWithdrawn.topic,
      WorkerRegistry.events.MetadataUpdated.topic,
      WorkerRegistry.events.ExcessiveBondReturned.topic,
    ],
  })
  .addLog({
    address: [network.contracts.NetworkController.address],
    range: { from: network.contracts.NetworkController.from },
    topic0: [
      NetworkController.events.BondAmountUpdated.topic,
      NetworkController.events.EpochLengthUpdated.topic,
      NetworkController.events.LockPeriodUpdated.topic,
    ],
  })
  .addLog({
    address: [network.contracts.OldNetworkController.address],
    range: {
      from: network.contracts.OldNetworkController.from,
      to: network.contracts.NetworkController.from - 1,
    },
    topic0: [
      NetworkController.events.BondAmountUpdated.topic,
      NetworkController.events.EpochLengthUpdated.topic,
    ],
  })
  .addLog({
    address: [network.contracts.Staking.address],
    range: { from: network.contracts.Staking.from },
    topic0: [
      Staking.events.Claimed.topic,
      Staking.events.Deposited.topic,
      Staking.events.Withdrawn.topic,
      Staking.events.Rewarded.topic,
    ],
  })
  .addLog({
    address: [network.contracts.SQD.address],
    range: { from: network.contracts.SQD.from },
    topic0: [SQD.events.Transfer.topic],
  })
  .addLog({
    address: [network.contracts.VestingFactory.address],
    range: { from: network.contracts.VestingFactory.from },
    topic0: [VestingFactory.events.VestingCreated.topic],
  })
  .addLog({
    address: [network.contracts.TemporaryHoldingFactory.address],
    range: { from: network.contracts.TemporaryHoldingFactory.from },
    topic0: [TemporaryHoldingFactory.events.TemporaryHoldingCreated.topic],
  })
  .addLog({
    address: [network.contracts.RewardsDistribution.address],
    range: { from: network.contracts.RewardsDistribution.from },
    topic0: [
      RewardsDistribution.events.Claimed.topic,
      RewardsDistribution.events.Distributed.topic,
    ],
  })
  .addLog({
    address: [network.contracts.GatewayRegistry.address],
    range: { from: network.contracts.GatewayRegistry.from },
    topic0: [
      GatewayRegistry.events.Registered.topic,
      GatewayRegistry.events.Unregistered.topic,
      GatewayRegistry.events.Staked.topic,
      GatewayRegistry.events.Unstaked.topic,
      GatewayRegistry.events.MetadataChanged.topic,
    ],
  })
  .addLog({
    address: vestings?.addresses,
    topic0: [Vesting.events.OwnershipTransferred.topic],
    range: {
      from: 0,
      to: vestings?.height,
    },
  })
  .addLog({
    topic0: [Vesting.events.OwnershipTransferred.topic],
    range: {
      from: vestings?.height ?? 0,
    },
  });

if (process.env.GATEWAY_URL) {
  processor.setGateway(process.env.GATEWAY_URL);
}

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type BlockData = _BlockData<Fields>;
export type Block = _BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;

export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
