import { EntityManager } from 'typeorm'

const MATERIALIZED_VIEWS = [
  'mv_active_workers_daily',
  'mv_unique_operators_daily',
  'mv_delegations_daily',
  'mv_delegators_daily',
  'mv_queries_daily',
  'mv_served_data_daily',
  'mv_stored_data_daily',
  'mv_uptime_daily',
  'mv_reward_daily',
  'mv_apr_daily',
]

const REFRESH_INTERVAL_MS = 60 * 60 * 1000

export async function startMaterializedViewRefresh(manager: EntityManager): Promise<void> {
  try {
    for (const viewName of MATERIALIZED_VIEWS) {
      await manager.query(`REFRESH MATERIALIZED VIEW ${viewName}`)
    }
    console.log('Materialized views refreshed successfully')
  } catch (e) {
    console.warn('Error refreshing materialized views:', e)
  }

  setTimeout(() => startMaterializedViewRefresh(manager), REFRESH_INTERVAL_MS)
}
