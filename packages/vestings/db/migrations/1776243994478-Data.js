module.exports = class Data1776243994478 {
    name = 'Data1776243994478'

    async up(db) {
        await db.query(`CREATE TABLE "vesting" ("id" character varying NOT NULL, "beneficiary" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_35d441f205bf5bffdd2af4ca66f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2817db81ab5fd32de1652f5b54" ON "vesting" ("beneficiary") `)
        await db.query(`CREATE TABLE "temporary_holding" ("id" character varying NOT NULL, "beneficiary" text NOT NULL, "admin" text NOT NULL, "unlocked_at" TIMESTAMP WITH TIME ZONE NOT NULL, "locked" boolean NOT NULL, CONSTRAINT "PK_a74fe958307e22c87c10ff1c7b7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e6ac1015178cb20fa12d88cac3" ON "temporary_holding" ("beneficiary") `)
        await db.query(`CREATE TABLE "queue" ("id" character varying NOT NULL, "tasks" jsonb NOT NULL, CONSTRAINT "PK_4adefbd9c73b3f9a49985a5529f" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "vesting"`)
        await db.query(`DROP INDEX "public"."IDX_2817db81ab5fd32de1652f5b54"`)
        await db.query(`DROP TABLE "temporary_holding"`)
        await db.query(`DROP INDEX "public"."IDX_e6ac1015178cb20fa12d88cac3"`)
        await db.query(`DROP TABLE "queue"`)
    }
}
