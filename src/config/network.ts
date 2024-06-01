import { assertNotNull } from '@subsquid/evm-processor';

export const network = {
  name: assertNotNull(process.env.NETWORK),
  contracts: {
    Staking: assertNotNull(process.env.STAKING_CONTRACT_ADDRESS).toLowerCase(),
    WorkerRegistry: assertNotNull(process.env.WORKER_REGISTRY_CONTRACT_ADDRESS).toLowerCase(),
    NetworkController: assertNotNull(process.env.NETWORK_CONTROLLER_CONTRACT_ADDRESS).toLowerCase(),
    SQD: assertNotNull(process.env.SQD_CONTRACT_ADDRESS).toLowerCase(),
    VestingFactory: assertNotNull(process.env.VESTING_FACTORY_CONTRACT_ADDRESS).toLowerCase(),
    RewardTreasury: assertNotNull(process.env.REWARD_TREASURY_CONTRACT_ADDRESS).toLowerCase(),
    RewardsDistribution: assertNotNull(process.env.REWARDS_DISTRIBUTION_ADDRESS).toLowerCase(),
    GatewayRegistry: assertNotNull(process.env.GATEWAY_REGISTRY_CONTRACT_ADDRESS).toLowerCase(),
    Multicall3: assertNotNull(process.env.MULTICALL_3_CONTRACT_ADDRESS).toLowerCase(),
    TemporaryHoldingFactory: assertNotNull(
      process.env.TEMPORARY_HOLDING_FACTORY_CONTRACT_ADDRESS,
    ).toLowerCase(),
  },
  range: {
    from: process.env.RANGE_FROM ? Number(process.env.RANGE_FROM) : 0,
    to: process.env.RANGE_TO ? Number(process.env.RANGE_TO) : undefined,
  },
};
