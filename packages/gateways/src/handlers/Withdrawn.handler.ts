import {
  isLog,
  createHandler,
  timed,
  createAccountId,
  PORTAL_POOL_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as PortalPoolImplementation from '@subsquid-network/shared/lib/abi/PortalPoolImplementation'

import { PortalPool } from '~/model'

export const handleWithdrawn = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.Withdrawn.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = item.address
  const { provider } = PortalPoolImplementation.events.Withdrawn.decode(log)

  const accountId = createAccountId(provider)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    await poolDeferred.getOrFail()
    ctx.log.info(`portal_pool(${poolAddress}) withdrawal by ${accountId} (${elapsed()}ms)`)
  })
})
