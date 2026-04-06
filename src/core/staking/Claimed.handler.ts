import { LogItem, isLog } from '../../item'
import { createHandlerOld, timed } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId, createDelegationId, createWorkerId } from '../helpers/ids'

import * as Staking from '~/abi/Staking'
import { STAKING_TEMPLATE_KEY } from '~/config/queries/staking'
import { Account, Delegation } from '~/model'
import { toHumanSQD } from '~/utils/misc'

export const handleClaimed = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && Staking.events.Claimed.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(STAKING_TEMPLATE_KEY, log.address, log.block.height)) return

    const { staker: stakerAccount, workerIds: workerIndexes } = Staking.events.Claimed.decode(log)

    const accountId = createAccountId(stakerAccount)
    const accountDeferred = ctx.store.defer(Account, accountId)

    const workerIds = workerIndexes.map((i) => createWorkerId(i))
    const delegationIds = workerIds.map((workerId) => createDelegationId(workerId, accountId))
    const delegationsDeferred = delegationIds.map((id) =>
      ctx.store.defer(Delegation, {
        id,
        relations: {
          owner: { owner: true },
        },
      }),
    )

    return timed(ctx, async (elapsed) => {
      const account = await ctx.store.getOrCreate(Account, accountId, (id) => createAccount(id))

      let delegations: Delegation[]
      if (account.claimableDelegationCount > delegationsDeferred.length || ctx.isHead) {
        delegations = await ctx.store.find(Delegation, {
          where: {
            owner: account,
          },
          relations: {
            owner: true,
          },
        })
      } else {
        delegations = await Promise.all(delegationsDeferred.map((d) => d.get())).then((ds) =>
          ds.filter((d): d is Delegation => d != null),
        )
      }

      for (let i = 0; i < delegations.length; i++) {
        const delegation = delegations[i]

        const amount = delegation.claimableReward
        if (amount === 0n) continue

        delegation.claimableReward = 0n
        delegation.claimedReward += amount

        ctx.log.info(
          `account(${delegation.owner.id}) claimed ${toHumanSQD(amount)} from delegation(${delegation.id})`,
        )
      }

      account.claimableDelegationCount = 0

      ctx.log.info(`staking claims processed for account(${account.id}) (${elapsed()}ms)`)
    })
  },
})
