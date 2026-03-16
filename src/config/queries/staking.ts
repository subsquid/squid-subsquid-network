import fs from 'fs'

import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

import * as Staking from '~/abi/Staking'

export type StakingMetadata = {
  height: number
  staking: ContractConfig[]
}

export function addStakingQuery(builder: DataSourceBuilder) {
  const file = fs.readFileSync(`./assets/${network.name}/router.json`, 'utf-8')
  const metadata = JSON.parse(file) as StakingMetadata

  for (const contract of metadata.staking) {
    builder.addLog({
      range: {
        from: contract.range.from,
        to: contract.range.to ? contract.range.to : metadata.height,
      },
      where: {
        address: [contract.address],
        topic0: [
          Staking.events.Claimed.topic,
          Staking.events.Deposited.topic,
          Staking.events.Withdrawn.topic,
          Staking.events.Rewarded.topic,
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
        Staking.events.Claimed.topic,
        Staking.events.Deposited.topic,
        Staking.events.Withdrawn.topic,
        Staking.events.Rewarded.topic,
      ],
    },
  })
}
