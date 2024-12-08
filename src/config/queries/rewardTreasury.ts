import fs from 'fs';

import { EvmBatchProcessor } from '@subsquid/evm-processor';

import { ContractConfig, network } from '../network';

import * as RewardTreasury from '~/abi/RewardTreasury';

export type RewardTreasuryMetadata = {
  height: number;
  rewardTreasury: ContractConfig[];
};

export function addRewardTreasuryQuery(processor: EvmBatchProcessor) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8');
  const metadata = JSON.parse(file) as RewardTreasuryMetadata;

  for (const contract of metadata.rewardTreasury) {
    processor.addLog({
      address: [contract.address],
      range: {
        from: contract.range.from,
        to: contract.range.to ? contract.range.to : metadata.height,
      },
      topic0: [RewardTreasury.events.Claimed.topic],
    });
  }
}
