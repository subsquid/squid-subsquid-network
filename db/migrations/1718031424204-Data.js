module.exports = class Data1718031424204 {
    name = 'Data1718031424204'

    async up(db) {
        await db.query(`ALTER TABLE "statistics" ADD "utilized_stake" numeric NOT NULL DEFAULT 0`)
        await db.query(`ALTER TABLE "statistics" ADD "base_apr" numeric NOT NULL DEFAULT 0`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "statistics" DROP COLUMN "utilized_stake"`)
        await db.query(`ALTER TABLE "statistics" DROP COLUMN "base_apr"`)
    }
}
