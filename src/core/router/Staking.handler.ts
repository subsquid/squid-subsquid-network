import { isContract, isLog } from '../../item'
import { createHandler } from '../base'

import * as Router from '~/abi/Router'
import { network } from '~/config/network'
import { STAKING_TEMPLATE_KEY } from '~/config/queries/staking'
import { Contracts, Settings } from '~/model'

export const stakingSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.StakingSet.is(item.value)) return

  const log = item.value
  const { staking } = Router.events.StakingSet.decode(log)
  const blockHeight = item.value.block.height

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    const oldAddress = settings.contracts.staking
    if (oldAddress) ctx.templates.remove(STAKING_TEMPLATE_KEY, oldAddress, blockHeight)
    ctx.templates.add(STAKING_TEMPLATE_KEY, staking, blockHeight)

    settings.contracts = new Contracts(undefined, { ...settings.contracts.toJSON(), staking })

    ctx.log.info(`staking contract address set to ${staking}`)
  }
})
