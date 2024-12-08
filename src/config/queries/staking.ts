import fs from 'fs';

import { EvmBatchProcessor } from '@subsquid/evm-processor';

import { ContractConfig, network } from '../network';

import * as Staking from '~/abi/Staking';

export type StakingMetadata = {
  height: number;
  staking: ContractConfig[];
};

export function addStakingQuery(processor: EvmBatchProcessor) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8');
  const metadata = JSON.parse(file) as StakingMetadata;

  for (const contract of metadata.staking) {
    processor.addLog({
      address: [contract.address],
      range: {
        from: contract.range.from,
        to: contract.range.to ? contract.range.to : metadata.height,
      },
      topic0: [
        Staking.events.Claimed.topic,
        Staking.events.Deposited.topic,
        Staking.events.Withdrawn.topic,
        Staking.events.Rewarded.topic,
      ],
    });
  }
}
