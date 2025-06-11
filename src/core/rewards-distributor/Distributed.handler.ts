import assert from 'assert'

import { BigDecimal } from '@subsquid/big-decimal'
import { In, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm'

import { isContract, isLog } from '../../item'
import { MappingContext } from '../../types'
import { createHandler } from '../base'
import { createCommitmentId, createWorkerId } from '../helpers/ids'

import * as RewardsDistribution from '~/abi/DistributedRewardsDistribution'
import { network } from '~/config/network'
import { Log } from '~/config/processor'
import {
  Worker,
  Block,
  Delegation,
  DelegationReward,
  WorkerReward,
  WorkerStatus,
  Commitment,
  CommitmentRecipient,
  DelegationStatus,
} from '~/model'
import { stopwatch, toPercent } from '~/utils/misc'
import { YEAR_MS } from '~/utils/time'

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

    // if (recipientIds.length === 0) {
    //   ctx.log.info(`nothing to reward`)
    //   return
    // }

    // since certain block distribution intervals became to overlap,
    // but it is not reflected in the event interval due to contract limitation
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
        const rewardsPerShare = worker.totalDelegation
          ? (payout.stakerReward * 10n ** 18n) / worker.totalDelegation
          : 0n

        const dr = await distributeReward(ctx, log, {
          workerId: worker.id,
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

    await ctx.store.insert(rewards)

    await ctx.store.upsert(activeWorkers)
    await ctx.store.upsert(delegations)

    await ctx.store.insert(
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

async function distributeReward(
  ctx: MappingContext,
  log: Log,
  {
    workerId,
    rewardsPerShare,
    apr,
  }: {
    workerId: string
    rewardsPerShare: bigint
    apr: number
  },
) {
  const delegations = await ctx.store.find(Delegation, {
    where: { worker: { id: workerId }, status: Not(DelegationStatus.WITHDRAWN) },
    relations: { owner: true },
  })
  if (delegations.length === 0) {
    ctx.log.warn(`missing delegation for worker(${workerId})`)
  }

  const rewards: DelegationReward[] = []

  for (let i = 0; i < delegations.length; i++) {
    const delegation = delegations[i]

    const amount = (delegation.deposit * rewardsPerShare) / 10n ** 18n
    delegation.claimableReward += amount

    if (delegation.claimableReward === amount) {
      const owner = delegation.owner
      owner.claimableDelegationCount += 1
      await ctx.store.upsert(owner)
    }

    const reward = new DelegationReward({
      id: `${log.id}-${workerId.padStart(5, '0')}-${i.toString().padStart(5, '0')}`,
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
