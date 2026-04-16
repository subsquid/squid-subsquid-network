import assert from 'assert'

import { BigDecimal } from '@subsquid/big-decimal'
import { In, LessThanOrEqual, Not } from 'typeorm'

import {
  YEAR_MS,
  createCommitmentId,
  createHandler,
  createWorkerId,
  isContract,
  isLog,
  network,
  stopwatch,
  toPercent,
} from '@sqd/shared'
import * as RewardsDistribution from '@sqd/shared/lib/abi/DistributedRewardsDistribution'
import type { Log } from '../../types'

import {
  Block,
  Commitment,
  CommitmentRecipient,
  Delegation,
  DelegationReward,
  DelegationStatus,
  Worker,
  WorkerReward,
  WorkerStatus,
} from '~/model'

export const rewardsDistributedHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.RewardsDistribution)) return
  if (!isLog(item)) return
  if (!RewardsDistribution.events.Distributed.is(item.value)) return

  const log = item.value
  const event = RewardsDistribution.events.Distributed.decode(log)

  const recipientIds = event.recipients.map((r) => createWorkerId(r))
  const deferredRecipients = recipientIds.map((id) => ctx.store.defer(Worker, id))

  return async () => {
    const sw = stopwatch()

    const normalizedInterval = getNormalizedInteval({
      fromBlock: Number(event.fromBlock),
      toBlock: Number(event.toBlock),
    })

    let fromBlock = await ctx.store.findOne(Block, {
      where: { l1BlockNumber: LessThanOrEqual(normalizedInterval.fromBlock) },
      order: { height: 'DESC' },
    })
    if (!fromBlock) {
      fromBlock = await ctx.store.findOne(Block, { where: {}, order: { height: 'ASC' } })
      assert(fromBlock)
    }

    let toBlock = await ctx.store.findOne(Block, {
      where: { l1BlockNumber: LessThanOrEqual(normalizedInterval.toBlock) },
      order: { height: 'DESC' },
    })
    if (!toBlock) {
      toBlock = fromBlock
    }

    const activeWorkers = await Promise.all(deferredRecipients.map((w) => w.get())).then((ws) =>
      ws.filter((w): w is Worker => w != null && w.status !== WorkerStatus.WITHDRAWN),
    )

    const delegations: Delegation[] = []
    const rewards: (WorkerReward | DelegationReward)[] = []

    const payouts = recipientIds
      .map((workerId, i) => ({
        workerId,
        workerReward: event.workerRewards[i],
        workerApr: 0,
        stakerReward: event.stakerRewards[i],
        stakerApr: 0,
      }))
      .reduce(
        (r, p) => r.set(p.workerId, p),
        new Map<
          string,
          {
            workerId: string
            workerReward: bigint
            workerApr: number
            stakerReward: bigint
            stakerApr: number
          }
        >(),
      )

    const workerIdsWithStakerReward = activeWorkers
      .filter((w) => (payouts.get(w.id)?.stakerReward ?? 0n) > 0n)
      .map((w) => w.id)

    const allDelegations =
      workerIdsWithStakerReward.length > 0
        ? await ctx.store.find(Delegation, {
            where: {
              worker: { id: In(workerIdsWithStakerReward) },
              status: Not(DelegationStatus.WITHDRAWN),
            },
            relations: { worker: true },
          })
        : []
    const delegationsByWorker = new Map<string, Delegation[]>()
    for (const d of allDelegations) {
      const wid = d.worker.id
      let arr = delegationsByWorker.get(wid)
      if (!arr) {
        arr = []
        delegationsByWorker.set(wid, arr)
      }
      arr.push(d)
    }

    for (const worker of activeWorkers) {
      if (worker.createdAt.getTime() >= toBlock.timestamp.getTime()) continue

      let payout = payouts.get(worker.id)
      if (!payout) {
        payout = {
          workerId: worker.id,
          workerReward: 0n,
          workerApr: 0,
          stakerReward: 0n,
          stakerApr: 0,
        }
        payouts.set(worker.id, payout)
      }

      const interval =
        toBlock.timestamp.getTime() -
        Math.max(fromBlock.timestamp.getTime(), worker.createdAt.getTime())

      if (interval > 0) {
        payout.workerApr = worker.bond
          ? toPercent(
              BigDecimal(payout.workerReward)
                .div(interval)
                .mul(YEAR_MS)
                .div(worker.bond)
                .toNumber(),
              true,
            )
          : 0
        payout.stakerApr = worker.totalDelegation
          ? toPercent(
              BigDecimal(payout.stakerReward)
                .div(interval)
                .mul(YEAR_MS)
                .div(worker.totalDelegation)
                .toNumber(),
              true,
            )
          : payout.workerApr / 2
      }

      if (payout.stakerReward > 0) {
        // NB: on-chain, Staking.distribute() accumulates cumulatedRewardsPerShare across rounds
        // and computes per-staker rewards at checkpoint time. Here we recompute per-share for each
        // distribution independently, which may diverge by up to 1 wei per delegation per round
        // due to integer division ordering. Acceptable for display/indexing purposes.
        const rewardsPerShare = worker.totalDelegation
          ? (payout.stakerReward * 10n ** 18n) / worker.totalDelegation
          : 0n

        const workerDelegations = delegationsByWorker.get(worker.id) ?? []
        if (workerDelegations.length === 0) {
          ctx.log.warn(`missing delegation for worker(${worker.id})`)
        }

        const dr = distributeReward(log, workerDelegations, {
          rewardsPerShare,
          apr: payout.stakerApr,
        })

        rewards.push(...dr.rewards)
        delegations.push(...dr.delegations)
      }

      worker.claimableReward += payout.workerReward
      worker.totalDelegationRewards += payout.stakerReward

      if (payout.workerReward > 0) {
        const reward = new WorkerReward({
          id: `${log.id}-${worker.id.padStart(5, '0')}`,
          blockNumber: log.block.height,
          timestamp: new Date(log.block.timestamp),
          worker,
          amount: payout.workerReward,
          stakersReward: payout.stakerReward,
          apr: payout.workerApr,
          stakerApr: payout.stakerApr,
        })

        rewards.push(reward)
      }
    }

    await ctx.store.track(rewards)

    await ctx.store.track(
      new Commitment({
        id: createCommitmentId(event.fromBlock, event.toBlock),
        from: fromBlock?.timestamp,
        fromBlock: normalizedInterval.fromBlock,
        to: toBlock?.timestamp,
        toBlock: normalizedInterval.toBlock,
        recipients: [...payouts.values()].map((p) => new CommitmentRecipient(p)),
      }),
    )

    ctx.log.info(
      `rewarded ${recipientIds.length} workers and ${delegations.length} delegations (${sw.get()}ms)`,
    )
  }
})

function distributeReward(
  log: Log,
  delegations: Delegation[],
  {
    rewardsPerShare,
    apr,
  }: {
    rewardsPerShare: bigint
    apr: number
  },
) {
  const rewards: DelegationReward[] = []

  for (let i = 0; i < delegations.length; i++) {
    const delegation = delegations[i]

    const amount = (delegation.deposit * rewardsPerShare) / 10n ** 18n
    delegation.claimableReward += amount

    const reward = new DelegationReward({
      id: `${log.id}-${delegation.worker.id.padStart(5, '0')}-${i.toString().padStart(5, '0')}`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      delegation,
      amount,
      apr,
    })

    rewards.push(reward)
  }

  return { delegations, rewards }
}

/**
 * Expands the on-chain (fromBlock, toBlock) range to the actual L1 block interval
 * the reward period covers. The off-chain reward calculator was changed over time
 * to submit compressed block ranges (covering N epochs in a single commit), while
 * the contract enforces contiguous `fromBlock == lastBlockRewarded + 1`. The
 * multiplier compensates for this compression so the indexer can resolve the correct
 * L1 Block entities and compute accurate time-weighted APR.
 *
 * If the reward calculator changes its epoch-packing strategy again, a new threshold
 * and multiplier must be added here.
 */
function getNormalizedInteval(event: { fromBlock: number; toBlock: number }) {
  let multiplier = 1
  switch (network.name) {
    case 'mainnet': {
      if (event.fromBlock >= 21864988) {
        multiplier = 4
      } else if (event.fromBlock >= 20677588) {
        multiplier = 2
      }
      break
    }
    case 'tethys': {
      if (event.fromBlock >= 7636918) {
        multiplier = 4
      } else if (event.fromBlock >= 6637998) {
        multiplier = 2
      }
      break
    }
  }

  return {
    fromBlock: event.toBlock + 1 - (event.toBlock - event.fromBlock + 1) * multiplier,
    toBlock: event.toBlock,
  }
}
