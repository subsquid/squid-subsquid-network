import fs from 'fs'

import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { ContractConfig, network } from '../network'

export type RewardCalculationMetadata = {
  height: number
  rewardCalculation: ContractConfig[]
}

export function addRewardCalculationQuery(processor: EvmBatchProcessor) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8')
  const metadata = JSON.parse(file) as RewardCalculationMetadata

  for (const contract of metadata.rewardCalculation) {
    processor.addLog({
      address: [contract.address],
      range: {
        from: contract.range.from,
        to: contract.range.to ? contract.range.to : metadata.height,
      },
      topic0: [],
    })
  }

  processor.addLog({
    range: {
      from: metadata.height + 1,
    },
    topic0: [],
  })
}
