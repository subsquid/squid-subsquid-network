module.exports = class Data1717597394208 {
    name = 'Data1717597394208'

    async up(db) {
        await db.query(`ALTER TABLE "worker" ADD "caped_delegation" numeric NOT NULL DEFAULT 0`)
        await db.query(`ALTER TABLE "worker" ADD "total_delegation_rewards" numeric NOT NULL DEFAULT 0`)
        await db.query(`
            UPDATE "worker" as w SET "total_delegation_rewards" = "r"."amount"
            FROM (SELECT worker_id as id, sum(stakers_reward) as amount FROM worker_reward GROUP BY worker_id) as r
            WHERE w.id = r.id
        `)
        await db.query(`ALTER TABLE "worker" ALTER COLUMN "caped_delegation" DROP DEFAULT`)
        await db.query(`ALTER TABLE "worker" ALTER COLUMN "total_delegation_rewards" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "worker" DROP COLUMN "caped_delegation"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "total_delegation_rewards"`)
    }
}
