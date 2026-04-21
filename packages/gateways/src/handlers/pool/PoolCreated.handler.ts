import {
  PORTAL_POOL_TEMPLATE_KEY,
  createAccountId,
  createHandler,
  isLog,
  network,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as PortalPoolFactory from '@sqd/shared/lib/abi/PortalPoolFactory'
import * as PortalPoolImplementation from '@sqd/shared/lib/abi/PortalPoolImplementation'

import { PoolEvent, PoolEventType, PortalPool } from '~/model'

export const handlePoolCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.PortalPoolFactory.address) return
  if (!PortalPoolFactory.events.PoolCreated.is(item.value)) return

  const log = item.value
  const event = PortalPoolFactory.events.PoolCreated.decode(log)

  const portalAddress = normalizeAddress(event.portal)
  const operatorId = createAccountId(event.operator)
  const txHash = log.getTransaction().hash

  return timed(ctx, async (elapsed) => {
    const timestamp = new Date(log.block.timestamp)
    const blockNumber = log.block.height

    let initialTopUpAmount = 0n
    let initialTopUpLogIndex: number | null = null

    const currentBlock = ctx.blocks.find((b) =>
      b.logs.some((l) => l.getTransaction().hash === txHash),
    )
    if (currentBlock) {
      for (const blockLog of currentBlock.logs) {
        if (
          blockLog.getTransaction().hash === txHash &&
          blockLog.logIndex < log.logIndex &&
          blockLog.address.toLowerCase() === portalAddress &&
          PortalPoolImplementation.events.RewardsToppedUp.is(blockLog)
        ) {
          const topUpEvent = PortalPoolImplementation.events.RewardsToppedUp.decode(blockLog)
          initialTopUpAmount = topUpEvent.toProviders
          initialTopUpLogIndex = blockLog.logIndex
          break
        }
      }
    }

    const pool = new PortalPool({
      id: portalAddress,
      createdAt: timestamp,
      createdAtBlock: blockNumber,
      operator: operatorId,
      rewardToken: normalizeAddress(event.rewardToken),
      capacity: event.capacity,
      rewardRate: event.distributionRatePerSecond,
      totalRewardsToppedUp: initialTopUpAmount,
      tvlTotal: 0n,
      tvlStable: 0n,
      tokenSuffix: event.tokenSuffix,
      metadata: event.metadata || null,
    })

    await ctx.store.track(pool)

    if (initialTopUpLogIndex != null && initialTopUpAmount > 0n) {
      const topUpEvent = new PoolEvent({
        id: `${txHash}-${initialTopUpLogIndex}`,
        blockNumber,
        timestamp,
        txHash,
        pool,
        eventType: PoolEventType.TOPUP,
        amount: initialTopUpAmount,
      })
      await ctx.store.track(topUpEvent)
    }

    ctx.templates.add(PORTAL_POOL_TEMPLATE_KEY, portalAddress, blockNumber)

    ctx.log.info(
      `created portal_pool(${portalAddress}) by operator(${operatorId}) (${elapsed()}ms)`,
    )
  })
})
