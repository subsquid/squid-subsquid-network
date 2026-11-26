import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NETWORK = 'mainnet'
  process.env.RPC_ENDPOINT = 'http://rpc.invalid'
  process.env.REWARDS_MONITOR_API_URL = 'http://monitor.invalid'
})

// esbuild does not emit decorator metadata, so the real TypeORM entities fail to load.
vi.mock('~/model', () => {
  class Entity {
    constructor(props?: object) {
      Object.assign(this, props)
    }
  }
  return {
    Delegation: class Delegation extends Entity {},
    DelegationStatusChange: class DelegationStatusChange extends Entity {},
    Queue: class Queue extends Entity {},
    Settings: class Settings extends Entity {},
    Worker: class Worker extends Entity {},
    DelegationStatus: { ACTIVE: 'ACTIVE', WITHDRAWN: 'WITHDRAWN' },
  }
})

vi.mock('~/handlers/cap', () => ({
  refreshWorkerCap: vi.fn(),
}))

vi.mock('~/helpers', () => ({
  createDelegation: (id: string, props: object) => ({
    id,
    deposit: 0n,
    status: undefined,
    ...props,
  }),
}))

import type { Item, MappingContext } from '@sqd/shared'
import { createAccountId, createDelegationId, createWorkerId, network } from '@sqd/shared'
import * as Staking from '@sqd/shared/lib/abi/Staking'

import {
  DELEGATION_UNLOCK_QUEUE,
  processDelegationUnlockQueue,
} from '~/handlers/staking/DelegationUnlock.queue'
import { handleDeposited } from '~/handlers/staking/Deposited.handler'
import { computeDelegationLock } from '~/handlers/staking/lock'
import { Delegation, DelegationStatus, Queue, Settings, Worker } from '~/model'

const STAKER = '0x5a26344c84f8f3de55ae32fb4e06e5b547e2f7f3'
const WORKER_INDEX = 5045n
const SQD = 10n ** 18n

// Mainnet values on 2026-11-26: 100-block worker epochs, 6-month lock.
const EPOCH_LENGTH = 100
const LOCK_PERIOD = 1_314_000

const workerId = createWorkerId(WORKER_INDEX)
const accountId = createAccountId(STAKER)
const delegationId = createDelegationId(workerId, accountId)

const pad = (hex: string) => `0x${hex.replace(/^0x/, '').padStart(64, '0')}`

function depositedLog(amount: bigint, l1BlockNumber: number): Item {
  return {
    kind: 'log',
    address: '0xb31a0d39d2c69ed4b28d96e12cbf52c5f9ac9a51',
    value: {
      address: '0xb31a0d39d2c69ed4b28d96e12cbf52c5f9ac9a51',
      topics: [Staking.events.Deposited.topic, pad(WORKER_INDEX.toString(16)), pad(STAKER)],
      data: pad(amount.toString(16)),
      logIndex: 0,
      transactionIndex: 0,
      block: { height: 527776258, l1BlockNumber, timestamp: 1795710762000 },
    },
  } as unknown as Item
}

function createCtx(entities: { delegation?: any; worker?: any; settings?: any }) {
  const queue = new Queue({ id: DELEGATION_UNLOCK_QUEUE, tasks: [] }) as any
  const tracked: unknown[] = []

  const lookup = (target: unknown, opts: string | { id: string }) => {
    const id = typeof opts === 'string' ? opts : opts.id
    if (target === Delegation) return id === delegationId ? entities.delegation : undefined
    if (target === Worker) return id === workerId ? entities.worker : undefined
    if (target === Settings) return id === network.name ? entities.settings : undefined
    if (target === Queue) return id === DELEGATION_UNLOCK_QUEUE ? queue : undefined
    return undefined
  }
  const orFail = (target: unknown, opts: string | { id: string }) => {
    const entity = lookup(target, opts)
    if (!entity) throw new Error(`entity not found: ${JSON.stringify(opts)}`)
    return entity
  }
  const getOrCreate = async (
    target: unknown,
    opts: string | { id: string },
    create: (id: string) => unknown,
  ) => {
    const existing = lookup(target, opts)
    if (existing) return existing
    const created = await create(typeof opts === 'string' ? opts : opts.id)
    if (target === Delegation) entities.delegation = created
    return created
  }

  const store = {
    defer: (target: unknown, opts: string | { id: string }) => ({
      get: async () => lookup(target, opts),
      getOrFail: async () => orFail(target, opts),
      getOrCreate: (create: (id: string) => unknown) => getOrCreate(target, opts, create),
    }),
    get: async (target: unknown, opts: string | { id: string }) => lookup(target, opts),
    getOrFail: async (target: unknown, opts: string | { id: string }) => orFail(target, opts),
    getOrCreate,
    track: async (entity: unknown) => {
      tracked.push(entity)
    },
  }

  const ctx = {
    store,
    templates: { has: () => true },
    log: { info: vi.fn(), warn: vi.fn(), debug: vi.fn(), error: vi.fn() },
  } as unknown as MappingContext

  return { ctx, queue, tracked, entities }
}

function mainnetSettings() {
  return new Settings({
    id: network.name,
    epochLength: EPOCH_LENGTH,
    lockPeriod: LOCK_PERIOD,
    bondAmount: 100_000n * SQD,
  }) as any
}

function activeWorker() {
  return new Worker({
    id: workerId,
    totalDelegation: 2n * SQD,
    delegationCount: 1,
    capedDelegation: 2n * SQD,
  }) as any
}

describe('computeDelegationLock', () => {
  it('locks from the next worker epoch for one lock period', () => {
    // Mainnet tx 0x4ee6a0e2…892c at L1 block 26,500,589: Staking.getDeposit returned an unlock
    // block of 27,814,600 afterwards.
    expect(
      computeDelegationLock(26_500_589, { epochLength: EPOCH_LENGTH, lockPeriod: LOCK_PERIOD }),
    ).toEqual({ locked: true, lockStart: 26_500_600, lockEnd: 27_814_600 })
  })

  it('gives every deposit inside one worker epoch the same unlock block', () => {
    const settings = { epochLength: EPOCH_LENGTH, lockPeriod: LOCK_PERIOD }
    expect(computeDelegationLock(26_500_566, settings)).toEqual(
      computeDelegationLock(26_500_568, settings),
    )
    expect(computeDelegationLock(26_500_600, settings).lockEnd).toBe(27_814_700)
  })

  it('falls back to the epoch length when no lock period is set', () => {
    expect(computeDelegationLock(1_050, { epochLength: 100, lockPeriod: null })).toEqual({
      locked: true,
      lockStart: 1_100,
      lockEnd: 1_200,
    })
  })

  it('does not lock before the epoch length is known', () => {
    expect(computeDelegationLock(1_050, { epochLength: null, lockPeriod: LOCK_PERIOD })).toEqual({
      locked: false,
      lockStart: 1_050,
      lockEnd: 1_050,
    })
  })
})

describe('handleDeposited', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('re-locks an existing delegation on a zero-amount deposit and changes nothing else', async () => {
    const worker = activeWorker()
    // State after the 2 SQD delegated in the previous epoch; the old lock has already been
    // released by the unlock queue, so the delegation is no longer queued.
    const delegation = new Delegation({
      id: delegationId,
      deposit: 2n * SQD,
      status: DelegationStatus.ACTIVE,
      locked: false,
      lockStart: 26_500_500,
      lockEnd: 27_814_500,
      worker,
    }) as any
    const { ctx, queue, tracked } = createCtx({ delegation, worker, settings: mainnetSettings() })

    const task = handleDeposited(ctx, depositedLog(0n, 26_500_589))
    expect(task).toBeDefined()
    await task!()

    expect(delegation.locked).toBe(true)
    expect(delegation.lockStart).toBe(26_500_600)
    expect(delegation.lockEnd).toBe(27_814_600)
    expect(queue.tasks).toEqual([{ id: delegationId }])

    expect(delegation.deposit).toBe(2n * SQD)
    expect(delegation.status).toBe(DelegationStatus.ACTIVE)
    expect(worker.totalDelegation).toBe(2n * SQD)
    expect(worker.delegationCount).toBe(1)
    expect(tracked).toEqual([])
  })

  it('does not queue the delegation twice when it is still locked', async () => {
    const worker = activeWorker()
    const delegation = new Delegation({
      id: delegationId,
      deposit: 2n * SQD,
      status: DelegationStatus.ACTIVE,
      locked: true,
      lockStart: 26_500_500,
      lockEnd: 27_814_500,
      worker,
    }) as any
    const { ctx, queue } = createCtx({ delegation, worker, settings: mainnetSettings() })
    queue.tasks = [{ id: delegationId }]

    await handleDeposited(ctx, depositedLog(0n, 26_500_589))!()

    expect(delegation.lockEnd).toBe(27_814_600)
    expect(queue.tasks).toEqual([{ id: delegationId }])
  })

  it('unlocks a re-locked delegation at the new lock end, not the old one', async () => {
    const worker = activeWorker()
    const delegation = new Delegation({
      id: delegationId,
      deposit: 2n * SQD,
      status: DelegationStatus.ACTIVE,
      locked: true,
      lockStart: 26_500_500,
      lockEnd: 27_814_500,
      worker,
    }) as any
    const { ctx, queue } = createCtx({ delegation, worker, settings: mainnetSettings() })
    queue.tasks = [{ id: delegationId }]

    await handleDeposited(ctx, depositedLog(0n, 26_500_589))!()

    // The old lock end passes: still locked, still queued.
    await processDelegationUnlockQueue(ctx, { l1BlockNumber: 27_814_500 })
    expect(delegation.locked).toBe(true)
    await processDelegationUnlockQueue(ctx, { l1BlockNumber: 27_814_599 })
    expect(delegation.locked).toBe(true)
    expect(queue.tasks).toEqual([{ id: delegationId }])

    // Staking.withdraw allows it once withdrawAllowed <= block.number.
    await processDelegationUnlockQueue(ctx, { l1BlockNumber: 27_814_600 })
    expect(delegation.locked).toBe(false)
    expect(queue.tasks).toEqual([])
  })

  it('ignores a zero-amount deposit when the staker has no delegation on the worker', async () => {
    const worker = activeWorker()
    const { ctx, queue, tracked, entities } = createCtx({ worker, settings: mainnetSettings() })

    await handleDeposited(ctx, depositedLog(0n, 26_500_589))!()

    expect(entities.delegation).toBeUndefined()
    expect(queue.tasks).toEqual([])
    expect(tracked).toEqual([])
    expect(worker.totalDelegation).toBe(2n * SQD)
    expect(worker.delegationCount).toBe(1)
  })

  it('ignores a zero-amount deposit on a fully withdrawn delegation', async () => {
    const worker = activeWorker()
    const delegation = new Delegation({
      id: delegationId,
      deposit: 0n,
      status: DelegationStatus.WITHDRAWN,
      locked: false,
      lockStart: 100,
      lockEnd: 200,
      worker,
    }) as any
    const { ctx, queue, tracked } = createCtx({ delegation, worker, settings: mainnetSettings() })

    await handleDeposited(ctx, depositedLog(0n, 26_500_589))!()

    expect(delegation.locked).toBe(false)
    expect(delegation.lockEnd).toBe(200)
    expect(delegation.status).toBe(DelegationStatus.WITHDRAWN)
    expect(queue.tasks).toEqual([])
    expect(tracked).toEqual([])
  })

  it('keeps the behaviour of a positive deposit: adds the stake, locks and counts it', async () => {
    const worker = new Worker({
      id: workerId,
      totalDelegation: 0n,
      delegationCount: 0,
      capedDelegation: 0n,
    }) as any
    const { ctx, queue, tracked, entities } = createCtx({ worker, settings: mainnetSettings() })

    await handleDeposited(ctx, depositedLog(1n * SQD, 26_500_566))!()

    const delegation = entities.delegation
    expect(delegation.deposit).toBe(1n * SQD)
    expect(delegation.locked).toBe(true)
    expect(delegation.lockStart).toBe(26_500_600)
    expect(delegation.lockEnd).toBe(27_814_600)
    expect(delegation.status).toBe(DelegationStatus.ACTIVE)
    expect(queue.tasks).toEqual([{ id: delegationId }])
    expect(worker.totalDelegation).toBe(1n * SQD)
    expect(worker.delegationCount).toBe(1)
    expect(tracked).toHaveLength(1)
  })
})
