module.exports = class Data1711389187059 {
    name = 'Data1711389187059'

    async up(db) {
        await db.query(`ALTER TABLE "worker_reward" DROP COLUMN IF EXISTS "apr"`)
        await db.query(`ALTER TABLE "worker_reward" DROP COLUMN IF EXISTS "staker_apr"`)
    }

    async down(db) {

    }
}
