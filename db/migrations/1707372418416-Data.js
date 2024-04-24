module.exports = class Data1707372418416 {
    name = 'Data1707372418416'

    async up(db) {
        await db.query(`ALTER TABLE "gateway_stake" DROP COLUMN "duration"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "gateway_stake" ADD "duration" integer NOT NULL`)
    }
}
