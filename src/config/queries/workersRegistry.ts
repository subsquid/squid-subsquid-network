import fs from 'fs';

import { EvmBatchProcessor } from '@subsquid/evm-processor';

import { ContractConfig, network } from '../network';

import * as WorkerRegistry from '~/abi/WorkerRegistration';

export type WorkerRegistryMetadata = {
  height: number;
  workerRegistration: ContractConfig[];
};

export function addWorkersRegistryQuery(processor: EvmBatchProcessor) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8');
  const metadata = JSON.parse(file) as WorkerRegistryMetadata;

  for (const contract of metadata.workerRegistration) {
    processor.addLog({
      address: [contract.address],
      range: {
        from: contract.range.from,
        to: contract.range.to ? contract.range.to : metadata.height,
      },
      topic0: [
        WorkerRegistry.events.WorkerRegistered.topic,
        WorkerRegistry.events.WorkerDeregistered.topic,
        WorkerRegistry.events.WorkerWithdrawn.topic,
        WorkerRegistry.events.MetadataUpdated.topic,
        WorkerRegistry.events.ExcessiveBondReturned.topic,
      ],
    });
  }
}
