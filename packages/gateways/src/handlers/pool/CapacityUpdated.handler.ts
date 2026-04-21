import {
  PORTAL_POOL_TEMPLATE_KEY,
  createHandler,
  isLog,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'

import { PoolCapacityChange, PortalPool } from '~/model'

export const handleCapacityUpdated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.CapacityUpdated.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = normalizeAddress(log.address)
  const event = PortalPoolImplementation.events.CapacityUpdated.decode(log)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.get()
    if (!pool) return

    const change = new PoolCapacityChange({
      id: `${log.getTransaction().hash}-${log.logIndex}`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      txHash: log.getTransaction().hash,
      pool,
      oldCapacity: event.oldCapacity,
      newCapacity: event.newCapacity,
    })

    pool.capacity = event.newCapacity

    await ctx.store.track(change)

    ctx.log.info(
      `portal_pool(${poolAddress}) capacity ${event.oldCapacity} -> ${event.newCapacity} (${elapsed()}ms)`,
    )
  })
})
