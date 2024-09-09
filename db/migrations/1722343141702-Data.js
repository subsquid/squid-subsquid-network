module.exports = class Data1722343141702 {
    name = 'Data1722343141702'

    async up(db) {
        await db.query(`ALTER TABLE "statistics" ALTER COLUMN "utilized_stake" DROP DEFAULT`)
        await db.query(`ALTER TABLE "statistics" ALTER COLUMN "base_apr" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "statistics" ALTER COLUMN "utilized_stake" SET DEFAULT '0'`)
        await db.query(`ALTER TABLE "statistics" ALTER COLUMN "base_apr" SET DEFAULT '0'`)
    }
}
