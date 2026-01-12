module.exports = class AprRollingAvg1762162400000 {
    name = 'AprRollingAvg1762162400000'

    async up(db) {
        // Drop old materialized view
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_apr_daily;`)
        
        // Create new view with 90-day rolling average
        // First, we compute daily median APR, then calculate 90-day rolling avg
        await db.query(`
            CREATE MATERIALIZED VIEW mv_apr_daily AS
            WITH daily_median AS (
                SELECT
                    date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                    COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS worker_apr,
                    COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS staker_apr
                FROM worker_reward
                GROUP BY 1
            )
            SELECT
                timestamp,
                AVG(worker_apr) OVER (
                    ORDER BY timestamp
                    RANGE BETWEEN INTERVAL '90 days' PRECEDING AND CURRENT ROW
                ) AS worker_apr,
                AVG(staker_apr) OVER (
                    ORDER BY timestamp
                    RANGE BETWEEN INTERVAL '90 days' PRECEDING AND CURRENT ROW
                ) AS staker_apr
            FROM daily_median
            ORDER BY timestamp;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_apr_daily_timestamp_idx ON mv_apr_daily(timestamp);`)
    }

    async down(db) {
        // Revert to simple daily median (from previous migration)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_apr_daily;`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_apr_daily AS
            SELECT
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS worker_apr,
                COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS staker_apr
            FROM worker_reward
            GROUP BY 1
            ORDER BY 1;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_apr_daily_timestamp_idx ON mv_apr_daily(timestamp);`)
    }
}




