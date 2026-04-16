import {
  type LogItem,
  createAccountId,
  createHandlerOld,
  createWorkerId,
  isContract,
  isLog,
  network,
  timed,
  toHumanSQD,
} from '@sqd/shared'
import * as RewardsDistribution from '@sqd/shared/lib/abi/DistributedRewardsDistribution'

import { Worker } from '~/model'

export const handleRewardsClaimed = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.RewardsDistribution) &&
      isLog(item) &&
      RewardsDistribution.events.Claimed.is(item.value)
    )
  },
  handle(ctx, { value: log }) {
    const {
      worker: workerIndex,
      by: stakerAccount,
      amount,
    } = RewardsDistribution.events.Claimed.decode(log)

    const accountId = createAccountId(stakerAccount)
    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, workerId)

    return timed(ctx, async (elapsed) => {
      const worker = await workerDeferred.getOrFail()

      if (worker.ownerId !== accountId) {
        ctx.log.warn(
          `rewards claim for worker(${worker.id}): claimer ${accountId} != owner ${worker.ownerId}`,
        )
      }

      worker.claimableReward = 0n
      worker.claimedReward += amount

      ctx.log.info(
        `operator(${accountId}) claimed ${toHumanSQD(amount)} from worker(${worker.id}) (${elapsed()}ms)`,
      )
    })
  },
})
