import { differenceInMilliseconds } from 'date-fns'

const DAY_MS = 24 * 60 * 60 * 1000

export type GroupSize = { days: number; ms: number }

/**
 * Parse a step string like "1d", "7d", "30d" into a GroupSize.
 */
function parseBucketSize(bucket: string): GroupSize {
  const match = bucket.match(/^(\d+)d$/)
  if (!match) {
    throw new Error(
      `Invalid bucket size: "${bucket}". Expected format: <number>d (e.g. "1d", "7d", "30d")`,
    )
  }
  const days = parseInt(match[1], 10)
  return { days, ms: days * DAY_MS }
}

const NICE_DAYS = [1, 7, 30, 90, 365]

/**
 * Returns a step size in days so that the number of points does not exceed
 * maxPoints. Picks from nice day multiples, or computes one dynamically
 * for very long ranges.
 */
export function getGroupSize(
  step: string | { from: Date; to: Date; maxPoints?: number },
): GroupSize {
  if (typeof step === 'string') {
    return parseBucketSize(step)
  }

  const { from, to, maxPoints = 100 } = step
  const rangeMs = Math.max(0, differenceInMilliseconds(to, from))
  const rangeDays = rangeMs / DAY_MS

  for (const d of NICE_DAYS) {
    if (rangeDays / d <= maxPoints) {
      return { days: d, ms: d * DAY_MS }
    }
  }

  const days = Math.ceil(rangeDays / maxPoints)
  return { days, ms: days * DAY_MS }
}
