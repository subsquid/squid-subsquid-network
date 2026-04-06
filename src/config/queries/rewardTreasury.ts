import { DataSourceBuilder } from '@subsquid/evm-stream'

import { network } from '../network'

import * as RewardTreasury from '~/abi/RewardTreasury'

export const REWARD_TREASURY_TEMPLATE_KEY = 'reward_treasury'

export function addRewardTreasuryQuery(builder: DataSourceBuilder) {
  builder.addLog(REWARD_TREASURY_TEMPLATE_KEY, {
    range: { from: network.range.from },
    where: { topic0: [RewardTreasury.events.Claimed.topic] },
  })
}
