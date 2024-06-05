module.exports = class Data1717397108095 {
    name = 'Data1717397108096'

    async up(db) {
        await db.query(`
            UPDATE account as a SET balance = t.amount_to - t.amount_from
            FROM (
                    SELECT tt.id, tt.amount_to, tf.amount_from FROM (
                        SELECT "to_id" as id, sum(amount) as amount_to
                        FROM transfer
                        GROUP BY "to_id"
                    ) as tt
                    JOIN (
                        SELECT "from_id" as id, sum(amount) as amount_from
                        FROM transfer
                        GROUP BY "from_id"
                    ) as tf ON tt.id = tf.id
                ) as t
            WHERE a.id = t.id
        `)
    }

    async down(db) {
    }
}
