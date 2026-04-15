import {
  NETWORK_CONTROLLER_TEMPLATE_KEY,
  createHandler,
  isContract,
  isLog,
  network,
} from '@sqd/shared'
import * as Router from '@sqd/shared/lib/abi/Router'

import { Contracts, Settings } from '~/model'

export const networkControllerSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.NetworkControllerSet.is(item.value)) return

  const log = item.value
  const { networkController } = Router.events.NetworkControllerSet.decode(log)
  const blockHeight = item.value.block.height

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    const oldAddress = settings.contracts.networkController
    if (oldAddress) ctx.templates.remove(NETWORK_CONTROLLER_TEMPLATE_KEY, oldAddress, blockHeight)
    ctx.templates.add(NETWORK_CONTROLLER_TEMPLATE_KEY, networkController, blockHeight)

    settings.contracts = new Contracts(undefined, {
      ...settings.contracts.toJSON(),
      networkController,
    })

    ctx.log.info(`network controller contract address set to ${networkController}`)
  }
})
