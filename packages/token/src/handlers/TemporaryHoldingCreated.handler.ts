import {
  type MappingContext,
  createAccountId,
  createHandler,
  isLog,
  network,
  timed,
} from '@sqd/shared'
import * as TemporaryHoldingFactory from '@sqd/shared/lib/abi/TemporaryHoldingFactory'
import { Account, AccountType, Queue, TemporaryHolding } from '~/model'

function baseAccount(id: string, opts?: { owner?: Account; type?: AccountType }) {
  return new Account({
    id,
    balance: 0n,
    claimableDelegationCount: 0,
    type: AccountType.USER,
    ...opts,
  })
}

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
  const beneficiaryId = createAccountId(beneficiaryAddress)
  const adminId = createAccountId(adminAddress)

  ctx.store.defer(TemporaryHolding, holdingId)
  ctx.store.defer(Account, beneficiaryId)
  ctx.store.defer(Account, adminId)
  ctx.store.defer(Account, { id: holdingId, relations: { owner: true } })

  return timed(ctx, async (elapsed) => {
    const beneficiary = await ctx.store.getOrCreate(Account, beneficiaryId, (id) => {
      ctx.log.info(`created account(${id})`)
      return baseAccount(id, { type: AccountType.USER })
    })
    const admin = await ctx.store.getOrCreate(Account, adminId, (id) => {
      ctx.log.info(`created account(${id})`)
      return baseAccount(id, { type: AccountType.USER })
    })

    const holding = await ctx.store.getOrCreate(TemporaryHolding, holdingId, (id) => {
      return new TemporaryHolding({
        id,
        beneficiary: beneficiaryId,
        admin: adminId,
        unlockedAt: new Date(Number(unlockTimestamp) * 1000),
        locked: true,
      })
    })

    holding.beneficiary = beneficiaryId
    holding.admin = adminId

    // Preserve admin ownership when replaying a creation event for an already-unlocked holding.
    const owner = holding.locked ? beneficiary : admin

    const holdingAccount = await ctx.store.getOrCreate(
      Account,
      { id: holdingId, relations: { owner: true } },
      (id) => {
        ctx.log.info(`created account(${id})`)
        return baseAccount(id, { type: AccountType.TEMPORARY_HOLDING, owner })
      },
    )

    holdingAccount.type = AccountType.TEMPORARY_HOLDING
    holdingAccount.owner = owner

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
    ctx.store.defer(Account, { id: task.id, relations: { owner: true } })
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

    const admin = await ctx.store.getOrCreate(Account, holding.admin, (id) => {
      ctx.log.info(`created account(${id})`)
      return baseAccount(id, { type: AccountType.USER })
    })

    const holdingAccount = await ctx.store.getOrCreate(
      Account,
      { id: holding.id, relations: { owner: true } },
      (id) => {
        ctx.log.info(`created account(${id})`)
        return baseAccount(id, { type: AccountType.TEMPORARY_HOLDING, owner: admin })
      },
    )

    holdingAccount.type = AccountType.TEMPORARY_HOLDING
    holdingAccount.owner = admin

    ctx.log.info(`temporary_holding(${holding.id}) unlocked, owner → admin(${holding.admin})`)

    processed++
  }

  queue.tasks = tasks

  if (processed > 0) {
    ctx.log.info(
      `temporary-holding-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`,
    )
  }
}
