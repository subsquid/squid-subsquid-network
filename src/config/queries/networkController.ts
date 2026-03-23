import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

import { loadPreindexFile } from './loadPreindex'

import * as NetworkController from '~/abi/NetworkController'

export type NetworkControllerMetadata = {
  height: number
  networkController: ContractConfig[]
}

export function addNetworkControllerQuery(builder: DataSourceBuilder) {
  const metadata = loadPreindexFile<NetworkControllerMetadata>(
    `./assets/${network.name}/router.json`,
  )

  if (metadata) {
    for (const contract of metadata.networkController) {
      builder.addLog({
        range: {
          from: contract.range.from,
          to: contract.range.to ? contract.range.to : metadata.height,
        },
        where: {
          address: [contract.address],
          topic0: [
            NetworkController.events.BondAmountUpdated.topic,
            NetworkController.events.EpochLengthUpdated.topic,
            NetworkController.events.LockPeriodUpdated.topic,
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
        NetworkController.events.BondAmountUpdated.topic,
        NetworkController.events.EpochLengthUpdated.topic,
        NetworkController.events.LockPeriodUpdated.topic,
      ],
    },
  })
}
