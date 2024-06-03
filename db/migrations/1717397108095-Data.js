module.exports = class Data1717397108095 {
    name = 'Data1717397108095'

    async up(db) {
        await db.query(`ALTER TABLE "worker" DROP COLUMN "apr_diff"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "staker_apr_diff"`)
        await db.query(`ALTER TABLE "settings" ADD "minimal_worker_version" text`)
        await db.query(`ALTER TABLE "settings" ADD "recommended_worker_version" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "worker" ADD "apr_diff" numeric`)
        await db.query(`ALTER TABLE "worker" ADD "staker_apr_diff" numeric`)
        await db.query(`ALTER TABLE "settings" DROP COLUMN "minimal_worker_version"`)
        await db.query(`ALTER TABLE "settings" DROP COLUMN "recommended_worker_version"`)
    }
}
