import assert from 'assert'

import { MappingContext } from '../../types'
import { resetWorkerStats } from '../helpers/entities'

import { WorkerStatusChange, WorkerStatus, Worker, Queue } from '~/model'

export const WORKER_STATUS_APPLY_QUEUE = 'worker-status-apply'

export type WorkerStatusApplyTask = {
  id: string
}

export async function ensureWorkerStatusApplyQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrInsert(
    Queue<WorkerStatusApplyTask>,
    WORKER_STATUS_APPLY_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(WorkerStatusChange, {
      id: task.id,
      relations: { worker: true },
    })
  }
}

export async function addToWorkerStatusApplyQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<WorkerStatusApplyTask>, WORKER_STATUS_APPLY_QUEUE)

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks.push({ id })

  await ctx.store.upsert(queue)

  ctx.store.defer(WorkerStatusChange, {
    id,
    relations: { worker: true },
  })
}

export async function removeFromWorkerStatusApplyQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<WorkerStatusApplyTask>, WORKER_STATUS_APPLY_QUEUE)

  queue.tasks = queue.tasks.filter((task) => task.id !== id)

  await ctx.store.upsert(queue)
}

export async function processWorkerStatusApplyQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number; timestamp: number },
) {
  const queue = await ctx.store.getOrFail(Queue<WorkerStatusApplyTask>, WORKER_STATUS_APPLY_QUEUE)

  const tasks: WorkerStatusApplyTask[] = []
  for (const task of queue.tasks) {
    const statusChange = await ctx.store.getOrFail(WorkerStatusChange, {
      id: task.id,
      relations: { worker: true },
    })
    assert(statusChange.pending, `status ${statusChange.id} is not pending`)
    if (statusChange.blockNumber > block.l1BlockNumber) {
      tasks.push(task)
      continue
    }

    statusChange.pending = false
    if (
      statusChange.blockNumber >= block.l1BlockNumber &&
      statusChange.blockNumber < block.l1BlockNumber + 10
    ) {
      statusChange.timestamp = new Date(block.timestamp)
    }
    await ctx.store.upsert(statusChange)

    const worker = statusChange.worker
    worker.status = statusChange.status

    if (worker.status === WorkerStatus.DEREGISTERED) {
      resetWorkerStats(worker)
    }

    ctx.log.info(`status of worker(${worker.id}) changed to ${worker.status}`)

    await ctx.store.upsert(worker)
  }

  queue.tasks = tasks
  await ctx.store.upsert(queue)
}
