import { isContract, isLog } from '../../item'
import { createHandler } from '../base'

import * as Router from '~/abi/Router'
import { network } from '~/config/network'
import { Settings } from '~/model'

export const rewardCalculationSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.RewardCalculationSet.is(item.value)) return

  const log = item.value
  const { rewardCalculation } = Router.events.RewardCalculationSet.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    settings.contracts.rewardCalculation = rewardCalculation

    await ctx.store.upsert(settings)

    ctx.log.debug(`reward calculation contract address set to ${rewardCalculation}`)
  }
})
