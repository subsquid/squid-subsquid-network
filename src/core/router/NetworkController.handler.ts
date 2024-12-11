import { isContract, isLog, LogItem } from '../../item'
import { createHandler, createHandlerOld } from '../base'

import * as Router from '~/abi/Router'
import { network } from '~/config/network'
import { Settings } from '~/model'

export const networkControllerSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.NetworkControllerSet.is(item.value)) return

  const log = item.value
  const { networkController } = Router.events.NetworkControllerSet.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    settings.contracts.networkController = networkController

    await ctx.store.upsert(settings)

    ctx.log.debug(`network controller contract address set to ${networkController}`)
  }
})
