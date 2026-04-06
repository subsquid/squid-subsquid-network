import assert from 'assert'

import { MappingContext } from '../../types'
import { resetWorkerStats } from '../helpers/entities'

import { Queue, Worker, WorkerStatus, WorkerStatusChange } from '~/model'

export const WORKER_STATUS_APPLY_QUEUE = 'worker-status-apply'

export type WorkerStatusApplyTask = {
  id: string
}

export async function ensureWorkerStatusApplyQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrCreate(
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
  queue.tasks = [...queue.tasks, { id }]
}

export async function removeFromWorkerStatusApplyQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<WorkerStatusApplyTask>, WORKER_STATUS_APPLY_QUEUE)

  queue.tasks = queue.tasks.filter((task) => task.id !== id)
}

export async function processWorkerStatusApplyQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number; timestamp: number },
) {
  const queue = await ctx.store.getOrFail(Queue<WorkerStatusApplyTask>, WORKER_STATUS_APPLY_QUEUE)
  if (queue.tasks.length === 0) return

  const start = performance.now()
  const total = queue.tasks.length
  let processed = 0

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

    const worker = statusChange.worker
    worker.status = statusChange.status

    if (worker.status === WorkerStatus.DEREGISTERED) {
      resetWorkerStats(worker)
    }

    ctx.log.info(`status of worker(${worker.id}) changed to ${worker.status}`)

    processed++
  }

  queue.tasks = tasks

  if (processed > 0) {
    ctx.log.info(
      `worker-status-apply queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`,
    )
  }
}
