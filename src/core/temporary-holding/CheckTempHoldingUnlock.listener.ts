import assert from 'assert'

import { MappingContext } from '../../types'

import { Queue, TemporaryHoldingData } from '~/model'

export const TEMPORARY_HOLDING_UNLOCK_QUEUE = 'temporary-holding-unlock'

export type TemporaryHoldingUnlockTask = {
  id: string
}

export async function ensureTemporaryHoldingUnlockQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrCreate(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(TemporaryHoldingData, { id: task.id, relations: { account: true, admin: true } })
  }
}

export async function addToTemporaryHoldingUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
  )

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks = [...queue.tasks, { id }]

}

export async function processTemporaryHoldingUnlockQueue(
  ctx: MappingContext,
  block: { timestamp: number },
) {
  const queue = await ctx.store.getOrFail(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
  )
  if (queue.tasks.length === 0) return

  const start = performance.now()
  const total = queue.tasks.length
  let processed = 0

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

    temporaryHolding.account.owner = temporaryHolding.admin
    processed++

    ctx.log.info(`temporary_holding(${temporaryHolding.id}) unlocked`)
  }

  queue.tasks = tasks

  if (processed > 0) {
    ctx.log.info(`temporary-holding-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`)
  }
}
