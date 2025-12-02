import { EntityManager } from 'typeorm'

const MATERIALIZED_VIEWS = [
  'mv_holders_count_daily',
  'mv_locked_value_daily',
  'mv_active_workers_daily',
  'mv_unique_operators_daily',
  'mv_delegations_daily',
  'mv_delegators_daily',
  'mv_transfers_by_type_daily',
  'mv_unique_accounts_daily',
  'mv_queries_daily',
  'mv_served_data_daily',
  'mv_stored_data_daily',
  'mv_uptime_daily',
  'mv_reward_daily',
  'mv_apr_daily',
]

export async function startMaterializedViewRefresh(manager: EntityManager): Promise<void> {
  try {
    for (const viewName of MATERIALIZED_VIEWS) {
      await manager.query(`REFRESH MATERIALIZED VIEW ${viewName}`)
    }
  } catch (e) {
    console.warn('Error refreshing materialized views:', e)
    startMaterializedViewRefresh(manager)
    return
  }

  console.log('Materialized views refreshed successfully')

  setTimeout(() => startMaterializedViewRefresh(manager), 60 * 60 * 1000)
}
