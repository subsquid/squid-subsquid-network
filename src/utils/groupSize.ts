import { differenceInMilliseconds } from 'date-fns'

export type GroupSize = { label: string; ms: number; unit: 'hour' | 'day' | 'week' | 'month' }

const UNIT_MS: Record<string, { ms: number; unit: GroupSize['unit']; singular: string; plural: string }> = {
  h: { ms: 60 * 60 * 1000, unit: 'hour', singular: 'hour', plural: 'hours' },
  d: { ms: 24 * 60 * 60 * 1000, unit: 'day', singular: 'day', plural: 'days' },
  w: { ms: 7 * 24 * 60 * 60 * 1000, unit: 'week', singular: 'week', plural: 'weeks' },
  M: { ms: 4 * 7 * 24 * 60 * 60 * 1000, unit: 'month', singular: 'month', plural: 'months' },
}

function parseBucketSize(bucket: string): GroupSize {
  const match = bucket.match(/^(\d+)([hdwM])$/)
  if (!match) {
    throw new Error(`Invalid bucket size format: ${bucket}. Expected format: <number><unit> (e.g., 1h, 3d, 2w, 1M)`)
  }

  const [, numStr, unitChar] = match
  const num = parseInt(numStr, 10)
  const unitInfo = UNIT_MS[unitChar]

  if (!unitInfo) {
    throw new Error(`Invalid unit: ${unitChar}. Valid units: h (hour), d (day), w (week), M (month)`)
  }

  const label = `${num} ${num === 1 ? unitInfo.singular : unitInfo.plural}`
  const ms = num * unitInfo.ms

  return { label, ms, unit: unitInfo.unit }
}

const DEFAULT_BUCKETS = ['1h', '3h', '6h', '12h', '1d', '3d', '1w', '2w', '1M', '3M', '6M']

/**
 * Returns suitable bucket size (group size) so that the number of points
 * in the range does not exceed maxPoints.
 *
 * @param from  start of interval
 * @param to    end of interval; defaults to `new Date()`
 */
export function getGroupSize(
  step: string | { from: Date; to: Date; maxPoints?: number },
): GroupSize {
  if (typeof step === 'string') {
    return parseBucketSize(step)
  }

  const { from, to, maxPoints = 50 } = step
  const rangeMs = Math.max(0, differenceInMilliseconds(to, from))

  for (const bucketStr of DEFAULT_BUCKETS) {
    const bucket = parseBucketSize(bucketStr)
    if (rangeMs / bucket.ms <= maxPoints) {
      return bucket
    }
  }
  // If even the largest bucket still exceeds maxPoints, return the largest
  return parseBucketSize(DEFAULT_BUCKETS[DEFAULT_BUCKETS.length - 1])
}
