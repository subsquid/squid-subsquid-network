module.exports = class Data1717243090598 {
    name = 'Data1717243090598'

    async up(db) {
        await db.query(`ALTER TABLE "commitment" RENAME "from" TO "from_block"`)
        await db.query(`ALTER TABLE "commitment" RENAME "to" TO "to_block"`)
        await db.query(`ALTER TABLE "commitment" ADD "from" TIMESTAMP WITH TIME ZONE`)
        await db.query(`ALTER TABLE "commitment" ADD "to" TIMESTAMP WITH TIME ZONE`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "commitment" DROP COLUMN "from"`)
        await db.query(`ALTER TABLE "commitment" DROP COLUMN "to"`)
        await db.query(`ALTER TABLE "commitment" RENAME COLUMN "from_block" TO "from"`)
        await db.query(`ALTER TABLE "commitment" RENAME COLUMN "to_block" TO "to"`)
    }
}
