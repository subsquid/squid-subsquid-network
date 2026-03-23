import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

import { loadPreindexFile } from './loadPreindex'

import * as RewardTreasury from '~/abi/RewardTreasury'

export type RewardTreasuryMetadata = {
  height: number
  rewardTreasury: ContractConfig[]
}

export function addRewardTreasuryQuery(builder: DataSourceBuilder) {
  const metadata = loadPreindexFile<RewardTreasuryMetadata>(
    `./assets/${network.name}/router.json`,
  )

  if (metadata) {
    for (const contract of metadata.rewardTreasury) {
      builder.addLog({
        range: {
          from: contract.range.from,
          to: contract.range.to ? contract.range.to : metadata.height,
        },
        where: {
          address: [contract.address],
          topic0: [RewardTreasury.events.Claimed.topic],
        },
      })
    }
  }

  builder.addLog({
    range: {
      from: metadata ? metadata.height + 1 : network.range.from,
    },
    where: {
      topic0: [RewardTreasury.events.Claimed.topic],
    },
  })
}
