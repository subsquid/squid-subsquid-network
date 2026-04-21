import { NETWORK_CONTROLLER_TEMPLATE_KEY, createHandler, isLog, network } from '@sqd/shared'
import * as NetworkController from '@sqd/shared/lib/abi/NetworkController'

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
    // Caps depend on `bondAmount` but are refreshed lazily: each active
    // worker is re-capped on the next `updateWorkerRewardStats` cycle (see
    // metrics.ts), and individual workers are re-capped inline on every
    // deposit/withdraw via `refreshWorkerCap`.
  }
})
