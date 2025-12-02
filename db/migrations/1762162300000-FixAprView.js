module.exports = class FixAprView1762162300000 {
    name = 'FixAprView1762162300000'

    async up(db) {
        // Fix APR view to compute overall median across ALL workers, not per-worker
        // The previous version computed median per worker per day, which when averaged
        // produced incorrect values (2000000%+)
        
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

    async down(db) {
        // Revert to per-worker version (broken but reversible)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_apr_daily;`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_apr_daily AS
            SELECT
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                worker_id,
                COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS worker_apr,
                COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS staker_apr
            FROM worker_reward
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_apr_daily_timestamp_idx ON mv_apr_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_apr_daily_worker_id_idx ON mv_apr_daily(worker_id);`)
    }
}



