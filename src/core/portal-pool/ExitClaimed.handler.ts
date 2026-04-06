import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createAccountId } from '../helpers/ids'
import { findTransferInTx } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

import * as PortalPoolImplementation from '~/abi/PortalPoolImplementation'
import { PORTAL_POOL_TEMPLATE_KEY } from '~/config/queries/portalPools'
import { PortalPool, TransferType } from '~/model'

export const handleExitClaimed = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.ExitClaimed.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = item.address
  const { provider, amount } = PortalPoolImplementation.events.ExitClaimed.decode(log)

  const accountId = createAccountId(provider)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.getOrFail()

    const transfer = findTransferInTx(log.transaction?.logs ?? [], {
      to: accountId,
      amount,
    })
    if (!transfer) return

    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      portalPool: pool,
    })

    ctx.log.info(`portal_pool(${poolAddress}) exit claimed by ${accountId} (${elapsed()}ms)`)
  })
})
