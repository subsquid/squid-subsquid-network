module.exports = class Data1707373762462 {
    name = 'Data1707373762462'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_238c27058f0c591ae15f48d521"`)
        await db.query(`ALTER TABLE "gateway_stake" DROP CONSTRAINT "FK_238c27058f0c591ae15f48d5213"`)
        await db.query(`ALTER TABLE "gateway_stake" DROP CONSTRAINT "REL_238c27058f0c591ae15f48d521"`)
        await db.query(`CREATE INDEX "IDX_238c27058f0c591ae15f48d521" ON "gateway_stake" ("operator_id") `)
        await db.query(`ALTER TABLE "gateway_stake" ADD CONSTRAINT "FK_238c27058f0c591ae15f48d5213" FOREIGN KEY ("operator_id") REFERENCES "gateway_operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`CREATE UNIQUE INDEX "IDX_238c27058f0c591ae15f48d521" ON "gateway_stake" ("operator_id") `)
        await db.query(`ALTER TABLE "gateway_stake" ADD CONSTRAINT "FK_238c27058f0c591ae15f48d5213" FOREIGN KEY ("operator_id") REFERENCES "gateway_operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "gateway_stake" ADD CONSTRAINT "REL_238c27058f0c591ae15f48d521" UNIQUE ("operator_id")`)
        await db.query(`DROP INDEX "public"."IDX_238c27058f0c591ae15f48d521"`)
        await db.query(`ALTER TABLE "gateway_stake" DROP CONSTRAINT "FK_238c27058f0c591ae15f48d5213"`)
    }
}
