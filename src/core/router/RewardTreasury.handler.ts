import { isContract, isLog } from '../../item'
import { createHandler } from '../base'

import * as Router from '~/abi/Router'
import { network } from '~/config/network'
import { Settings } from '~/model'

export const rewardTreasurySetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.RewardTreasurySet.is(item.value)) return

  const log = item.value
  const { rewardTreasury } = Router.events.RewardTreasurySet.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    settings.contracts.rewardTreasury = rewardTreasury

    await ctx.store.upsert(settings)

    ctx.log.debug(`reward treasury contract address set to ${rewardTreasury}`)
  }
})
