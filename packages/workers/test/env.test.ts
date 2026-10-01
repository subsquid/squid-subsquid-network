import { afterEach, describe, expect, it, vi } from 'vitest'

async function loadEnv() {
  vi.resetModules()
  const { env } = await import('~/config/env')
  return env
}

describe('workers env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('parses retry delays in ms notation', async () => {
    vi.stubEnv('REWARDS_MONITOR_RETRY_MIN', '1m')
    vi.stubEnv('REWARDS_MONITOR_RETRY_MAX', '1h')

    const env = await loadEnv()

    expect(env.REWARDS_MONITOR_RETRY_MIN).toBe(60_000)
    expect(env.REWARDS_MONITOR_RETRY_MAX).toBe(3_600_000)
  })

  it('rejects a retry delay without a unit', async () => {
    vi.stubEnv('REWARDS_MONITOR_RETRY_MIN', '10')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit')
    })

    await expect(loadEnv()).rejects.toThrow('process.exit')
  })

  it('rejects MIN greater than MAX', async () => {
    vi.stubEnv('REWARDS_MONITOR_RETRY_MIN', '5m')
    vi.stubEnv('REWARDS_MONITOR_RETRY_MAX', '1m')

    await expect(loadEnv()).rejects.toThrow('must not exceed')
  })
})
