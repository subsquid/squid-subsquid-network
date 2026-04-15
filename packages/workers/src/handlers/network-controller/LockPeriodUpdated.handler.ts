import {
  isLog,
  createHandler,
  network,
  NETWORK_CONTROLLER_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as NetworkController from '@subsquid-network/shared/lib/abi/NetworkController'

import { Settings } from '~/model'

export const handleLockPeriodUpdated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!NetworkController.events.LockPeriodUpdated.is(item.value)) return
  if (!ctx.templates.has(NETWORK_CONTROLLER_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const event = NetworkController.events.LockPeriodUpdated.decode(item.value)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    settings.lockPeriod = Number(event.lockPeriod)
    ctx.log.info(`set lock period to ${settings.lockPeriod}`)
  }
})
