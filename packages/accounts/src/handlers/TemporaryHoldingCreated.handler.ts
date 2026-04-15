import {
  createHandler,
  timed,
  isLog,
  network,
  createAccountId,
  type MappingContext,
} from '@subsquid-network/shared'
import * as TemporaryHoldingFactory from '@subsquid-network/shared/lib/abi/TemporaryHoldingFactory'
import { Queue, TemporaryHolding } from '~/model'

export const TEMPORARY_HOLDING_UNLOCK_QUEUE = 'temporary-holding-unlock'

export type TemporaryHoldingUnlockTask = {
  id: string
}

export const handleTemporaryHoldingCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.TemporaryHoldingFactory.address) return
  if (!TemporaryHoldingFactory.events.TemporaryHoldingCreated.is(item.value)) return

  const {
    vesting: holdingAddress,
    beneficiaryAddress,
    admin: adminAddress,
    unlockTimestamp,
  } = TemporaryHoldingFactory.events.TemporaryHoldingCreated.decode(item.value)

  const holdingId = createAccountId(holdingAddress)
  ctx.store.defer(TemporaryHolding, holdingId)

  return timed(ctx, async (elapsed) => {
    const holding = await ctx.store.getOrCreate(TemporaryHolding, holdingId, (id) => {
      return new TemporaryHolding({
        id,
        beneficiary: createAccountId(beneficiaryAddress),
        admin: createAccountId(adminAddress),
        unlockedAt: new Date(Number(unlockTimestamp) * 1000),
        locked: true,
      })
    })

    ctx.log.info(
      `created temporary_holding(${holding.id}) for ${holding.beneficiary} (${elapsed()}ms)`,
    )

    await addToTemporaryHoldingUnlockQueue(ctx, holding.id)
  })
})

async function addToTemporaryHoldingUnlockQueue(ctx: MappingContext, id: string) {
  const queue = await ctx.store.getOrFail(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
  )

  if (queue.tasks.some((task) => task.id === id)) return
  queue.tasks = [...queue.tasks, { id }]
}

export async function ensureTemporaryHoldingUnlockQueue(ctx: MappingContext) {
  const queue = await ctx.store.getOrCreate(
    Queue<TemporaryHoldingUnlockTask>,
    TEMPORARY_HOLDING_UNLOCK_QUEUE,
    (id) => new Queue({ id, tasks: [] }),
  )

  for (const task of queue.tasks) {
    ctx.store.defer(TemporaryHolding, task.id)
  }
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
    const holding = await ctx.store.getOrFail(TemporaryHolding, task.id)
    if (holding.unlockedAt.getTime() > block.timestamp) {
      tasks.push(task)
      continue
    }

    holding.locked = false
    processed++

    ctx.log.info(`temporary_holding(${holding.id}) unlocked`)
  }

  queue.tasks = tasks

  if (processed > 0) {
    ctx.log.info(
      `temporary-holding-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`,
    )
  }
}
