import { HttpError, HttpResponse } from '@subsquid/http-client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { MappingContext } from '@sqd/shared'
import type { BlockHeader } from '~/types'

const { get } = vi.hoisted(() => {
  process.env.NETWORK = 'mainnet'
  process.env.RPC_ENDPOINT = 'http://rpc.invalid'
  process.env.REWARDS_MONITOR_API_URL = 'http://monitor.invalid'
  process.env.REWARDS_MONITOR_RETRY_MIN = '5s'
  return { get: vi.fn() }
})

const RETRY_MIN = 5_000

vi.mock('@subsquid/http-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@subsquid/http-client')>()
  return {
    ...actual,
    HttpClient: class {
      get = get
    },
  }
})

// esbuild does not emit decorator metadata, so the real TypeORM entities fail to load.
vi.mock('~/model', () => ({
  Block: class {},
  Settings: class {},
  Worker: class {},
  WorkerMetrics: class {},
  WorkerStatus: { ACTIVE: 'ACTIVE', DEREGISTERING: 'DEREGISTERING' },
}))

vi.mock('~/handlers/cap', () => ({
  recalculateWorkerAprs: vi.fn(),
  refreshWorkerCap: vi.fn(),
}))

const START = Date.UTC(2026, 9, 1, 13, 1)

function serverError(url: string) {
  return new HttpError(
    new HttpResponse(1, url, 500, new Headers(), 'Unable to find l2 block', false),
  )
}

function calls(path: string) {
  return get.mock.calls.filter(([url]) => (url as string).includes(path)).length
}

const flush = () => new Promise((resolve) => setImmediate(resolve))

describe('updateWorkerRewardStats', () => {
  let settings: { baseApr: number | null }
  let ctx: MappingContext
  let updateWorkerRewardStats: (ctx: MappingContext, block: BlockHeader) => Promise<void>

  async function batch() {
    await updateWorkerRewardStats(ctx, { timestamp: Date.now() } as BlockHeader)
    await flush()
  }

  async function batches(n: number) {
    for (let i = 0; i < n; i++) await batch()
  }

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(START)
    get.mockReset()
    vi.resetModules()
    ;({ updateWorkerRewardStats } = await import('~/handlers/metrics'))

    settings = { baseApr: null }
    ctx = {
      store: {
        find: vi.fn(async () => []),
        findOne: vi.fn(async () => ({ l1BlockNumber: 20_000 })),
        getOrFail: vi.fn(async () => settings),
      },
    } as unknown as MappingContext
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('backs off after a failed /currentApy and does not refetch /rewards', async () => {
    let apyFailures = 1
    get.mockImplementation(async (url: string) => {
      if (url.endsWith('/config')) return { rewardEpochLength: 100 }
      if (url.includes('/rewards/')) return { workers: [] }
      if (apyFailures > 0) {
        apyFailures -= 1
        throw serverError(url)
      }
      return { apy: 1000 }
    })

    await batches(3)
    expect(calls('/currentApy/')).toBe(1)

    await batches(20)
    vi.setSystemTime(START + RETRY_MIN - 1)
    await batches(5)
    expect(get).toHaveBeenCalledTimes(3)

    vi.setSystemTime(START + RETRY_MIN)
    await batches(3)

    expect(calls('/config')).toBe(2)
    expect(calls('/currentApy/')).toBe(2)
    expect(calls('/rewards/')).toBe(1)
    expect(settings.baseApr).toBe(0.1)
  })

  it('doubles the retry delay on consecutive failures', async () => {
    get.mockImplementation(async (url: string) => {
      if (url.endsWith('/config')) return { rewardEpochLength: 100 }
      if (url.includes('/rewards/')) return { workers: [] }
      throw serverError(url)
    })

    await batches(3)
    vi.setSystemTime(START + RETRY_MIN)
    await batches(3)
    expect(calls('/config')).toBe(2)

    vi.setSystemTime(START + RETRY_MIN + 2 * RETRY_MIN - 1)
    await batches(3)
    expect(calls('/config')).toBe(2)

    vi.setSystemTime(START + RETRY_MIN + 2 * RETRY_MIN)
    await batches(3)
    expect(calls('/config')).toBe(3)
    expect(calls('/rewards/')).toBe(1)
  })
})
