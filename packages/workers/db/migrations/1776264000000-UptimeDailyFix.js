module.exports = class UptimeDailyFix1776264000000 {
    name = 'UptimeDailyFix1776264000000'

    async up(db) {
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_uptime_daily CASCADE`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_uptime_daily AS
            SELECT
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) AS timestamp,
                worker_id,
                SUM(uptime) / 24.0 AS value
            FROM worker_metrics
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_uptime_daily_timestamp_idx ON mv_uptime_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_uptime_daily_worker_id_idx ON mv_uptime_daily(worker_id);`)
    }

    async down(db) {
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_uptime_daily CASCADE`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_uptime_daily AS
            SELECT
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) AS timestamp,
                worker_id,
                AVG(uptime) AS value
            FROM worker_metrics
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_uptime_daily_timestamp_idx ON mv_uptime_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_uptime_daily_worker_id_idx ON mv_uptime_daily(worker_id);`)
    }
}
