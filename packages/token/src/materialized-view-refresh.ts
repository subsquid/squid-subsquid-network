import { EntityManager } from 'typeorm'

const MATERIALIZED_VIEWS = [
  'mv_holders_count_daily',
  'mv_locked_value_daily',
  'mv_transfers_by_type_daily',
  'mv_unique_accounts_daily',
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
