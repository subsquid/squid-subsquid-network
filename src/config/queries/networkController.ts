import { DataSourceBuilder } from '@subsquid/evm-stream'

import { network } from '../network'

import * as NetworkController from '~/abi/NetworkController'

export const NETWORK_CONTROLLER_TEMPLATE_KEY = 'network_controller'

export function addNetworkControllerQuery(builder: DataSourceBuilder) {
  builder.addLog(NETWORK_CONTROLLER_TEMPLATE_KEY, {
    range: { from: network.range.from },
    where: {
      topic0: [
        NetworkController.events.BondAmountUpdated.topic,
        NetworkController.events.EpochLengthUpdated.topic,
        NetworkController.events.LockPeriodUpdated.topic,
      ],
    },
  })
}
