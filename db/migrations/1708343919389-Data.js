module.exports = class Data1708343919389 {
  name = 'Data1708343919389';

  async up(db) {
    await db.query(
      `ALTER TABLE "account" ADD "claimable_delegation_count" integer NOT NULL DEFAULT 0`,
    );
    await db.query(`UPDATE "account" as "a" SET "claimable_delegation_count" = "d"."count" FROM (
            SELECT "owner_id" as "id", COUNT(*) as "count" FROM "delegation" WHERE "claimable_reward" > 0 GROUP BY "owner_id"
        ) AS "d" WHERE "d"."id" = "a"."id"`);
  }

  async down(db) {
    await db.query(`ALTER TABLE "account" DROP COLUMN "claimable_delegation_count"`);
  }
};
