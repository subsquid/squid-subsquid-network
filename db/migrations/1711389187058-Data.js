module.exports = class Data1711389187058 {
    name = 'Data1711389187058'

    async up(db) {
        await db.query(`ALTER TABLE "account" ALTER COLUMN "claimable_delegation_count" DROP DEFAULT`)
        await db.query(`CREATE INDEX "IDX_bce676e2b005104ccb768495db" ON "block" ("height") `)
        await db.query(`CREATE INDEX "IDX_535a3327ee25aecaddf59a3c2d" ON "block" ("l1_block_number") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account" ALTER COLUMN "claimable_delegation_count" SET DEFAULT '0'`)
        await db.query(`DROP INDEX "public"."IDX_bce676e2b005104ccb768495db"`)
        await db.query(`DROP INDEX "public"."IDX_535a3327ee25aecaddf59a3c2d"`)
    }
}
