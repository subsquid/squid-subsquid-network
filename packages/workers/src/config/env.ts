import { url, cleanEnv, makeValidator } from 'envalid'
import ms from 'ms'

// `ms` notation ("10s", "2m", "1h"). A bare number is rejected: `ms` would read
// "10" as 10 ms, which is easy to mistake for seconds.
const duration = makeValidator<number>((input) => {
  const hasUnit = /[a-z]\s*$/i.test(input)
  if (!hasUnit) {
    throw new Error(`duration needs a unit, e.g. "10s" or "2m", got "${input}"`)
  }

  const value = ms(input as ms.StringValue)
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`expected a duration like "10s" or "2m", got "${input}"`)
  }

  return value
})

const parsed = cleanEnv(process.env, {
  NETWORK_STATS_URL: url({ default: undefined }),
  SCHEDULER_URL: url({ default: undefined }),
  REWARDS_MONITOR_API_URL: url({ default: undefined }),
  REWARDS_MONITOR_RETRY_MIN: duration({
    default: ms('10s'),
    desc: 'First retry delay after a failed rewards fetch; doubles on each failure',
  }),
  REWARDS_MONITOR_RETRY_MAX: duration({
    default: ms('2m'),
    desc: 'Upper bound for the rewards retry delay',
  }),
})

// Backoff caps at MAX, so MIN > MAX would silently retry every MAX instead.
const retryMin = parsed.REWARDS_MONITOR_RETRY_MIN
const retryMax = parsed.REWARDS_MONITOR_RETRY_MAX
if (retryMin > retryMax) {
  throw new Error(
    `REWARDS_MONITOR_RETRY_MIN (${ms(retryMin)}) must not exceed ` +
      `REWARDS_MONITOR_RETRY_MAX (${ms(retryMax)})`,
  )
}

export const env = parsed
