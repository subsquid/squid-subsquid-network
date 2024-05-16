module.exports = class Data1715757529983 {
    name = 'Data1715757529983'

    async up(db) {
        await db.query(`ALTER TABLE "worker" ADD "jail_reason" text`)
        await db.query(`ALTER TABLE "worker" ADD "day_uptimes" jsonb`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "worker" DROP COLUMN "jail_reason"`)
        await db.query(`ALTER TABLE "worker" DROP COLUMN "day_uptimes"`)
    }
}
