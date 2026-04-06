import { isContract, isLog } from '../../item'
import { createHandler } from '../base'

import * as Router from '~/abi/Router'
import { network } from '~/config/network'
import { REWARD_TREASURY_TEMPLATE_KEY } from '~/config/queries/rewardTreasury'
import { Contracts, Settings } from '~/model'

export const rewardTreasurySetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.RewardTreasurySet.is(item.value)) return

  const log = item.value
  const { rewardTreasury } = Router.events.RewardTreasurySet.decode(log)
  const blockHeight = item.value.block.height

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    const oldAddress = settings.contracts.rewardTreasury
    if (oldAddress) ctx.templates.remove(REWARD_TREASURY_TEMPLATE_KEY, oldAddress, blockHeight)
    ctx.templates.add(REWARD_TREASURY_TEMPLATE_KEY, rewardTreasury, blockHeight)

    settings.contracts = new Contracts(undefined, {
      ...settings.contracts.toJSON(),
      rewardTreasury,
    })

    ctx.log.info(`reward treasury contract address set to ${rewardTreasury}`)
  }
})
