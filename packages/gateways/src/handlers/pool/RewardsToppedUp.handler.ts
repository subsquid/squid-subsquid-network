import {
  PORTAL_POOL_TEMPLATE_KEY,
  createHandler,
  isLog,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'

import { PoolEvent, PoolEventType, PortalPool } from '~/model'

export const handleRewardsToppedUp = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.RewardsToppedUp.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = normalizeAddress(log.address)
  const event = PortalPoolImplementation.events.RewardsToppedUp.decode(log)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.get()
    if (!pool) return

    pool.totalRewardsToppedUp += event.toProviders

    const poolEvent = new PoolEvent({
      id: `${log.getTransaction().hash}-${log.logIndex}`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      txHash: log.getTransaction().hash,
      pool,
      eventType: PoolEventType.TOPUP,
      amount: event.toProviders,
    })

    await ctx.store.track(poolEvent)

    ctx.log.info(`portal_pool(${poolAddress}) topped up ${event.toProviders} (${elapsed()}ms)`)
  })
})
