import assert from 'assert'

import { BigDecimal } from '@subsquid/big-decimal'
import { In, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm'

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
} from '~/model'
import { toPercent } from '~/utils/misc'
import { YEAR_MS } from '~/utils/time'

export const rewardsDistributedHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.RewardsDistribution)) return
  if (!isLog(item)) return
  if (!RewardsDistribution.events.Distributed.is(item.value)) return

  const log = item.value
  const event = RewardsDistribution.events.Distributed.decode(log)

  const recipientIds = event.recipients.map((r) => createWorkerId(r))

  return async () => {
    if (recipientIds.length === 0) {
      ctx.log.info(`nothing to reward`)
      return
    }

    // since certain block distribution intervals became to overlap,
    // but it is not reflected in the event interval due to contract limitation
    const normalizedFromBlockNumber =
      (network.name === 'arbitrum' && log.block.height >= 250398109) ||
      (network.name === 'arbitrum-sepolia' && log.block.height >= 77573325)
        ? event.toBlock + 1n - (event.toBlock - event.fromBlock + 1n) * 2n
        : event.fromBlock

    let fromBlock = await ctx.store.findOne(Block, {
      where: { l1BlockNumber: LessThanOrEqual(Number(normalizedFromBlockNumber)) },
      order: { height: 'DESC' },
    })
    if (!fromBlock) {
      fromBlock = await ctx.store.findOne(Block, { where: {}, order: { height: 'ASC' } })
      assert(fromBlock)
    }

    let toBlock = await ctx.store.findOne(Block, {
      where: { l1BlockNumber: LessThanOrEqual(Number(event.toBlock)) },
      order: { height: 'DESC' },
    })
    if (!toBlock) {
      toBlock = fromBlock
    }

    const activeWorkers = await ctx.store.find(Worker, {
      where: [
        { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
        { id: In(recipientIds) },
      ],
    })

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

    let delegationRewardsCount = 0
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

      worker.claimableReward += payout.workerReward
      worker.totalDelegationRewards += payout.stakerReward
      await ctx.store.upsert(worker)

      if (payout.workerReward > 0) {
        const reward = new WorkerReward({
          id: `${log.id}-${worker.id.padStart(5, '0')}`,
          blockNumber: log.block.height,
          timestamp: new Date(log.block.timestamp),
          worker,
          amount: payout.workerReward,
          stakersReward: payout.stakerReward,
        })

        await ctx.store.insert(reward)
      }

      if (payout.stakerReward > 0) {
        const rewardsPerShare = worker.totalDelegation
          ? (payout.stakerReward * 10n ** 18n) / worker.totalDelegation
          : 0n

        const count = await distributeReward(ctx, log, {
          workerId: worker.id,
          rewardsPerShare,
          offset: delegationRewardsCount,
        })
        delegationRewardsCount += count
      }

      await ctx.store.insert(
        new Commitment({
          id: createCommitmentId(event.fromBlock, event.toBlock),
          from: fromBlock?.timestamp,
          fromBlock: Number(normalizedFromBlockNumber),
          to: toBlock?.timestamp,
          toBlock: Number(event.toBlock),
          recipients: Object.values(payouts).map((p) => new CommitmentRecipient(p)),
        }),
      )

      ctx.log.info(
        `rewarded ${recipientIds.length} workers and ${delegationRewardsCount} delegations`,
      )
    }
  }
})

async function distributeReward(
  ctx: MappingContext,
  log: Log,
  {
    workerId,
    rewardsPerShare,
    offset,
  }: {
    workerId: string
    rewardsPerShare: bigint
    offset: number
  },
) {
  const delegations = await ctx.store.find(Delegation, {
    where: { worker: { id: workerId }, deposit: MoreThan(0n) },
    relations: { owner: true },
  })
  if (delegations.length === 0) {
    ctx.log.warn(`missing delegation for worker(${workerId})`)
  }

  for (let i = 0; i < delegations.length; i++) {
    const delegation = delegations[i]

    const amount = (delegation.deposit * rewardsPerShare) / 10n ** 18n
    delegation.claimableReward += amount

    await ctx.store.upsert(delegation)

    if (delegation.claimableReward === amount) {
      const owner = delegation.owner
      owner.claimableDelegationCount += 1
      await ctx.store.upsert(owner)
    }

    const reward = new DelegationReward({
      id: `${log.id}-${String(offset + i).padStart(5, '0')}`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      delegation,
      amount,
    })

    await ctx.store.insert(reward)
  }

  return delegations.length
}
