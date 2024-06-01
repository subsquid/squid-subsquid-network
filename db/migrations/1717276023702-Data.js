module.exports = class Data1717276023702 {
    name = 'Data1717276023702'

    async up(db) {
        await db.query(`ALTER TABLE "worker" ADD "apr_diff" numeric`)
        await db.query(`ALTER TABLE "worker" ADD "staker_apr_diff" numeric`)
        await db.query(`ALTER TABLE "commitment" ALTER COLUMN "from" SET NOT NULL`)
        await db.query(`ALTER TABLE "commitment" ALTER COLUMN "to" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "worker" DROP COLUMN "apr_diff"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "staker_apr_diff"`)
        await db.query(`ALTER TABLE "commitment" ALTER COLUMN "from" DROP NOT NULL`)
        await db.query(`ALTER TABLE "commitment" ALTER COLUMN "to" DROP NOT NULL`)
    }
}
