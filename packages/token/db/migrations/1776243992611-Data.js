module.exports = class Data1776243992611 {
    name = 'Data1776243992611'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "tx_hash" text NOT NULL, "type" character varying(8) NOT NULL, "amount" numeric NOT NULL, "delegation_id" text, "worker_id" text, "gateway_stake_id" text, "vesting_id" text, "portal_pool_id" text, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_70ff8b624c3118ac3a4862d22c" ON "transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_f605a03972b4f28db27a0ee70d" ON "transfer" ("tx_hash") `)
        await db.query(`CREATE INDEX "IDX_76bdfed1a7eb27c6d8ecbb7349" ON "transfer" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_0751309c66e97eac9ef1149362" ON "transfer" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_1aff365fd1d4a8af30de6bd643" ON "transfer" ("type", "timestamp") `)
        await db.query(`CREATE TABLE "account_transfer" ("id" character varying NOT NULL, "direction" character varying(4) NOT NULL, "balance" numeric NOT NULL, "account_id" character varying, "transfer_id" character varying, CONSTRAINT "PK_3b959a286b97fc83be6cec239a9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2c2313461bd6c19983900ef539" ON "account_transfer" ("transfer_id") `)
        await db.query(`CREATE INDEX "IDX_cb649c52deb6d23513868c0f5c" ON "account_transfer" ("account_id", "transfer_id") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "type" character varying(17) NOT NULL, "balance" numeric NOT NULL, "claimable_delegation_count" integer NOT NULL, "owner_id" character varying, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7e86daab9d155ec4cc3fd65445" ON "account" ("owner_id") `)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_0751309c66e97eac9ef11493623" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "account_transfer" ADD CONSTRAINT "FK_d5240d17696e229585da974641a" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "account_transfer" ADD CONSTRAINT "FK_2c2313461bd6c19983900ef539c" FOREIGN KEY ("transfer_id") REFERENCES "transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_7e86daab9d155ec4cc3fd654454" FOREIGN KEY ("owner_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_70ff8b624c3118ac3a4862d22c"`)
        await db.query(`DROP INDEX "public"."IDX_f605a03972b4f28db27a0ee70d"`)
        await db.query(`DROP INDEX "public"."IDX_76bdfed1a7eb27c6d8ecbb7349"`)
        await db.query(`DROP INDEX "public"."IDX_0751309c66e97eac9ef1149362"`)
        await db.query(`DROP INDEX "public"."IDX_1aff365fd1d4a8af30de6bd643"`)
        await db.query(`DROP TABLE "account_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_2c2313461bd6c19983900ef539"`)
        await db.query(`DROP INDEX "public"."IDX_cb649c52deb6d23513868c0f5c"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP INDEX "public"."IDX_7e86daab9d155ec4cc3fd65445"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_0751309c66e97eac9ef11493623"`)
        await db.query(`ALTER TABLE "account_transfer" DROP CONSTRAINT "FK_d5240d17696e229585da974641a"`)
        await db.query(`ALTER TABLE "account_transfer" DROP CONSTRAINT "FK_2c2313461bd6c19983900ef539c"`)
        await db.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_7e86daab9d155ec4cc3fd654454"`)
    }
}
