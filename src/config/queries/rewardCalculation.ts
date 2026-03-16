import fs from 'fs'

import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

export type RewardCalculationMetadata = {
  height: number
  rewardCalculation: ContractConfig[]
}

export function addRewardCalculationQuery(builder: DataSourceBuilder) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8')
  const metadata = JSON.parse(file) as RewardCalculationMetadata

  for (const contract of metadata.rewardCalculation) {
    builder.addLog({
      range: {
        from: contract.range.from,
        to: contract.range.to ? contract.range.to : metadata.height,
      },
      where: {
        address: [contract.address],
        topic0: [],
      },
    })
  }

  builder.addLog({
    range: {
      from: metadata.height + 1,
    },
    where: {
      topic0: [],
    },
  })
}
