import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

import { loadPreindexFile } from './loadPreindex'

import * as WorkerRegistry from '~/abi/WorkerRegistration'

export type WorkerRegistryMetadata = {
  height: number
  workerRegistration: ContractConfig[]
}

export function addWorkersRegistryQuery(builder: DataSourceBuilder) {
  const metadata = loadPreindexFile<WorkerRegistryMetadata>(
    `./assets/${network.name}/router.json`,
  )

  if (metadata) {
    for (const contract of metadata.workerRegistration) {
      builder.addLog({
        range: {
          from: contract.range.from,
          to: contract.range.to ? contract.range.to : metadata.height,
        },
        where: {
          address: [contract.address],
          topic0: [
            WorkerRegistry.events.WorkerRegistered.topic,
            WorkerRegistry.events.WorkerDeregistered.topic,
            WorkerRegistry.events.WorkerWithdrawn.topic,
            WorkerRegistry.events.MetadataUpdated.topic,
            WorkerRegistry.events.ExcessiveBondReturned.topic,
          ],
        },
      })
    }
  }

  builder.addLog({
    range: {
      from: metadata ? metadata.height + 1 : network.range.from,
    },
    where: {
      topic0: [
        WorkerRegistry.events.WorkerRegistered.topic,
        WorkerRegistry.events.WorkerDeregistered.topic,
        WorkerRegistry.events.WorkerWithdrawn.topic,
        WorkerRegistry.events.MetadataUpdated.topic,
        WorkerRegistry.events.ExcessiveBondReturned.topic,
      ],
    },
  })
}
