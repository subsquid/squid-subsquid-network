import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId } from '../helpers/ids'

import * as PortalPoolFactory from '~/abi/PortalPoolFactory'
import { network } from '~/config/network'
import { PORTAL_POOL_TEMPLATE_KEY } from '~/config/queries/portalPools'
import { Account, AccountType, PortalPool } from '~/model'
import { normalizeAddress } from '~/utils/misc'

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
  const operatorDeferred = ctx.store.defer(Account, createAccountId(operator))

  return timed(ctx, async (elapsed) => {
    const operatorAccount = await ctx.store.getOrCreate(
      Account,
      createAccountId(operator),
      (id) => {
        ctx.log.info(`created account(${id})`)
        return createAccount(id, { type: AccountType.USER })
      },
    )

    const pool = new PortalPool({
      id: portalAddress,
      createdAt: new Date(item.value.block.timestamp),
      createdAtBlock: item.value.block.height,
      operator: operatorAccount,
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
      `created portal_pool(${portalAddress}) by operator(${operatorAccount.id}) (${elapsed()}ms)`,
    )
  })
})
