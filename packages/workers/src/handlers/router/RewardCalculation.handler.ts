import {
  isContract,
  isLog,
  createHandler,
  network,
} from '@subsquid-network/shared'
import * as Router from '@subsquid-network/shared/lib/abi/Router'

import { Contracts, Settings } from '~/model'

export const rewardCalculationSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.RewardCalculationSet.is(item.value)) return

  const { rewardCalculation } = Router.events.RewardCalculationSet.decode(item.value)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    settings.contracts = new Contracts(undefined, {
      ...settings.contracts.toJSON(),
      rewardCalculation,
    })

    ctx.log.info(`reward calculation contract address set to ${rewardCalculation}`)
  }
})
