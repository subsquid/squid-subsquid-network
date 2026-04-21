import { BigDecimal } from '@subsquid/big-decimal'
import { createLogger } from '@subsquid/logger'

import type { MappingContext } from '@sqd/shared'
import { DAY_MS, network } from '@sqd/shared'

import { Settings, Worker, WorkerStatus } from '~/model'
import { computeCapedDelegation } from './softcap'

export { computeCapedDelegation }

// Enable with SQD_DEBUG=sqd:workers:cap
const log = createLogger('sqd:workers:cap')

/**
 * Set whenever any worker's `capedDelegation` is mutated to a new value, and
 * cleared by `recalculateWorkerAprs`. Drives the per-batch `flushAprRecalc`
 * in `complete()` so we run the network-wide APR rollup at most once per
 * batch when any cap actually moved (instead of once per delegation event).
 *
 * A single cap change affects every active worker's APR via the shared
 * `utilizedStake = Σ (bond + capedDelegation)` term in `dTraffic`, so the
 * recalc must be network-wide.
 */
let aprDirty = false

/**
 * Recompute and assign `capedDelegation` for `worker` in place.
 * Returns true iff the value actually changed.
 */
export function refreshWorkerCap(worker: Worker, settings: Settings): boolean {
  const newCap = computeCapedDelegation(worker.totalDelegation, settings.bondAmount ?? 0n)
  if (newCap === worker.capedDelegation) return false

  log.debug(
    `worker(${worker.id}) cap ${worker.capedDelegation} → ${newCap} ` +
      `(stake ${worker.totalDelegation}, bond ${settings.bondAmount ?? 0n})`,
  )
  worker.capedDelegation = newCap
  aprDirty = true
  return true
}

/**
 * Mark the APR rollup as dirty for the current batch. Use this from handlers
 * that mutate inputs to `utilizedStake = Σ (bond + capedDelegation for active
 * & live workers)` without going through `refreshWorkerCap` — status
 * transitions (ACTIVE ↔ other), `worker.bond` changes on `ExcessiveBondReturned`,
 * and `settings.bondAmount` updates (which shift every active worker's cap).
 */
export function markAprDirty(): void {
  aprDirty = true
}

/**
 * Run `recalculateWorkerAprs` only if at least one cap changed since the last
 * recalc. Cheap no-op otherwise. Intended to be called once at the end of a
 * batch from `main.ts:complete`.
 */
export async function flushAprRecalc(ctx: MappingContext): Promise<void> {
  if (!aprDirty) return
  await recalculateWorkerAprs(ctx)
}

export async function recalculateWorkerAprs(ctx: MappingContext): Promise<void> {
  // Cleared up-front: any cap change from concurrent code paths during the
  // recalc (none today, but cheap insurance) is preserved for the next flush.
  aprDirty = false

  const settings = await ctx.store.getOrFail(Settings, network.name)

  const workers = await ctx.store.find(Worker, {
    where: { status: WorkerStatus.ACTIVE },
  })

  if (workers.length === 0) {
    settings.utilizedStake = 0n
    return
  }

  const baseApr = BigDecimal(settings.baseApr)
  const utilizedStake = workers.reduce(
    (r, w) => (w.liveness ? r + w.bond + w.capedDelegation : r),
    0n,
  )

  settings.utilizedStake = utilizedStake
  log.debug(
    `recalculating APRs for ${workers.length} active workers ` +
      `(base APR ${settings.baseApr}, utilized stake ${utilizedStake})`,
  )

  const ninetyDaysAgo = new Date(Date.now() - 90 * DAY_MS)

  // Flush pending tracked WorkerReward rows so the raw query below sees them.
  await ctx.store.sync()

  // SQL-side aggregation instead of loading every WorkerReward row + joining
  // the full Worker entity (the previous `relations: {worker: true}` form
  // produced an `IN ($1..$N)` query with a wide SELECT and was timing out at
  // ~2k active workers). We only need per-worker sums and counts.
  const aggregates: {
    worker_id: string
    apr_sum: string
    staker_apr_sum: string
    n: string
  }[] = await (ctx.store as any).em.query(
    `SELECT
            worker_id,
            COALESCE(SUM(apr), 0)        AS apr_sum,
            COALESCE(SUM(staker_apr), 0) AS staker_apr_sum,
            COUNT(*)                     AS n
        FROM worker_reward
        WHERE timestamp >= $1
        GROUP BY worker_id`,
    [ninetyDaysAgo],
  )

  const aggregateByWorker = new Map(aggregates.map((r) => [r.worker_id, r]))

  for (const worker of workers) {
    const supplyRatio =
      utilizedStake === 0n
        ? BigDecimal(0)
        : BigDecimal(worker.capedDelegation).add(worker.bond).div(utilizedStake)

    const dTraffic = supplyRatio.eq(0)
      ? 0
      : Math.min(
          BigDecimal(worker.trafficWeight || 0)
            .div(supplyRatio)
            .toNumber() ** 0.1,
          1,
        )

    const actualYield = baseApr
      .mul(worker.liveness || 0)
      .mul(dTraffic)
      .mul(worker.dTenure || 0)

    const workerReward = actualYield.mul(worker.bond + worker.capedDelegation / 2n)
    const currentApr = workerReward.div(worker.bond).mul(100).toNumber()

    const stakerReward = actualYield.mul(worker.capedDelegation / 2n)
    const currentStakerApr = worker.totalDelegation
      ? stakerReward.div(worker.totalDelegation).mul(100).toNumber()
      : currentApr / 2

    const agg = aggregateByWorker.get(worker.id)
    const historyCount = agg ? Number(agg.n) : 0
    const aprSum = (agg ? Number(agg.apr_sum) : 0) + currentApr
    const stakerAprSum = (agg ? Number(agg.staker_apr_sum) : 0) + currentStakerApr
    const n = historyCount + 1

    worker.apr = aprSum / n
    worker.stakerApr = stakerAprSum / n
  }

  log.info(`APRs recalculated for ${workers.length} active workers`)
}
