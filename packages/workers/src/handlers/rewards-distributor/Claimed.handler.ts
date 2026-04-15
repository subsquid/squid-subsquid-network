import assert from 'assert'

import {
  type LogItem,
  isContract,
  isLog,
  createHandlerOld,
  timed,
  createAccountId,
  createWorkerId,
  toHumanSQD,
  network,
} from '@subsquid-network/shared'
import * as RewardsDistribution from '@subsquid-network/shared/lib/abi/DistributedRewardsDistribution'

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
      assert(worker.owner === accountId)

      worker.claimableReward = 0n
      worker.claimedReward += amount

      ctx.log.info(
        `operator(${accountId}) claimed ${toHumanSQD(amount)} from worker(${worker.id}) (${elapsed()}ms)`,
      )
    })
  },
})
