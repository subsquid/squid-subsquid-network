import { createHandler, isContract, isLog, network } from '@sqd/shared'
import * as Router from '@sqd/shared/lib/abi/Router'

import { Contracts, Settings } from '~/model'

export const rewardTreasurySetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.RewardTreasurySet.is(item.value)) return

  const log = item.value
  const { rewardTreasury } = Router.events.RewardTreasurySet.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    settings.contracts = new Contracts(undefined, {
      ...settings.contracts.toJSON(),
      rewardTreasury,
    })

    ctx.log.info(`reward treasury contract address set to ${rewardTreasury}`)
  }
})
