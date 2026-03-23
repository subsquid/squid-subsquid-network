import { DataSourceBuilder } from '@subsquid/evm-stream'

import { ContractConfig, network } from '../network'

import { loadPreindexFile } from './loadPreindex'

import * as Staking from '~/abi/Staking'

export type StakingMetadata = {
  height: number
  staking: ContractConfig[]
}

export function addStakingQuery(builder: DataSourceBuilder) {
  const metadata = loadPreindexFile<StakingMetadata>(`./assets/${network.name}/router.json`)

  if (metadata) {
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
  }

  builder.addLog({
    range: {
      from: metadata ? metadata.height + 1 : network.range.from,
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
