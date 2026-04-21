import {
  PORTAL_POOL_TEMPLATE_KEY,
  createAccountId,
  createHandler,
  isLog,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'

import { PoolEvent, PoolEventType, PoolProvider, PortalPool } from '~/model'

export const handleDeposited = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.Deposited.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = normalizeAddress(log.address)
  const event = PortalPoolImplementation.events.Deposited.decode(log)
  const providerId = createAccountId(event.provider)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)
  const providerEntityId = `${poolAddress}-${providerId}`

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.get()
    if (!pool) return

    pool.tvlTotal += event.amount
    pool.tvlStable += event.amount

    const provider = await ctx.store.getOrCreate(
      PoolProvider,
      providerEntityId,
      (id) => new PoolProvider({ id, pool, providerId, deposited: 0n }),
    )
    provider.deposited += event.amount

    const poolEvent = new PoolEvent({
      id: `${log.getTransaction().hash}-${log.logIndex}`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      txHash: log.getTransaction().hash,
      pool,
      eventType: PoolEventType.DEPOSIT,
      amount: event.amount,
      providerId,
    })

    await ctx.store.track(poolEvent)

    ctx.log.info(`portal_pool(${poolAddress}) deposit by ${providerId} (${elapsed()}ms)`)
  })
})
