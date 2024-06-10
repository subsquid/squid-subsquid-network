module.exports = class Data1718014424529 {
    name = 'Data1718014424529'

    async up(db) {
        await db.query(`ALTER TABLE "worker" ADD "traffic_weight" numeric`)
        await db.query(`ALTER TABLE "worker" ADD "liveness" numeric`)
        await db.query(`ALTER TABLE "worker" ADD "d_tenure" numeric`)
        await db.query(`ALTER TABLE "worker" ALTER COLUMN "caped_delegation" DROP DEFAULT`)
        await db.query(`ALTER TABLE "worker" ALTER COLUMN "total_delegation_rewards" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "worker" DROP COLUMN "traffic_weight"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "liveness"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "d_tenure"`)
        await db.query(`ALTER TABLE "worker" ALTER COLUMN "caped_delegation" SET DEFAULT '0'`)
        await db.query(`ALTER TABLE "worker" ALTER COLUMN "total_delegation_rewards" SET DEFAULT '0'`)
    }
}
