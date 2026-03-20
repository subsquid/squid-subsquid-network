module.exports = class Data1773656681335 {
    name = 'Data1773656681335'

    async up(db) {
        await db.query(`CREATE TABLE "portal_pool" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at_block" integer NOT NULL, "reward_token" text NOT NULL, "capacity" numeric NOT NULL, "distribution_rate_per_second" numeric NOT NULL, "initial_deposit" numeric NOT NULL, "token_suffix" text NOT NULL, "metadata" text, "operator_id" character varying, CONSTRAINT "PK_7944f19bf83b7cbb39659e4c1d1" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_17dd498e160a11eb5222586891" ON "portal_pool" ("operator_id") `)
        await db.query(`ALTER TABLE "transfer" ADD "portal_pool_id" character varying`)
        await db.query(`CREATE INDEX "IDX_a5b4fe785212fb44773a9c056e" ON "transfer" ("portal_pool_id") `)
        await db.query(`ALTER TABLE "portal_pool" ADD CONSTRAINT "FK_17dd498e160a11eb52225868919" FOREIGN KEY ("operator_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_a5b4fe785212fb44773a9c056e3" FOREIGN KEY ("portal_pool_id") REFERENCES "portal_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "portal_pool"`)
        await db.query(`DROP INDEX "public"."IDX_17dd498e160a11eb5222586891"`)
        await db.query(`ALTER TABLE "transfer" DROP COLUMN "portal_pool_id"`)
        await db.query(`DROP INDEX "public"."IDX_a5b4fe785212fb44773a9c056e"`)
        await db.query(`ALTER TABLE "portal_pool" DROP CONSTRAINT "FK_17dd498e160a11eb52225868919"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_a5b4fe785212fb44773a9c056e3"`)
    }
}
