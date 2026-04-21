import assert from 'assert'

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

      // The rewards-distributor `Claimed` event is only ever emitted for the
      // worker owner (`RewardsDistribution.claim(workerId)` reverts if the
      // caller is not the registrar). A mismatch here means either the worker
      // ownership record is stale (an in-flight `Registered` update was
      // missed) or the event is being routed to the wrong worker. Either way,
      // `claimableReward = 0n` below would zero an unrelated worker's balance
      // and produce silently wrong aggregates, so fail loudly instead.
      assert(
        worker.ownerId === accountId,
        `rewards claim for worker(${worker.id}): claimer ${accountId} != ownerId ${worker.ownerId}`,
      )

      worker.claimableReward = 0n
      worker.claimedReward += amount

      ctx.log.info(
        `operator(${accountId}) claimed ${toHumanSQD(amount)} from worker(${worker.id}) (${elapsed()}ms)`,
      )
    })
  },
})
