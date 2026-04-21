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

type Payout = {
  workerId: string
  workerReward: bigint
  workerApr: number
  stakerReward: bigint
  stakerApr: number
}

const SHARE_SCALE = 10n ** 18n

export const rewardsDistributedHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.RewardsDistribution)) return
  if (!isLog(item)) return
  if (!RewardsDistribution.events.Distributed.is(item.value)) return

  const log = item.value
  const event = RewardsDistribution.events.Distributed.decode(log)

  // Build payouts and the subset with non-zero staker reward from event data directly,
  // so the delegation lookup can be issued without waiting for worker resolution.
  const recipientIds: string[] = new Array(event.recipients.length)
  const payouts = new Map<string, Payout>()
  const workerIdsWithStakerReward: string[] = []
  for (let i = 0; i < event.recipients.length; i++) {
    const workerId = createWorkerId(event.recipients[i])
    const stakerReward = event.stakerRewards[i]
    recipientIds[i] = workerId
    payouts.set(workerId, {
      workerId,
      workerReward: event.workerRewards[i],
      workerApr: 0,
      stakerReward,
      stakerApr: 0,
    })
    if (stakerReward > 0n) workerIdsWithStakerReward.push(workerId)
  }

  const deferredRecipients = recipientIds.map((id) => ctx.store.defer(Worker, id))

  return async () => {
    const sw = stopwatch()

    const normalizedInterval = getNormalizedInteval({
      fromBlock: Number(event.fromBlock),
      toBlock: Number(event.toBlock),
    })

    // All four reads are independent — issue them concurrently so the store/driver can
    // pipeline, rather than paying four sequential round-trips.
    const [resolvedWorkers, fromBlockCandidate, toBlockCandidate, allDelegations] =
      await Promise.all([
        Promise.all(deferredRecipients.map((w) => w.get())),
        ctx.store.findOne(Block, {
          where: { l1BlockNumber: LessThanOrEqual(normalizedInterval.fromBlock) },
          order: { height: 'DESC' },
        }),
        ctx.store.findOne(Block, {
          where: { l1BlockNumber: LessThanOrEqual(normalizedInterval.toBlock) },
          order: { height: 'DESC' },
        }),
        workerIdsWithStakerReward.length > 0
          ? ctx.store.find(Delegation, {
              where: {
                worker: { id: In(workerIdsWithStakerReward) },
                status: Not(DelegationStatus.WITHDRAWN),
              },
              relations: { worker: true },
            })
          : Promise.resolve<Delegation[]>([]),
      ])

    let fromBlock = fromBlockCandidate
    if (!fromBlock) {
      // Cold-start fallback: the reward period predates any Block we have indexed.
      fromBlock = await ctx.store.findOne(Block, { where: {}, order: { height: 'ASC' } })
      assert(fromBlock)
    }
    const toBlock = toBlockCandidate ?? fromBlock

    const activeWorkers = resolvedWorkers.filter(
      (w): w is Worker => w != null && w.status !== WorkerStatus.WITHDRAWN,
    )

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

    const delegations: Delegation[] = []
    const rewards: (WorkerReward | DelegationReward)[] = []

    const fromTs = fromBlock.timestamp.getTime()
    const toTs = toBlock.timestamp.getTime()
    const eventTs = new Date(log.block.timestamp)
    const eventHeight = log.block.height

    for (const worker of activeWorkers) {
      if (worker.createdAt.getTime() >= toTs) continue

      // Guaranteed to exist: `activeWorkers` is filtered from `recipientIds`,
      // and every recipient id seeded the payouts map above.
      const payout = payouts.get(worker.id)!

      const interval = toTs - Math.max(fromTs, worker.createdAt.getTime())

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

      if (payout.stakerReward > 0n) {
        // NB: on-chain, Staking.distribute() accumulates cumulatedRewardsPerShare across rounds
        // and computes per-staker rewards at checkpoint time. Here we recompute per-share for each
        // distribution independently, which may diverge by up to 1 wei per delegation per round
        // due to integer division ordering. Acceptable for display/indexing purposes.
        const rewardsPerShare = worker.totalDelegation
          ? (payout.stakerReward * SHARE_SCALE) / worker.totalDelegation
          : 0n

        const workerDelegations = delegationsByWorker.get(worker.id) ?? []
        if (workerDelegations.length === 0) {
          ctx.log.warn(`missing delegation for worker(${worker.id})`)
        }

        const paddedWorkerId = worker.id.padStart(5, '0')
        for (let i = 0; i < workerDelegations.length; i++) {
          const delegation = workerDelegations[i]
          const amount = (delegation.deposit * rewardsPerShare) / SHARE_SCALE
          delegation.claimableReward += amount

          rewards.push(
            new DelegationReward({
              id: `${log.id}-${paddedWorkerId}-${i.toString().padStart(5, '0')}`,
              blockNumber: eventHeight,
              timestamp: eventTs,
              delegation,
              amount,
              apr: payout.stakerApr,
            }),
          )
          delegations.push(delegation)
        }
      }

      worker.claimableReward += payout.workerReward
      worker.totalDelegationRewards += payout.stakerReward

      if (payout.workerReward > 0n) {
        rewards.push(
          new WorkerReward({
            id: `${log.id}-${worker.id.padStart(5, '0')}`,
            blockNumber: eventHeight,
            timestamp: eventTs,
            worker,
            amount: payout.workerReward,
            stakersReward: payout.stakerReward,
            apr: payout.workerApr,
            stakerApr: payout.stakerApr,
          }),
        )
      }
    }

    await ctx.store.track(rewards)

    await ctx.store.track(
      new Commitment({
        id: createCommitmentId(event.fromBlock, event.toBlock),
        from: fromBlock.timestamp,
        fromBlock: normalizedInterval.fromBlock,
        to: toBlock.timestamp,
        toBlock: normalizedInterval.toBlock,
        recipients: [...payouts.values()].map((p) => new CommitmentRecipient(p)),
      }),
    )

    ctx.log.info(
      `rewarded ${recipientIds.length} workers and ${delegations.length} delegations (${sw.get()}ms)`,
    )
  }
})

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
