import assert from 'assert'
import type { MappingContext } from '@sqd/shared'
import { Queue, Worker } from '~/model'

export const WORKER_UNLOCK_QUEUE = 'worker-unlock'

export type WorkerUnlockTask = {
  id: string
}

export async function ensureWorkerUnlock(ctx: MappingContext) {
  const queue = await ctx.store.getOrCreate(
    Queue<WorkerUnlockTask>,
    WORKER_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(Worker, task.id)
  }
}

export async function addToWorkerUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<WorkerUnlockTask>, WORKER_UNLOCK_QUEUE)

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks = [...queue.tasks, { id }]
}

export async function processWorkerUnlockQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number },
) {
  const queue = await ctx.store.getOrFail(Queue<WorkerUnlockTask>, WORKER_UNLOCK_QUEUE)
  if (queue.tasks.length === 0) return

  const start = performance.now()
  const total = queue.tasks.length
  let processed = 0

  const tasks: WorkerUnlockTask[] = []
  for (const task of queue.tasks) {
    const worker = await ctx.store.getOrFail(Worker, task.id)
    assert(worker.locked && worker.lockEnd, `worker(${worker.id}) is not locked`)
    if (worker.lockEnd > block.l1BlockNumber) {
      tasks.push(task)
      continue
    }

    worker.locked = false
    processed++

    ctx.log.info(`worker(${worker.id}) unlocked`)
  }

  queue.tasks = tasks

  if (processed > 0) {
    ctx.log.info(
      `worker-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`,
    )
  }
}
