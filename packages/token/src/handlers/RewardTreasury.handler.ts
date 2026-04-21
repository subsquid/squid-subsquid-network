import {
  REWARD_TREASURY_TEMPLATE_KEY,
  createAccountId,
  createHandler,
  findTransfer,
  isLog,
  network,
  timed,
} from '@sqd/shared'
import * as RewardsTreasury from '@sqd/shared/lib/abi/RewardTreasury'

import { TransferType } from '~/model'
import { saveTransfer } from './Transfer.handler'

export const handleRewardTreasuryClaimed = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!RewardsTreasury.events.Claimed.is(item.value)) return
  if (!ctx.templates.has(REWARD_TREASURY_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const log = item.value
  const { receiver } = RewardsTreasury.events.Claimed.decode(log)

  const accountId = createAccountId(receiver)

  return timed(ctx, async (elapsed) => {
    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: log.address,
      to: accountId,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for reward treasury claim`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.CLAIM,
    })

    ctx.log.info(`classified reward treasury claim for ${accountId} (${elapsed()}ms)`)
  })
})
