import {
  PORTAL_POOL_TEMPLATE_KEY,
  createAccountId,
  createHandler,
  isLog,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'

import { PoolEvent, PoolEventType, PortalPool } from '~/model'

export const handleExitClaimed = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.ExitClaimed.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = normalizeAddress(log.address)
  const event = PortalPoolImplementation.events.ExitClaimed.decode(log)
  const providerId = createAccountId(event.provider)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.get()
    if (!pool) return

    pool.tvlTotal -= event.amount

    const poolEvent = new PoolEvent({
      id: `${log.getTransaction().hash}-${log.logIndex}-claim`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      txHash: log.getTransaction().hash,
      pool,
      eventType: PoolEventType.WITHDRAWAL,
      amount: event.amount,
      providerId,
    })

    await ctx.store.track(poolEvent)

    ctx.log.info(`portal_pool(${poolAddress}) exit claimed by ${providerId} (${elapsed()}ms)`)
  })
})
