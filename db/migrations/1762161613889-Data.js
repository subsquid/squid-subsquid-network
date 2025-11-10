module.exports = class Data1762161613889 {
    name = 'Data1762161613889'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_6565476328c3be035aff2f90d7"`)
        await db.query(`CREATE INDEX "IDX_9af9a1fd852ce76954ede7593c" ON "worker_reward" ("apr") `)
        await db.query(`CREATE INDEX "IDX_8cba242fb755d97fb17a4ebe00" ON "worker_reward" ("staker_apr") `)
        await db.query(`CREATE INDEX "IDX_20e72fd6d7dd27df6049bff78e" ON "worker_reward" ("timestamp", "staker_apr") `)
        await db.query(`CREATE INDEX "IDX_9ca8a2de4736146cb9d7bc041f" ON "worker_reward" ("timestamp", "apr") `)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_6565476328c3be035aff2f90d7" ON "worker_reward" ("timestamp") `)
        await db.query(`DROP INDEX "public"."IDX_9af9a1fd852ce76954ede7593c"`)
        await db.query(`DROP INDEX "public"."IDX_8cba242fb755d97fb17a4ebe00"`)
        await db.query(`DROP INDEX "public"."IDX_20e72fd6d7dd27df6049bff78e"`)
        await db.query(`DROP INDEX "public"."IDX_9ca8a2de4736146cb9d7bc041f"`)
    }
}
