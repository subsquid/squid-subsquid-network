import { DataSourceBuilder } from '@subsquid/evm-stream'
import * as Staking from '../../abi/Staking'
import { network } from '../network'

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
