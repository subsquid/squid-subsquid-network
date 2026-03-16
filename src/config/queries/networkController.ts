import fs from 'fs'

import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

import * as NetworkController from '~/abi/NetworkController'

export type NetworkControllerMetadata = {
  height: number
  networkController: ContractConfig[]
}

export function addNetworkControllerQuery(builder: DataSourceBuilder) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8')
  const metadata = JSON.parse(file) as NetworkControllerMetadata

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

  builder.addLog({
    range: {
      from: metadata.height + 1,
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
