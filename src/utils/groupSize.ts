import { differenceInMilliseconds } from 'date-fns'

export type GroupSize = { label: string; ms: number; unit: 'hour' | 'day' | 'week' | 'month' }

const BUCKETS: Record<string, GroupSize> = {
  ['1h']: { label: '1 hour', ms: 60 * 60 * 1000, unit: 'hour' },
  ['3h']: { label: '3 hours', ms: 3 * 60 * 60 * 1000, unit: 'hour' },
  ['6h']: { label: '6 hours', ms: 6 * 60 * 60 * 1000, unit: 'hour' },
  ['12h']: { label: '12 hours', ms: 12 * 60 * 60 * 1000, unit: 'hour' },
  ['1d']: { label: '1 day', ms: 24 * 60 * 60 * 1000, unit: 'day' },
  ['3d']: { label: '3 days', ms: 3 * 24 * 60 * 60 * 1000, unit: 'day' },
  ['1w']: { label: '1 week', ms: 7 * 24 * 60 * 60 * 1000, unit: 'week' },
  ['2w']: { label: '2 weeks', ms: 2 * 7 * 24 * 60 * 60 * 1000, unit: 'week' },
  ['1M']: { label: '4 weeks', ms: 4 * 7 * 24 * 60 * 60 * 1000, unit: 'month' },
  ['3M']: { label: '12 weeks', ms: 12 * 7 * 24 * 60 * 60 * 1000, unit: 'month' },
  ['6M']: { label: '24 weeks', ms: 24 * 7 * 24 * 60 * 60 * 1000, unit: 'month' },
}

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
    const bucket = BUCKETS[step]
    if (!bucket) {
      throw new Error(`Invalid step: ${step}`)
    }
    return bucket
  }

  const { from, to, maxPoints = 50 } = step
  const rangeMs = Math.max(0, differenceInMilliseconds(to, from))

  for (const bucket of Object.values(BUCKETS)) {
    if (rangeMs / bucket.ms <= maxPoints) {
      return bucket
    }
  }
  // If even the largest bucket still exceeds maxPoints, return the largest
  return BUCKETS[Object.keys(BUCKETS)[Object.keys(BUCKETS).length - 1]]
}
