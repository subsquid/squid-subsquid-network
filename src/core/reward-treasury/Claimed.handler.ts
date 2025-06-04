import { createHandler } from '../base'
import * as RewardsTreasury from '~/abi/RewardTreasury'
import { createAccountId } from '../helpers/ids'
import { Account, Settings, TransferType } from '~/model'
import { network } from '~/config/network'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'
import { isLog } from '../../item'

export const handleClaimed = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!RewardsTreasury.events.Claimed.is(item.value)) return

  const log = item.value
  const { receiver } = RewardsTreasury.events.Claimed.decode(log)

  const accountId = createAccountId(receiver)
  const accountDeferred = ctx.store.defer(Account, accountId)

  const settingsDeferred = ctx.store.defer(Settings, network.name)

  return async () => {
    const settings = await settingsDeferred.getOrFail()
    if (settings.contracts.rewardTreasury !== log.address) return

    const account = await accountDeferred.getOrFail()

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: settings.contracts.rewardTreasury,
      to: account.id,
    })
    if (!transfer) {
      throw new Error(`transfer not found for account(${account.id})`)
    }
    await saveTransfer(ctx, transfer, {
      type: TransferType.CLAIM,
    })
  }
})
