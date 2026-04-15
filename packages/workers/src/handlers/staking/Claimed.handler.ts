import {
  type LogItem,
  isLog,
  createHandlerOld,
  timed,
  createAccountId,
  createDelegationId,
  createWorkerId,
  toHumanSQD,
  STAKING_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as Staking from '@subsquid-network/shared/lib/abi/Staking'

import { Delegation } from '~/model'

export const handleClaimed = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && Staking.events.Claimed.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(STAKING_TEMPLATE_KEY, log.address, log.block.height)) return

    const { staker: stakerAccount, workerIds: workerIndexes } = Staking.events.Claimed.decode(log)

    const accountId = createAccountId(stakerAccount)

    const workerIds = workerIndexes.map((i) => createWorkerId(i))
    const delegationIds = workerIds.map((workerId) => createDelegationId(workerId, accountId))
    const delegationsDeferred = delegationIds.map((id) =>
      ctx.store.defer(Delegation, id),
    )

    return timed(ctx, async (elapsed) => {
      const delegations = await Promise.all(delegationsDeferred.map((d) => d.get())).then((ds) =>
        ds.filter((d): d is Delegation => d != null),
      )

      for (const delegation of delegations) {
        const amount = delegation.claimableReward
        if (amount === 0n) continue

        delegation.claimableReward = 0n
        delegation.claimedReward += amount

        ctx.log.info(
          `operator(${accountId}) claimed ${toHumanSQD(amount)} from delegation(${delegation.id})`,
        )
      }

      ctx.log.info(`staking claims processed for operator(${accountId}) (${elapsed()}ms)`)
    })
  },
})
