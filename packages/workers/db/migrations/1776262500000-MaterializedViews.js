module.exports = class MaterializedViews1776262500000 {
    name = 'MaterializedViews1776262500000'

    async up(db) {
        // Active workers daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_active_workers_daily AS
            WITH events_with_dates AS (
                SELECT
                    worker_id,
                    status,
                    block_number,
                    COALESCE(
                        timestamp,
                        LAG(timestamp) OVER (PARTITION BY worker_id ORDER BY block_number)
                    ) AS timestamp
                FROM worker_status_change
                WHERE pending = FALSE
            )
            SELECT
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) AS timestamp,
                SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'DEREGISTERED' THEN -1 ELSE 0 END) AS delta
            FROM events_with_dates
            WHERE timestamp IS NOT NULL
            GROUP BY 1
            ORDER BY 1;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_active_workers_daily_timestamp_idx ON mv_active_workers_daily(timestamp);`)

        // Unique operators daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_unique_operators_daily AS
            WITH events_with_dates AS (
                SELECT
                    wsc.id,
                    w.owner_id,
                    wsc.status,
                    wsc.block_number,
                    COALESCE(
                        wsc.timestamp,
                        LAG(wsc.timestamp) OVER (PARTITION BY wsc.worker_id ORDER BY wsc.block_number)
                    ) AS timestamp
                FROM worker_status_change wsc
                INNER JOIN worker w ON w.id = wsc.worker_id
                WHERE wsc.status IN ('REGISTERING', 'WITHDRAWN')
            ),
            daily_changes AS (
                SELECT 
                    date_bin('1 day', timestamp, '2001-01-01'::timestamp) as date,
                    owner_id,
                    SUM(CASE WHEN status = 'REGISTERING' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 END) as change
                FROM events_with_dates
                WHERE timestamp IS NOT NULL
                GROUP BY date, owner_id
            ),
            with_counts AS (
                SELECT date, owner_id, change,
                    SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
                FROM daily_changes
            )
            SELECT
                date as timestamp,
                SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as delta
            FROM with_counts
            GROUP BY date
            ORDER BY date;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_unique_operators_daily_timestamp_idx ON mv_unique_operators_daily(timestamp);`)

        // Delegations daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_delegations_daily AS
            WITH events_with_dates AS (
                SELECT
                    delegation_id,
                    status,
                    block_number,
                    COALESCE(
                        timestamp,
                        LAG(timestamp) OVER (PARTITION BY delegation_id ORDER BY block_number)
                    ) AS timestamp
                FROM delegation_status_change
                WHERE pending = false
            )
            SELECT
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) AS timestamp,
                SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) AS delta
            FROM events_with_dates
            WHERE timestamp IS NOT NULL
            GROUP BY 1
            ORDER BY 1;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_delegations_daily_timestamp_idx ON mv_delegations_daily(timestamp);`)

        // Delegators daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_delegators_daily AS
            WITH events_with_dates AS (
                SELECT
                    wsc.id,
                    d.owner_id,
                    wsc.status,
                    wsc.block_number,
                    COALESCE(
                        wsc.timestamp,
                        LAG(wsc.timestamp) OVER (PARTITION BY wsc.delegation_id ORDER BY wsc.block_number)
                    ) AS timestamp
                FROM delegation_status_change wsc
                INNER JOIN delegation d ON d.id = wsc.delegation_id
                WHERE wsc.status IN ('ACTIVE', 'WITHDRAWN')
            ),
            daily_changes AS (
                SELECT 
                    date_bin('1 day', timestamp, '2001-01-01'::timestamp) as date,
                    owner_id,
                    SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) as change
                FROM events_with_dates
                WHERE timestamp IS NOT NULL
                GROUP BY date, owner_id
            ),
            with_counts AS (
                SELECT date, owner_id, change,
                    SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
                FROM daily_changes
            )
            SELECT
                date as timestamp,
                SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as delta
            FROM with_counts
            GROUP BY date
            ORDER BY date;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_delegators_daily_timestamp_idx ON mv_delegators_daily(timestamp);`)

        // Queries daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_queries_daily AS
            SELECT 
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                worker_id,
                sum(queries) as value
            FROM worker_metrics
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_queries_daily_timestamp_idx ON mv_queries_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_queries_daily_worker_id_idx ON mv_queries_daily(worker_id);`)

        // Served data daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_served_data_daily AS
            SELECT 
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                worker_id,
                sum(served_data) as value
            FROM worker_metrics
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_served_data_daily_timestamp_idx ON mv_served_data_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_served_data_daily_worker_id_idx ON mv_served_data_daily(worker_id);`)

        // Stored data daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_stored_data_daily AS
            SELECT 
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                worker_id,
                AVG(stored_data) as value
            FROM worker_metrics
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_stored_data_daily_timestamp_idx ON mv_stored_data_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_stored_data_daily_worker_id_idx ON mv_stored_data_daily(worker_id);`)

        // Uptime daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_uptime_daily AS
            SELECT 
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                worker_id,
                AVG(uptime) as value
            FROM worker_metrics
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_uptime_daily_timestamp_idx ON mv_uptime_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_uptime_daily_worker_id_idx ON mv_uptime_daily(worker_id);`)

        // Reward daily
        await db.query(`
            CREATE MATERIALIZED VIEW mv_reward_daily AS
            SELECT
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                worker_id,
                SUM(amount) AS worker_value,
                SUM(stakers_reward) AS staker_value
            FROM worker_reward
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `)
        await db.query(`CREATE INDEX mv_reward_daily_timestamp_idx ON mv_reward_daily(timestamp);`)
        await db.query(`CREATE INDEX mv_reward_daily_worker_id_idx ON mv_reward_daily(worker_id);`)

        // APR daily with 90-day rolling average
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_apr_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_reward_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_uptime_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_stored_data_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_served_data_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_queries_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_delegators_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_delegations_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_unique_operators_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_active_workers_daily;`)
    }
}
