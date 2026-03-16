import { DataSourceBuilder } from '@subsquid/evm-stream'

import { network } from '../network'

import * as Router from '~/abi/Router'

export function addRouterQuery(builder: DataSourceBuilder) {
  builder.addLog({
    range: network.contracts.Router.range,
    where: {
      address: [network.contracts.Router.address],
      topic0: [
        Router.events.NetworkControllerSet.topic,
        Router.events.RewardCalculationSet.topic,
        Router.events.RewardTreasurySet.topic,
        Router.events.WorkerRegistrationSet.topic,
        Router.events.StakingSet.topic,
      ],
    },
  })
}
