import fs from 'fs'

import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

import * as RewardTreasury from '~/abi/RewardTreasury'

export type RewardTreasuryMetadata = {
  height: number
  rewardTreasury: ContractConfig[]
}

export function addRewardTreasuryQuery(builder: DataSourceBuilder) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8')
  const metadata = JSON.parse(file) as RewardTreasuryMetadata

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

  builder.addLog({
    range: {
      from: metadata.height + 1,
    },
    where: {
      topic0: [RewardTreasury.events.Claimed.topic],
    },
  })
}
