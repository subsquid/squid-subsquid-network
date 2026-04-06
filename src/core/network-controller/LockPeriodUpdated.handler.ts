import { isLog } from '../../item'
import { createHandler } from '../base'

import * as NetworkController from '~/abi/NetworkController'
import { network } from '~/config/network'
import { NETWORK_CONTROLLER_TEMPLATE_KEY } from '~/config/queries/networkController'
import { Settings } from '~/model'

export const handleLockPeriodUpdated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!NetworkController.events.LockPeriodUpdated.is(item.value)) return
  if (!ctx.templates.has(NETWORK_CONTROLLER_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const log = item.value
  const event = NetworkController.events.LockPeriodUpdated.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    settings.lockPeriod = Number(event.lockPeriod)

    ctx.log.info(`set lock period to ${settings.lockPeriod}`)
  }
})
