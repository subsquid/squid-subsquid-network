module.exports = class Data1715169647718 {
    name = 'Data1715169647718'

    async up(db) {
        await db.query(`ALTER TABLE "worker" ADD "locked" boolean`)
        await db.query(`ALTER TABLE "worker" ADD "lock_start" integer`)
        await db.query(`ALTER TABLE "worker" ADD "lock_end" integer`)
        await db.query(`UPDATE "worker" SET locked = FALSE`)
        await db.query(`UPDATE "worker" SET locked = TRUE WHERE status NOT IN ('DEREGISTERED', 'WITHDRAWN')`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "worker" DROP COLUMN "locked"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "lock_start"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "lock_end"`)
    }
}
