import {
  PORTAL_POOL_TEMPLATE_KEY,
  createHandler,
  isLog,
  network,
  normalizeAddress,
} from '@sqd/shared'
import * as PortalPoolFactory from '@sqd/shared/lib/abi/PortalPoolFactory'

export const handlePoolCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.PortalPoolFactory.address) return
  if (!PortalPoolFactory.events.PoolCreated.is(item.value)) return

  const log = item.value
  const event = PortalPoolFactory.events.PoolCreated.decode(log)
  const portalAddress = normalizeAddress(event.portal)

  return async () => {
    ctx.templates.add(PORTAL_POOL_TEMPLATE_KEY, portalAddress, log.block.height)
    ctx.log.info(`registered portal_pool template for ${portalAddress}`)
  }
})
