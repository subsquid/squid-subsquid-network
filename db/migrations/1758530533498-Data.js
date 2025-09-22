module.exports = class Data1758530533498 {
    name = 'Data1758530533498'

    async up(db) {
        await db.query(`CREATE TABLE "temporary_holding_data" ("id" character varying NOT NULL, "unlocked_at" TIMESTAMP WITH TIME ZONE NOT NULL, "locked" boolean NOT NULL, "account_id" character varying, "beneficiary_id" character varying, "admin_id" character varying, CONSTRAINT "PK_3816d4eca2be30f69d19b09d17d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5e7505aade426b0d0fc9fe9514" ON "temporary_holding_data" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_a47c35a821de820205a435fdf5" ON "temporary_holding_data" ("beneficiary_id") `)
        await db.query(`CREATE INDEX "IDX_1900137cde7e4fc86cb4d7240c" ON "temporary_holding_data" ("admin_id") `)
        await db.query(`ALTER TABLE "temporary_holding_data" ADD CONSTRAINT "FK_5e7505aade426b0d0fc9fe95143" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "temporary_holding_data" ADD CONSTRAINT "FK_a47c35a821de820205a435fdf53" FOREIGN KEY ("beneficiary_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "temporary_holding_data" ADD CONSTRAINT "FK_1900137cde7e4fc86cb4d7240c2" FOREIGN KEY ("admin_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "temporary_holding_data"`)
        await db.query(`DROP INDEX "public"."IDX_5e7505aade426b0d0fc9fe9514"`)
        await db.query(`DROP INDEX "public"."IDX_a47c35a821de820205a435fdf5"`)
        await db.query(`DROP INDEX "public"."IDX_1900137cde7e4fc86cb4d7240c"`)
        await db.query(`ALTER TABLE "temporary_holding_data" DROP CONSTRAINT "FK_5e7505aade426b0d0fc9fe95143"`)
        await db.query(`ALTER TABLE "temporary_holding_data" DROP CONSTRAINT "FK_a47c35a821de820205a435fdf53"`)
        await db.query(`ALTER TABLE "temporary_holding_data" DROP CONSTRAINT "FK_1900137cde7e4fc86cb4d7240c2"`)
    }
}
