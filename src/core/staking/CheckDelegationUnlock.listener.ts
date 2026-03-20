import assert from 'assert'

import { MappingContext } from '../../types'

import { Delegation, Queue } from '~/model'

export const DELEGATION_UNLOCK_QUEUE = 'delegation-unlock'

export type DelegationUnlockTask = {
  id: string
}

export async function ensureDelegationUnlockQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrInsert(
    Queue<DelegationUnlockTask>,
    DELEGATION_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(Delegation, task.id)
  }
}

export async function addToDelegationUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<DelegationUnlockTask>, DELEGATION_UNLOCK_QUEUE)

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks.push({ id })

  await ctx.store.upsert(queue)
}

export async function processDelegationUnlockQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number },
) {
  const queue = await ctx.store.getOrFail(Queue<DelegationUnlockTask>, DELEGATION_UNLOCK_QUEUE)
  if (queue.tasks.length === 0) return

  const start = performance.now()
  const total = queue.tasks.length
  let processed = 0

  const tasks: DelegationUnlockTask[] = []
  for (const task of queue.tasks) {
    const delegation = await ctx.store.getOrFail(Delegation, task.id)
    assert(delegation.lockEnd)
    if (delegation.lockEnd > block.l1BlockNumber) {
      tasks.push(task)
      continue
    }

    delegation.locked = false
    await ctx.store.upsert(delegation)
    processed++

    ctx.log.info(`delegation(${delegation.id}) unlocked`)
  }

  queue.tasks = tasks
  await ctx.store.upsert(queue)

  if (processed > 0) {
    ctx.log.info(`delegation-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`)
  }
}
