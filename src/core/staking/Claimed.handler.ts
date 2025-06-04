import { isLog, LogItem } from '../../item'
import { createHandlerOld } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId, createDelegationId, createWorkerId } from '../helpers/ids'

import * as Staking from '~/abi/Staking'
import { network } from '~/config/network'
import { Account, Delegation, Settings, TransferType } from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleClaimed = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && Staking.events.Claimed.is(item.value)
  },
  handle(ctx, { value: log }) {
    const { staker: stakerAccount, workerIds: workerIndexes } = Staking.events.Claimed.decode(log)

    const accountId = createAccountId(stakerAccount)
    const accountDeferred = ctx.store.defer(Account, accountId)

    const workerIds = workerIndexes.map((i) => createWorkerId(i))
    const delegationIds = workerIds.map((workerId) => createDelegationId(workerId, accountId))
    const delegationsDeferred = delegationIds.map((id) =>
      ctx.store.defer(Delegation, {
        id,
        relations: {
          owner: true,
          realOwner: true,
        },
      }),
    )

    const settingsDeferred = ctx.store.defer(Settings, network.name)

    return async () => {
      const settings = await settingsDeferred.getOrFail()
      if (settings.contracts.staking !== log.address) return

      const account = await accountDeferred.getOrInsert((id) => createAccount(id))

      let delegations: Delegation[]
      if (account.claimableDelegationCount > delegationsDeferred.length || ctx.isHead) {
        delegations = await ctx.store.find(Delegation, {
          where: {
            owner: account,
          },
          relations: {
            realOwner: true,
          },
        })
      } else {
        delegations = await Promise.all(delegationsDeferred.map((d) => d.getOrFail()))
      }

      for (let i = 0; i < delegations.length; i++) {
        const delegation = delegations[i]

        const amount = delegation.claimableReward
        if (amount === 0n) continue

        delegation.claimableReward = 0n
        delegation.claimedReward += amount

        await ctx.store.upsert(delegation)

        const claimer = delegation.realOwner

        ctx.log.info(
          `account(${claimer.id}) claimed ${toHumanSQD(amount)} from delegation(${delegation.id})`,
        )
      }

      account.claimableDelegationCount = 0
      await ctx.store.upsert(account)
    }
  },
})
