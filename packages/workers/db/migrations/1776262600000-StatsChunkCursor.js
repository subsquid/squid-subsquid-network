module.exports = class StatsChunkCursor1776262600000 {
    name = 'StatsChunkCursor1776262600000'

    async up(db) {
        await db.query(`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "stats_chunk_cursor" TIMESTAMP WITH TIME ZONE`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "settings" DROP COLUMN IF EXISTS "stats_chunk_cursor"`)
    }
}
