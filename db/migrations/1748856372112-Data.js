module.exports = class Data1748856372112 {
    name = 'Data1748856372112'

    async up(db) {
        await db.query(`ALTER TABLE "account" ALTER COLUMN "type" TYPE character varying(17)`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account" ALTER COLUMN "type" TYPE character varying(7)`)
    }
}
