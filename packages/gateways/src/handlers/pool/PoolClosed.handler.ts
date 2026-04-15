import {
  PORTAL_POOL_TEMPLATE_KEY,
  createHandler,
  isLog,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'

import { PortalPool } from '~/model'

export const handlePoolClosed = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.PoolClosed.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = normalizeAddress(log.address)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.get()
    if (!pool) return

    pool.closedAt = new Date(log.block.timestamp)
    pool.closedAtBlock = log.block.height

    ctx.log.info(`portal_pool(${poolAddress}) closed (${elapsed()}ms)`)
  })
})
