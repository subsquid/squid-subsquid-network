module.exports = class Data1773740615463 {
    name = 'Data1773740615463'

    async up(db) {
        await db.query(`ALTER TABLE "block" ALTER COLUMN "l1_block_number" DROP NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "block" ALTER COLUMN "l1_block_number" SET NOT NULL`)
    }
}
