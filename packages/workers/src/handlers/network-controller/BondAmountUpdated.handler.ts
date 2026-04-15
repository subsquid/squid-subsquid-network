import {
  isLog,
  createHandler,
  network,
  NETWORK_CONTROLLER_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as NetworkController from '@subsquid-network/shared/lib/abi/NetworkController'

import { Settings } from '~/model'

export const handleBondAmountUpdated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!NetworkController.events.BondAmountUpdated.is(item.value)) return
  if (!ctx.templates.has(NETWORK_CONTROLLER_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const { bondAmount } = NetworkController.events.BondAmountUpdated.decode(item.value)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    settings.bondAmount = bondAmount
    ctx.log.info(`set bond amount ${bondAmount}`)
  }
})
