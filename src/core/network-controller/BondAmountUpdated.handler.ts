import { isLog } from '../../item'
import { createHandler } from '../base'

import * as NetworkController from '~/abi/NetworkController'
import { network } from '~/config/network'
import { NETWORK_CONTROLLER_TEMPLATE_KEY } from '~/config/queries/networkController'
import { Settings } from '~/model'

export const handleBondAmountUpdated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!NetworkController.events.BondAmountUpdated.is(item.value)) return
  if (!ctx.templates.has(NETWORK_CONTROLLER_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const log = item.value
  const { bondAmount } = NetworkController.events.BondAmountUpdated.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    settings.bondAmount = bondAmount

    ctx.log.info(`set bond amount set ${bondAmount}`)
  }
})
