const {rollbackBlock} = require('@subsquid/typeorm-store/lib/hot')

module.exports = class Data1749717258717 {
    name = 'Data1749717258717'

    async up(db) {
        const blocks = await db.query(`SELECT hash, height FROM ${schema}.hot_block WHERE height >= 200 ORDER BY height`)
        for (let i = blocks.length - 1; i >= 0; i--) {
            await rollbackBlock('schema', db.em, blocks[i].height)
        }

        // ...
    }

    async down(db) {
                // ...
    }
}
