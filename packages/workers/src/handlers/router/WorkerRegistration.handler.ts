import {
  WORKER_REGISTRATION_TEMPLATE_KEY,
  createHandler,
  isContract,
  isLog,
  network,
} from '@sqd/shared'
import * as Router from '@sqd/shared/lib/abi/Router'

import { Contracts, Settings } from '~/model'

export const workerRegistrationSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.WorkerRegistrationSet.is(item.value)) return

  const log = item.value
  const { workerRegistration } = Router.events.WorkerRegistrationSet.decode(log)
  const blockHeight = item.value.block.height

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()

    const oldAddress = settings.contracts.workerRegistration
    if (oldAddress) ctx.templates.remove(WORKER_REGISTRATION_TEMPLATE_KEY, oldAddress, blockHeight)
    ctx.templates.add(WORKER_REGISTRATION_TEMPLATE_KEY, workerRegistration, blockHeight)

    settings.contracts = new Contracts(undefined, {
      ...settings.contracts.toJSON(),
      workerRegistration,
    })

    ctx.log.info(`worker registration contract address set to ${workerRegistration}`)
  }
})
