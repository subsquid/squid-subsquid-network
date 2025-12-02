module.exports = class ChangeToDailyViews1762162200000 {
    name = 'ChangeToDailyViews1762162200000'

    async up(db) {
        // Drop hourly views and recreate as daily views
        
        // Holders count daily
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_holders_count_hourly;`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_holders_count_daily AS
            WITH daily_data AS (
                SELECT
                    date_bin('1 day', t.timestamp, '2001-01-01'::timestamp) as day,
                    at.account_id,
                    (array_agg(at.balance ORDER BY t.id DESC))[1] as balance,
                    SUM(CASE WHEN at.direction = 'FROM' THEN -t.amount WHEN at.direction = 'TO' THEN t.amount ELSE 0 END) as change
                FROM account_transfer at
                INNER JOIN transfer t ON at.transfer_id = t.id
                GROUP BY day, at.account_id
            )
            SELECT 
                day as timestamp,
                SUM(CASE WHEN balance > 0 AND change = balance THEN 1 WHEN balance = 0 AND change < 0 THEN -1 ELSE 0 END) AS delta
            FROM daily_data
            GROUP BY day
            ORDER BY day;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_holders_count_daily_timestamp_idx ON mv_holders_count_daily(timestamp);`)

        // Locked value daily
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_locked_value_hourly;`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_locked_value_daily AS
            SELECT
                date_bin('1 day', t.timestamp, '2001-01-01'::timestamp) AS timestamp,
                SUM(CASE WHEN t.type = 'DEPOSIT' THEN t.amount WHEN t.type = 'WITHDRAW' THEN -t.amount ELSE 0 END) AS delta
            FROM transfer t
            WHERE t.type IN ('DEPOSIT', 'WITHDRAW')
            GROUP BY 1
            ORDER BY 1;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_locked_value_daily_timestamp_idx ON mv_locked_value_daily(timestamp);`)

        // Active workers daily
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_active_workers_hourly;`)
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_unique_operators_hourly;`)
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_delegations_hourly;`)
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_delegators_hourly;`)
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

        // Transfers by type daily
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_transfers_by_type_hourly;`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_transfers_by_type_daily AS
            SELECT 
                date_bin('1 day', timestamp, '2001-01-01'::timestamp) as timestamp,
                count(*) FILTER (WHERE type = 'DEPOSIT') AS deposit,
                count(*) FILTER (WHERE type = 'WITHDRAW') AS withdraw,
                count(*) FILTER (WHERE type = 'CLAIM') AS reward,
                count(*) FILTER (WHERE type = 'RELEASE') AS release,
                count(*) FILTER (WHERE type NOT IN ('DEPOSIT', 'WITHDRAW', 'CLAIM', 'RELEASE')) AS transfer
            FROM transfer
            GROUP BY 1
            ORDER BY 1;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_transfers_by_type_daily_timestamp_idx ON mv_transfers_by_type_daily(timestamp);`)

        // Unique accounts daily
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_unique_accounts_hourly;`)
        await db.query(`
            CREATE MATERIALIZED VIEW mv_unique_accounts_daily AS
            SELECT 
                date_bin('1 day', t.timestamp, '2001-01-01'::timestamp) as timestamp,
                COUNT(DISTINCT at.account_id) as value
            FROM transfer t
            INNER JOIN account_transfer at ON at.transfer_id = t.id
            GROUP BY 1
            ORDER BY 1;
        `)
        await db.query(`CREATE UNIQUE INDEX mv_unique_accounts_daily_timestamp_idx ON mv_unique_accounts_daily(timestamp);`)

        // Queries daily
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_queries_hourly;`)
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_served_data_hourly;`)
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_stored_data_hourly;`)
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_uptime_hourly;`)
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
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_reward_hourly;`)
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

        // APR daily - compute overall median across ALL workers (not per-worker)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_apr_hourly;`)
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
        // Drop daily views
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_apr_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_reward_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_uptime_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_stored_data_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_served_data_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_queries_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_unique_accounts_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_transfers_by_type_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_delegators_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_delegations_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_unique_operators_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_active_workers_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_locked_value_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_holders_count_daily;`)
    }
}

