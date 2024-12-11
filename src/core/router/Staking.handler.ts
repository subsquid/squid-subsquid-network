import { isContract, isLog } from '../../item'
import { createHandler } from '../base'

import * as Router from '~/abi/Router'
import { network } from '~/config/network'
import { Settings } from '~/model'

export const stakingSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.StakingSet.is(item.value)) return

  const log = item.value
  const { staking } = Router.events.StakingSet.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    settings.contracts.staking = staking

    await ctx.store.upsert(settings)

    ctx.log.debug(`staking contract address set to ${staking}`)
  }
})
