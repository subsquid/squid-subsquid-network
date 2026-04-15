import assert from 'assert'
import type { MappingContext } from '@subsquid-network/shared'
import { GatewayStake, Queue } from '~/model'

export const STAKE_APPLY_QUEUE = 'stake-apply'

export type StakeApplyTask = {
  id: string
}

export async function ensureGatewayStakeApplyQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrCreate(
    Queue<StakeApplyTask>,
    STAKE_APPLY_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(GatewayStake, task.id)
  }
}

export async function addToGatewayStakeApplyQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(Queue<StakeApplyTask>, STAKE_APPLY_QUEUE)

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks = [...queue.tasks, { id }]
}

export async function processGatewayStakeApplyQueue(
  ctx: MappingContext,
  block: { l1BlockNumber: number },
) {
  const queue = await ctx.store.getOrFail(Queue<StakeApplyTask>, STAKE_APPLY_QUEUE)
  if (queue.tasks.length === 0) return

  const start = performance.now()
  const total = queue.tasks.length
  let processed = 0

  const tasks: StakeApplyTask[] = []
  for (const task of queue.tasks) {
    const stake = await ctx.store.getOrFail(GatewayStake, task.id)
    if (stake.lockStart && stake.lockStart > block.l1BlockNumber) {
      tasks.push(task)
      continue
    }

    assert(
      stake.computationUnitsPending != null,
      `pending computation units is equal to ${stake.computationUnitsPending}`,
    )

    stake.computationUnits = stake.computationUnitsPending
    stake.computationUnitsPending = null
    processed++

    ctx.log.info(`stake(${stake.id}) applied`)
  }

  queue.tasks = tasks

  if (processed > 0) {
    ctx.log.info(`stake-apply queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`)
  }
}
