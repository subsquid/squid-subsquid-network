import { DataSourceBuilder } from '@subsquid/evm-stream'

import { network } from '../network'

import * as Staking from '~/abi/Staking'

export const STAKING_TEMPLATE_KEY = 'staking'

export function addStakingQuery(builder: DataSourceBuilder) {
  builder.addLog(STAKING_TEMPLATE_KEY, {
    range: { from: network.range.from },
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
