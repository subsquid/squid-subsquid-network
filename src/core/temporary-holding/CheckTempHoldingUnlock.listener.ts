import assert from 'assert'

import { MappingContext } from '../../types'

import { Queue, TemporaryHoldingData } from '~/model'

export const TEMPORARY_HOLDING_UNLOCK_QUEUE = 'temporary-holding-unlock'

export type TemporaryHoldingUnlockTask = {
  id: string
}

export async function ensureTemporaryHoldingUnlockQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrInsert(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(TemporaryHoldingData, task.id)
  }
}

export async function addToTemporaryHoldingUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
  )

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks.push({ id })

  await ctx.store.upsert(queue)
}

export async function processTemporaryHoldingUnlockQueue(
  ctx: MappingContext,
  block: { timestamp: number },
) {
  const queue = await ctx.store.getOrFail(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
  )

  const tasks: TemporaryHoldingUnlockTask[] = []
  for (const task of queue.tasks) {
    const temporaryHolding = await ctx.store.getOrFail(TemporaryHoldingData, {
      id: task.id,
      relations: { account: true, admin: true },
    })
    assert(temporaryHolding.locked, `temporary_holding(${temporaryHolding.id}) is not locked`)
    if (temporaryHolding.unlockedAt.getTime() > block.timestamp) {
      tasks.push(task)
      continue
    }

    temporaryHolding.locked = false
    await ctx.store.upsert(temporaryHolding)

    temporaryHolding.account.owner = temporaryHolding.admin
    await ctx.store.upsert(temporaryHolding.account)

    ctx.log.info(`temporary_holding(${temporaryHolding.id}) unlocked`)
  }

  queue.tasks = tasks
  await ctx.store.upsert(queue)
}
