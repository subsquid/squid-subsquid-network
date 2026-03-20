import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { findTransferInTx } from '../helpers/misc'
import { createAccountId } from '../helpers/ids'
import { saveTransfer } from '../token/Transfer.handler'

import * as PortalPoolImplementation from '~/abi/PortalPoolImplementation'
import { PortalPool, TransferType } from '~/model'

export const handleWithdrawn = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.Withdrawn.is(item.value)) return

  const log = item.value
  const poolAddress = item.address
  const { provider, amount } = PortalPoolImplementation.events.Withdrawn.decode(log)

  const accountId = createAccountId(provider)
  const poolDeferred = ctx.store.defer(PortalPool, poolAddress)

  return timed(ctx, async (elapsed) => {
    const pool = await poolDeferred.get()
    if (!pool) {
      ctx.log.info(`skipped Withdrawn: unknown pool ${poolAddress} (${elapsed()}ms)`)
      return
    }

    const transfer = findTransferInTx(log.transaction?.logs ?? [], {
      to: accountId,
      amount,
    })
    if (!transfer) return

    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      portalPool: pool,
    })

    ctx.log.info(`portal_pool(${poolAddress}) withdrawal by ${accountId} (${elapsed()}ms)`)
  })
})
