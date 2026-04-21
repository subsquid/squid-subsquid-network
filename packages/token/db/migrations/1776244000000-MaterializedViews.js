module.exports = class MaterializedViews1776244000000 {
    name = 'MaterializedViews1776244000000'

    async up(db) {
        // Holders count daily
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

        // Transfers by type daily
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
    }

    async down(db) {
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_unique_accounts_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_transfers_by_type_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_locked_value_daily;`)
        await db.query(`DROP MATERIALIZED VIEW IF EXISTS mv_holders_count_daily;`)
    }
}
