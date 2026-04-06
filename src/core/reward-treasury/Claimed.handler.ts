import * as RewardsTreasury from '~/abi/RewardTreasury'
import { REWARD_TREASURY_TEMPLATE_KEY } from '~/config/queries/rewardTreasury'
import { Account, TransferType } from '~/model'
import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createAccountId } from '../helpers/ids'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleClaimed = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!RewardsTreasury.events.Claimed.is(item.value)) return
  if (!ctx.templates.has(REWARD_TREASURY_TEMPLATE_KEY, item.address, item.value.block.height))
    return

  const log = item.value
  const { receiver } = RewardsTreasury.events.Claimed.decode(log)

  const accountId = createAccountId(receiver)
  const accountDeferred = ctx.store.defer(Account, accountId)

  return timed(ctx, async (elapsed) => {
    const account = await accountDeferred.getOrFail()

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: log.address,
      to: account.id,
      logIndex: log.logIndex - 1,
    })
    if (!transfer) {
      throw new Error(`transfer not found for account(${account.id})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.CLAIM,
    })

    ctx.log.info(`account(${account.id}) claimed from reward treasury (${elapsed()}ms)`)
  })
})
