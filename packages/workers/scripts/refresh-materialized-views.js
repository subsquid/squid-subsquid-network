#!/usr/bin/env node

const { createConnection } = require('typeorm')
const { config } = require('dotenv')

config()

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

async function refreshMaterializedViews() {
  const startTime = Date.now()
  console.log(`[${new Date().toISOString()}] Starting materialized view refresh...`)

  let connection
  try {
    connection = await createConnection({
      type: 'postgres',
      url: process.env.DB_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    })

    console.log('Connected to database')

    for (const viewName of MATERIALIZED_VIEWS) {
      const viewStartTime = Date.now()
      console.log(`  Refreshing ${viewName}...`)

      try {
        await connection.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${viewName}`)
        const duration = Date.now() - viewStartTime
        console.log(`  ${viewName} refreshed in ${duration}ms`)
      } catch (error) {
        console.error(`  Failed to refresh ${viewName}:`, error.message)
      }
    }

    const totalDuration = Date.now() - startTime
    console.log(`[${new Date().toISOString()}] All views refreshed in ${totalDuration}ms`)

    process.exit(0)
  } catch (error) {
    console.error('Error refreshing materialized views:', error)
    process.exit(1)
  } finally {
    if (connection && connection.isConnected) {
      await connection.close()
    }
  }
}

refreshMaterializedViews()
