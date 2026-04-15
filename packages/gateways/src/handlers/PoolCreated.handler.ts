import {
  isLog,
  createHandler,
  timed,
  createAccountId,
  normalizeAddress,
  network,
  PORTAL_POOL_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as PortalPoolFactory from '@subsquid-network/shared/lib/abi/PortalPoolFactory'

import { PortalPool } from '~/model'

export const handlePoolCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.PortalPoolFactory.address) return
  if (!PortalPoolFactory.events.PoolCreated.is(item.value)) return

  const {
    portal,
    operator,
    rewardToken,
    capacity,
    distributionRatePerSecond,
    initialDeposit,
    tokenSuffix,
    metadata,
  } = PortalPoolFactory.events.PoolCreated.decode(item.value)

  const portalAddress = normalizeAddress(portal)
  const operatorId = createAccountId(operator)

  return timed(ctx, async (elapsed) => {
    const pool = new PortalPool({
      id: portalAddress,
      createdAt: new Date(item.value.block.timestamp),
      createdAtBlock: item.value.block.height,
      operator: operatorId,
      rewardToken: normalizeAddress(rewardToken),
      capacity,
      distributionRatePerSecond,
      initialDeposit,
      tokenSuffix,
      metadata: metadata || null,
    })

    await ctx.store.track(pool)

    ctx.templates.add(PORTAL_POOL_TEMPLATE_KEY, portalAddress, item.value.block.height)

    ctx.log.info(
      `created portal_pool(${portalAddress}) by operator(${operatorId}) (${elapsed()}ms)`,
    )
  })
})
