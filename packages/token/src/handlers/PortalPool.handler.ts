import {
  isLog,
  createHandler,
  timed,
  createAccountId,
  findTransferInTx,
  PORTAL_POOL_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as PortalPoolImplementation from '@subsquid-network/shared/lib/abi/PortalPoolImplementation'

import { TransferType } from '~/model'
import { saveTransfer } from './Transfer.handler'

export const handlePortalPoolDeposited = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.Deposited.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = item.address
  const { provider, amount } = PortalPoolImplementation.events.Deposited.decode(log)

  const accountId = createAccountId(provider)

  return timed(ctx, async (elapsed) => {
    const transfer = findTransferInTx(log.transaction?.logs ?? [], {
      from: accountId,
      to: poolAddress,
      amount,
    })
    if (!transfer) return

    await saveTransfer(ctx, transfer, {
      type: TransferType.DEPOSIT,
      portalPoolId: poolAddress,
    })

    ctx.log.info(`classified portal_pool(${poolAddress}) deposit (${elapsed()}ms)`)
  })
})

export const handlePortalPoolWithdrawn = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.Withdrawn.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = item.address
  const { provider, amount } = PortalPoolImplementation.events.Withdrawn.decode(log)

  const accountId = createAccountId(provider)

  return timed(ctx, async (elapsed) => {
    const transfer = findTransferInTx(log.transaction?.logs ?? [], {
      to: accountId,
      amount,
    })
    if (!transfer) return

    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      portalPoolId: poolAddress,
    })

    ctx.log.info(`classified portal_pool(${poolAddress}) withdrawal (${elapsed()}ms)`)
  })
})

export const handlePortalPoolExitClaimed = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!PortalPoolImplementation.events.ExitClaimed.is(item.value)) return
  if (!ctx.templates.has(PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const log = item.value
  const poolAddress = item.address
  const { provider, amount } = PortalPoolImplementation.events.ExitClaimed.decode(log)

  const accountId = createAccountId(provider)

  return timed(ctx, async (elapsed) => {
    const transfer = findTransferInTx(log.transaction?.logs ?? [], {
      to: accountId,
      amount,
    })
    if (!transfer) return

    await saveTransfer(ctx, transfer, {
      type: TransferType.WITHDRAW,
      portalPoolId: poolAddress,
    })

    ctx.log.info(`classified portal_pool(${poolAddress}) exit claimed (${elapsed()}ms)`)
  })
})
