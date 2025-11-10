module.exports = class AddWorkerMetricsPingsIndex1700000000000 {
    name = 'AddWorkerMetricsPingsIndex1700000000000'

    async up(db) {
        // Partial index for filtering by timestamp where pings > 0
        // This significantly speeds up the online_workers CTE
        await db.query(`
            CREATE INDEX CONCURRENTLY "IDX_worker_metrics_timestamp_with_pings" 
            ON "worker_metrics" ("timestamp") 
            WHERE "pings" > 0
        `)
        
        // Optional covering index - uncomment if needed for even better performance
        // This avoids table lookups by including worker_id in the index
        // await db.query(`
        //     CREATE INDEX CONCURRENTLY "IDX_worker_metrics_online_workers_covering" 
        //     ON "worker_metrics" ("timestamp", "worker_id") 
        //     WHERE "pings" > 0
        // `)
    }

    async down(db) {
        await db.query(`DROP INDEX CONCURRENTLY IF EXISTS "public"."IDX_worker_metrics_timestamp_with_pings"`)
        // await db.query(`DROP INDEX CONCURRENTLY IF EXISTS "public"."IDX_worker_metrics_online_workers_covering"`)
    }
}




