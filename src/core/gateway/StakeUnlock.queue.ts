import assert from 'assert'

import { MappingContext } from '../../types'

import { GatewayStake, Queue } from '~/model'

export const STAKE_UNLOCK_QUEUE = 'stake-unlock'

export type StakeUnlockTask = {
  id: string
}

export async function ensureGatewayStakeUnlockQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrInsert(
    Queue<StakeUnlockTask>,
    STAKE_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(GatewayStake, task.id)
  }
}

export async function addToGatewayStakeUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<StakeUnlockTask>, STAKE_UNLOCK_QUEUE)

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks.push({ id })

  await ctx.store.upsert(queue)
}

export async function removeFromGatewayStakeUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<StakeUnlockTask>, STAKE_UNLOCK_QUEUE)

  queue.tasks = queue.tasks.filter((task) => task.id !== id)

  await ctx.store.upsert(queue)
}

export async function processGatewayStakeUnlockQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number },
) {
  const queue = await ctx.store.getOrFail(Queue<StakeUnlockTask>, STAKE_UNLOCK_QUEUE)
  if (queue.tasks.length === 0) return

  const start = performance.now()
  const total = queue.tasks.length
  let processed = 0

  const tasks: StakeUnlockTask[] = []
  for (const task of queue.tasks) {
    const stake = await ctx.store.getOrFail(GatewayStake, task.id)

    assert(stake.locked, `stake(${stake.id}) already unlocked`)
    if (stake.lockEnd && stake.lockEnd > block.l1BlockNumber) {
      tasks.push(task)
      continue
    }

    stake.locked = false
    await ctx.store.upsert(stake)
    processed++

    ctx.log.info(`stake(${stake.id}) unlocked`)
  }

  queue.tasks = tasks
  await ctx.store.upsert(queue)

  if (processed > 0) {
    ctx.log.info(`stake-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`)
  }
}
