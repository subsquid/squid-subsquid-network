import { BigDecimal } from '@subsquid/big-decimal'
import { In, MoreThanOrEqual } from 'typeorm'

import { Events, MappingContext } from '../types'

import { WorkerUnlockTask } from './worker/WorkerUnlock.queue'

import * as SoftCap from '~/abi/SoftCap'
import { Multicall } from '~/abi/multicall'
import { network } from '~/config/network'
import { BlockHeader } from '~/config/processor'
import { client } from '~/config/rpc-client'
import { Queue, Settings, Worker, WorkerReward, WorkerStatus } from '~/model'
import { DAY_MS } from '~/utils/time'

export const WORKER_CAP_QUEUE = 'worker-cap'

export type WorkerCapTask = {
  id: string
}

let INIT_CAPS = false

export async function ensureWorkerCapQueue(ctx: MappingContext, block: BlockHeader) {
  const queue = await ctx.store.getOrInsert(
    Queue<WorkerCapTask>,
    WORKER_CAP_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(Worker, task.id)
  }

  if (!INIT_CAPS && ctx.isHead) {
    await updateWorkersCap(ctx, block, true)

    INIT_CAPS = true
  }
}

export async function addToWorkerCapQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<WorkerCapTask>, WORKER_CAP_QUEUE)

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks.push({ id })

  await ctx.store.upsert(queue)
}

export async function updateWorkersCap(ctx: MappingContext, block: BlockHeader, all = false) {
  if (block.height < network.contracts.SoftCap.range.from) return

  const queue = await ctx.store.getOrFail(Queue<WorkerUnlockTask>, WORKER_CAP_QUEUE)

  const multicall = new Multicall(
    { _chain: { client } },
    block,
    network.contracts.Multicall3.address,
  )

  const workers = await ctx.store.find(Worker, {
    where: all ? {} : { id: In([...queue.tasks.map((t) => t.id)]) },
  })

  if (workers.length > 0) {
    const capedDelegations = await multicall.aggregate(
      SoftCap.functions.capedStake,
      network.contracts.SoftCap.address,
      workers.map((w) => ({
        workerId: BigInt(w.id),
      })),
      100,
    )

    workers.forEach((w, i) => {
      const capedDelegation = capedDelegations[i]
      w.capedDelegation = capedDelegation
    })
    await ctx.store.upsert(workers)

    await recalculateWorkerAprs(ctx)
  }

  queue.tasks = []
  await ctx.store.upsert(queue)
}

// export function scheduleUpdateWorkerAprs(ctx: MappingContext) {

//   ctx.events.on(Events.Finalization, async (block) => {
//     if (!ctx.recalculateAprs) return;
//     await recalculateWorkerAprs(ctx);
//   });
// }

export async function recalculateWorkerAprs(ctx: MappingContext) {
  const settings = await ctx.store.getOrFail(Settings, network.name)

  const workers = await ctx.store.find(Worker, {
    where: { status: WorkerStatus.ACTIVE },
  })

  const baseApr = BigDecimal(settings.baseApr)
  const utilizedStake = workers.reduce(
    (r, w) => (w.liveness ? r + w.bond + w.capedDelegation : r),
    0n,
  )

  // settings.baseApr = baseApr.toNumber()
  settings.utilizedStake = utilizedStake

  const ninetyDaysAgo = new Date(Date.now() - 90 * DAY_MS)

  for (const worker of workers) {
    const supplyRatio =
      utilizedStake === 0n
        ? BigDecimal(0)
        : BigDecimal(worker.capedDelegation).add(worker.bond).div(utilizedStake)

    const dTraffic = supplyRatio.eq(0)
      ? 0
      : Math.min(
          BigDecimal(worker.trafficWeight || 0)
            .div(supplyRatio)
            .toNumber() ** 0.1,
          1,
        )

    const actualYield = baseApr
      .mul(worker.liveness || 0)
      .mul(dTraffic)
      .mul(worker.dTenure || 0)

    const workerReward = actualYield.mul(worker.bond + worker.capedDelegation / 2n)
    const currentApr = workerReward.div(worker.bond).mul(100).toNumber()

    const stakerReward = actualYield.mul(worker.capedDelegation / 2n)
    const currentStakerApr = worker.totalDelegation
      ? stakerReward.div(worker.totalDelegation).mul(100).toNumber()
      : currentApr / 2

    // Query last 90 days of WorkerReward records for this worker
    const workerHistoricalRewards = await ctx.store.find(WorkerReward, {
      where: {
        worker: { id: worker.id },
        timestamp: MoreThanOrEqual(ninetyDaysAgo),
      },
    })

    const historicalAprs = workerHistoricalRewards.map((r) => r.apr)
    const historicalStakerAprs = workerHistoricalRewards.map((r) => r.stakerApr)

    // Average of 90 days values + 1 current
    const allAprs = [...historicalAprs, currentApr]
    const allStakerAprs = [...historicalStakerAprs, currentStakerApr]

    worker.apr = allAprs.reduce((sum, apr) => sum + apr, 0) / allAprs.length
    worker.stakerApr = allStakerAprs.reduce((sum, apr) => sum + apr, 0) / allStakerAprs.length
  }

  await ctx.store.upsert(workers)
  await ctx.store.upsert(settings)
}
