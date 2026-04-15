import { DataSourceBuilder } from '@subsquid/evm-stream'
import type { ContractConfig } from '../network'
import { network } from '../network'
import { loadPreindexFile } from './loadPreindex'

export type RewardCalculationMetadata = {
  height: number
  rewardCalculation: ContractConfig[]
}

export function addRewardCalculationQuery(builder: DataSourceBuilder) {
  const metadata = loadPreindexFile<RewardCalculationMetadata>(
    `./assets/${network.name}/router.json`,
  )

  if (metadata) {
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
  }

  builder.addLog({
    range: {
      from: metadata ? metadata.height + 1 : network.range.from,
    },
    where: {
      topic0: [],
    },
  })
}
