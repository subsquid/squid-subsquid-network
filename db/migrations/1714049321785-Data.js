module.exports = class Data1714049321785 {
    name = 'Data1714049321785'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_5c67cbcf4960c1a39e5fe25e87" ON "block" ("timestamp") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_5c67cbcf4960c1a39e5fe25e87"`)
    }
}
