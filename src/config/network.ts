import assert from 'assert';

import { assertNotNull } from '@subsquid/evm-processor';

export const network = {
  name: assertNotNull(process.env.NETWORK),
  contracts: {
    Staking: parseAddress(process.env.STAKING_CONTRACT_ADDRESS, 'Staking'),
    WorkerRegistry: parseAddress(process.env.WORKER_REGISTRY_CONTRACT_ADDRESS, 'Worker Registry'),
    NetworkController: parseAddress(
      process.env.NETWORK_CONTROLLER_CONTRACT_ADDRESS,
      'Network Controller',
    ),
    OldNetworkController: parseAddress(
      process.env.OLD_NETWORK_CONTROLLER_CONTRACT_ADDRESS,
      'Old Network Controller',
    ),
    SQD: parseAddress(process.env.SQD_CONTRACT_ADDRESS, 'SQD'),
    VestingFactory: parseAddress(process.env.VESTING_FACTORY_CONTRACT_ADDRESS, 'Vesting Factory'),
    RewardTreasury: parseAddress(process.env.REWARD_TREASURY_CONTRACT_ADDRESS, 'Reward Treasury'),
    RewardsDistribution: parseAddress(
      process.env.REWARDS_DISTRIBUTION_ADDRESS,
      'Rewards Distribution',
    ),
    GatewayRegistry: parseAddress(
      process.env.GATEWAY_REGISTRY_CONTRACT_ADDRESS,
      'Gateway Registry',
    ),
    Multicall3: parseAddress(process.env.MULTICALL_3_CONTRACT_ADDRESS, 'Multicall3'),
    SoftCap: parseAddress(process.env.SOFT_CAP_CONTRACT_ADDRESS, 'Soft Cap'),
    TemporaryHoldingFactory: parseAddress(
      process.env.TEMPORARY_HOLDING_FACTORY_CONTRACT_ADDRESS,
      'Temporary Holding Factory',
    ),
    Router: parseAddress(process.env.ROUTER_CONTRACT_ADDRESS, 'Router'),
  },
  range: {
    from: process.env.RANGE_FROM ? Number(process.env.RANGE_FROM) : 0,
    to: process.env.RANGE_TO ? Number(process.env.RANGE_TO) : undefined,
  },
};

function parseAddress(val: string | undefined, name: string) {
  assert(val, `address for contract ${name} is missing`);

  const [address, from] = val.toLowerCase().split(';');

  return {
    address,
    from: from ? Number(from) : 0,
  };
}
