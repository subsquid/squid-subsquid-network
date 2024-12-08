import fs from 'fs';

import { EvmBatchProcessor } from '@subsquid/evm-processor';

import { ContractConfig, network } from '../network';

import * as NetworkController from '~/abi/NetworkController';

export type NetworkControllerMetadata = {
  height: number;
  networkController: ContractConfig[];
};

export function addNetworkControllerQuery(processor: EvmBatchProcessor) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8');
  const metadata = JSON.parse(file) as NetworkControllerMetadata;

  for (const contract of metadata.networkController) {
    processor.addLog({
      address: [contract.address],
      range: {
        from: contract.range.from,
        to: contract.range.to ? contract.range.to : metadata.height,
      },
      topic0: [
        NetworkController.events.BondAmountUpdated.topic,
        NetworkController.events.EpochLengthUpdated.topic,
        NetworkController.events.LockPeriodUpdated.topic,
      ],
    });
  }
}
