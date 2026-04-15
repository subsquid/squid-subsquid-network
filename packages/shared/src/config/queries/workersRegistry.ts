import { DataSourceBuilder } from '@subsquid/evm-stream'
import * as WorkerRegistry from '../../abi/WorkerRegistration'
import { network } from '../network'

export const WORKER_REGISTRATION_TEMPLATE_KEY = 'worker_registration'

export function addWorkersRegistryQuery(builder: DataSourceBuilder) {
  builder.addLog(WORKER_REGISTRATION_TEMPLATE_KEY, {
    range: { from: network.range.from },
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
