import {
  PORTAL_POOL_TEMPLATE_KEY,
  createHandler,
  isLog,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'

import { PoolDistributionRateChange, PortalPool } from '~/model'

export const handleDistributionRateChanged = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.DistributionRateChanged.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = normalizeAddress(log.address)
  const event = PortalPoolImplementation.events.DistributionRateChanged.decode(log)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.get()
    if (!pool) return

    const change = new PoolDistributionRateChange({
      id: `${log.getTransaction().hash}-${log.logIndex}`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      txHash: log.getTransaction().hash,
      pool,
      oldRate: event.oldRate,
      newRate: event.newRate,
    })

    pool.rewardRate = event.newRate

    await ctx.store.track(change)

    ctx.log.info(
      `portal_pool(${poolAddress}) rate ${event.oldRate} -> ${event.newRate} (${elapsed()}ms)`,
    )
  })
})
