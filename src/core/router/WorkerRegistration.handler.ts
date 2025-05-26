import { isContract, isLog } from '../../item'
import { createHandler } from '../base'

import * as Router from '~/abi/Router'
import { network } from '~/config/network'
import { Settings } from '~/model'

export const workerRegistrationSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.WorkerRegistrationSet.is(item.value)) return

  const log = item.value
  const { workerRegistration } = Router.events.WorkerRegistrationSet.decode(log)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    settings.contracts.workerRegistration = workerRegistration

    await ctx.store.upsert(settings)

    ctx.log.debug(`worker registration contract address set to ${workerRegistration}`)
  }
})
