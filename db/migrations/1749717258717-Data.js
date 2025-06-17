module.exports = class Data1749717258717 {
    name = 'Data1749717258717'

    async up(db) {
        await db.query(`CREATE TABLE "worker_metrics" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "uptime" numeric NOT NULL, "pings" integer NOT NULL, "stored_data" numeric NOT NULL, "queries" integer NOT NULL, "served_data" numeric NOT NULL, "scanned_data" numeric NOT NULL, "worker_id" character varying, CONSTRAINT "PK_312b3d0080db5bd9edc23a14dfe" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_fb67d3f4ec48a1fdc047f59096" ON "worker_metrics" ("worker_id") `)
        await db.query(`ALTER TABLE "worker_metrics" ADD CONSTRAINT "FK_fb67d3f4ec48a1fdc047f590964" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "worker_metrics"`)
        await db.query(`DROP INDEX "public"."IDX_fb67d3f4ec48a1fdc047f59096"`)
        await db.query(`ALTER TABLE "worker_metrics" DROP CONSTRAINT "FK_fb67d3f4ec48a1fdc047f590964"`)
    }
}
