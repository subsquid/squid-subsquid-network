import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { network } from '../network'

import * as Router from '~/abi/Router'

export function addRouterQuery(processor: EvmBatchProcessor) {
  processor.addLog({
    address: [network.contracts.Router.address],
    range: network.contracts.Router.range,
    topic0: [
      Router.events.NetworkControllerSet.topic,
      Router.events.RewardCalculationSet.topic,
      Router.events.RewardTreasurySet.topic,
      Router.events.WorkerRegistrationSet.topic,
      Router.events.StakingSet.topic,
    ],
  })
}
