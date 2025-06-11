CREATE TABLE "worker_status_change" (
    "id" character varying NOT NULL,
    "status" character varying(13) NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE,
        "block_number" integer NOT NULL,
        "pending" boolean NOT NULL,
        "worker_id" character varying,
        CONSTRAINT "PK_174b401e6a49e199eea906b80e9" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_781f6f86812e77872e827413b1" ON "worker_status_change" ("worker_id");

CREATE TABLE "worker_reward" (
    "id" character varying NOT NULL,
    "block_number" integer NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "amount" numeric NOT NULL,
        "apr" numeric NOT NULL,
        "stakers_reward" numeric NOT NULL,
        "staker_apr" numeric NOT NULL,
        "worker_id" character varying,
        CONSTRAINT "PK_7ea70b281e8087ff4bb71aab3d8" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_6565476328c3be035aff2f90d7" ON "worker_reward" ("timestamp");

CREATE INDEX "IDX_fa42e338941c40a038366b5ce4" ON "worker_reward" ("worker_id");

CREATE TABLE "epoch" (
    "id" character varying NOT NULL,
    "number" integer NOT NULL,
    "start" integer NOT NULL,
    "started_at" TIMESTAMP
    WITH
        TIME ZONE,
        "end" integer NOT NULL,
        "ended_at" TIMESTAMP
    WITH
        TIME ZONE,
        "status" character varying(7) NOT NULL,
        "active_worker_ids" text array,
        CONSTRAINT "PK_247e7fe519fa359ba924d04f289" PRIMARY KEY ("id")
);

CREATE TABLE "worker_snapshot" (
    "id" character varying NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "uptime" numeric NOT NULL,
        "worker_id" character varying,
        "epoch_id" character varying,
        CONSTRAINT "PK_5140a438c3891406b7420770cb9" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_01768e88a94de867b21107e7a7" ON "worker_snapshot" ("worker_id");

CREATE INDEX "IDX_b96c30297608ee401e3c796ec3" ON "worker_snapshot" ("epoch_id");

CREATE TABLE "worker" (
    "id" character varying NOT NULL,
    "peer_id" text NOT NULL,
    "bond" numeric NOT NULL,
    "created_at" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "locked" boolean,
        "lock_start" integer,
        "lock_end" integer,
        "name" text,
        "website" text,
        "email" text,
        "description" text,
        "status" character varying(13) NOT NULL,
        "claimable_reward" numeric NOT NULL,
        "claimed_reward" numeric NOT NULL,
        "apr" numeric,
        "staker_apr" numeric,
        "total_delegation" numeric NOT NULL,
        "caped_delegation" numeric NOT NULL,
        "delegation_count" integer NOT NULL,
        "total_delegation_rewards" numeric NOT NULL,
        "online" boolean,
        "dial_ok" boolean,
        "jailed" boolean,
        "jail_reason" text,
        "version" text,
        "stored_data" numeric,
        "queries24_hours" numeric,
        "queries90_days" numeric,
        "served_data24_hours" numeric,
        "served_data90_days" numeric,
        "scanned_data24_hours" numeric,
        "scanned_data90_days" numeric,
        "uptime24_hours" numeric,
        "uptime90_days" numeric,
        "traffic_weight" numeric,
        "liveness" numeric,
        "d_tenure" numeric,
        "day_uptimes" jsonb,
        "owner_id" character varying,
        "real_owner_id" character varying,
        CONSTRAINT "PK_dc8175fa0e34ce7a39e4ec73b94" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_0706da42d7da5b3e9ddf177445" ON "worker" ("peer_id");

CREATE INDEX "IDX_f694fda42f7d5548c530287837" ON "worker" ("owner_id");

CREATE INDEX "IDX_2b9e8be9236e3b6234ac0eac0a" ON "worker" ("real_owner_id");

CREATE INDEX "IDX_afa7b8a424170c7b519cad070b" ON "worker" ("online");

CREATE INDEX "IDX_b0a36a276448c0c369428b5233" ON "worker" ("id", "real_owner_id");

CREATE INDEX "IDX_6c8330113fa75ee2a41a50bba6" ON "worker" ("id", "created_at", "status");

CREATE TABLE "delegation_status_change" (
    "id" character varying NOT NULL,
    "status" character varying(9) NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE,
        "block_number" integer NOT NULL,
        "pending" boolean NOT NULL,
        "delegation_id" character varying,
        CONSTRAINT "PK_7041725071b819af20734e60fba" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_f215283c158a26ba32767f9051" ON "delegation_status_change" ("delegation_id");

CREATE TABLE "delegation_reward" (
    "id" character varying NOT NULL,
    "block_number" integer NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "amount" numeric NOT NULL,
        "apr" numeric NOT NULL,
        "delegation_id" character varying,
        CONSTRAINT "PK_1d2b3ee14b444f77bfa82d91601" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_aac18cf37b0d8daac4d8374104" ON "delegation_reward" ("timestamp");

CREATE INDEX "IDX_9b6725fd46d4f73e50c437fead" ON "delegation_reward" ("delegation_id");

CREATE TABLE "delegation" (
    "id" character varying NOT NULL,
    "status" character varying(9) NOT NULL,
    "deposit" numeric NOT NULL,
    "locked" boolean,
    "lock_start" integer,
    "lock_end" integer,
    "claimable_reward" numeric NOT NULL,
    "claimed_reward" numeric NOT NULL,
    "owner_id" character varying,
    "real_owner_id" character varying,
    "worker_id" character varying,
    CONSTRAINT "PK_a2cb6c9b942d68b109131beab44" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_4cad60806071170f1022e206b2" ON "delegation" ("owner_id");

CREATE INDEX "IDX_2c1d740ba7239fdba1520d4e9f" ON "delegation" ("real_owner_id");

CREATE INDEX "IDX_cf70e6312546e7e6d0e5ac5bea" ON "delegation" ("worker_id");

CREATE INDEX "IDX_ce6820a70b5ec7eb73d9cfea3d" ON "delegation" ("id", "real_owner_id");

CREATE TABLE "gateway_status_change" (
    "id" character varying NOT NULL,
    "status" character varying(12) NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE,
        "block_number" integer NOT NULL,
        "gateway_id" character varying,
        CONSTRAINT "PK_d1a672c08322f4adf5fdb152f42" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_70339c4e33f0eea17598ebd218" ON "gateway_status_change" ("gateway_id");

CREATE TABLE "gateway" (
    "id" character varying NOT NULL,
    "created_at" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "status" character varying(12) NOT NULL,
        "name" text,
        "website" text,
        "email" text,
        "description" text,
        "endpoint_url" text,
        "owner_id" character varying,
        "real_owner_id" character varying,
        "stake_id" character varying,
        CONSTRAINT "PK_22c5b7ecdd6313de143815f9991" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_96e763858e395ca5d21257543b" ON "gateway" ("owner_id");

CREATE INDEX "IDX_552709a55697b67c4fdf7e262b" ON "gateway" ("real_owner_id");

CREATE INDEX "IDX_3ee2bb729914d8b6ae595b47d3" ON "gateway" ("stake_id");

CREATE TABLE "gateway_stake" (
    "id" character varying NOT NULL,
    "auto_extension" boolean NOT NULL,
    "amount" numeric NOT NULL,
    "computation_units" numeric NOT NULL,
    "computation_units_pending" numeric,
    "locked" boolean NOT NULL,
    "lock_start" integer,
    "lock_end" integer,
    "owner_id" character varying,
    "real_owner_id" character varying,
    CONSTRAINT "PK_3ee2bb729914d8b6ae595b47d35" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_c638851a0d3e4eaee443c054d0" ON "gateway_stake" ("owner_id");

CREATE INDEX "IDX_6ce9ac8fe1ba9315c8e05d46fd" ON "gateway_stake" ("real_owner_id");

CREATE TABLE "transfer" (
    "id" character varying NOT NULL,
    "block_number" integer NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "tx_hash" text NOT NULL,
        "type" character varying(8) NOT NULL,
        "amount" numeric NOT NULL,
        "from_id" character varying,
        "to_id" character varying,
        "delegation_id" character varying,
        "worker_id" character varying,
        "gateway_stake_id" character varying,
        "vesting_id" character varying,
        CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_70ff8b624c3118ac3a4862d22c" ON "transfer" ("timestamp");

CREATE INDEX "IDX_f605a03972b4f28db27a0ee70d" ON "transfer" ("tx_hash");

CREATE INDEX "IDX_76bdfed1a7eb27c6d8ecbb7349" ON "transfer" ("from_id");

CREATE INDEX "IDX_0751309c66e97eac9ef1149362" ON "transfer" ("to_id");

CREATE INDEX "IDX_47501c21ae9856de69db7e5eed" ON "transfer" ("delegation_id");

CREATE INDEX "IDX_c01c16aa30a8f62c6726350645" ON "transfer" ("worker_id");

CREATE INDEX "IDX_d53aa78bdf21697e2105fb3fbe" ON "transfer" ("gateway_stake_id");

CREATE INDEX "IDX_b62e1549fb545499452aeb36ec" ON "transfer" ("vesting_id");

CREATE TABLE "account_transfer" (
    "id" character varying NOT NULL,
    "direction" character varying(4) NOT NULL,
    "account_id" character varying,
    "transfer_id" character varying,
    CONSTRAINT "PK_3b959a286b97fc83be6cec239a9" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_d5240d17696e229585da974641" ON "account_transfer" ("account_id");

CREATE INDEX "IDX_2c2313461bd6c19983900ef539" ON "account_transfer" ("transfer_id");

CREATE TABLE "account" (
    "id" character varying NOT NULL,
    "type" character varying(17) NOT NULL,
    "balance" numeric NOT NULL,
    "claimable_delegation_count" integer NOT NULL,
    "owner_id" character varying,
    CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_7e86daab9d155ec4cc3fd65445" ON "account" ("owner_id");

CREATE TABLE "settings" (
    "id" character varying NOT NULL,
    "bond_amount" numeric,
    "delegation_limit_coefficient" numeric NOT NULL,
    "epoch_length" integer,
    "minimal_worker_version" text,
    "recommended_worker_version" text,
    "lock_period" integer,
    "contracts" jsonb NOT NULL,
    "current_epoch" integer,
    "utilized_stake" numeric NOT NULL,
    "base_apr" numeric NOT NULL,
    CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")
);

CREATE TABLE "commitment" (
    "id" character varying NOT NULL,
    "from" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "from_block" integer NOT NULL,
        "to" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "to_block" integer NOT NULL,
        "recipients" jsonb NOT NULL,
        CONSTRAINT "PK_7a0899978d100f72269b3045d7e" PRIMARY KEY ("id")
);

CREATE TABLE "block" (
    "id" character varying NOT NULL,
    "hash" text NOT NULL,
    "height" integer NOT NULL,
    "timestamp" TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        "l1_block_number" integer NOT NULL,
        CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id")
);

CREATE INDEX "IDX_bce676e2b005104ccb768495db" ON "block" ("height");

CREATE INDEX "IDX_5c67cbcf4960c1a39e5fe25e87" ON "block" ("timestamp");

CREATE INDEX "IDX_535a3327ee25aecaddf59a3c2d" ON "block" ("l1_block_number");

CREATE TABLE "queue" (
    "id" character varying NOT NULL,
    "tasks" jsonb NOT NULL,
    CONSTRAINT "PK_4adefbd9c73b3f9a49985a5529f" PRIMARY KEY ("id")
);

ALTER TABLE "worker_status_change"
ADD CONSTRAINT "FK_781f6f86812e77872e827413b17" FOREIGN KEY ("worker_id") REFERENCES "worker" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "worker_reward"
ADD CONSTRAINT "FK_fa42e338941c40a038366b5ce46" FOREIGN KEY ("worker_id") REFERENCES "worker" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "worker_snapshot"
ADD CONSTRAINT "FK_01768e88a94de867b21107e7a7a" FOREIGN KEY ("worker_id") REFERENCES "worker" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "worker_snapshot"
ADD CONSTRAINT "FK_b96c30297608ee401e3c796ec37" FOREIGN KEY ("epoch_id") REFERENCES "epoch" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "worker"
ADD CONSTRAINT "FK_f694fda42f7d5548c5302878374" FOREIGN KEY ("owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "worker"
ADD CONSTRAINT "FK_2b9e8be9236e3b6234ac0eac0a9" FOREIGN KEY ("real_owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "delegation_status_change"
ADD CONSTRAINT "FK_f215283c158a26ba32767f9051f" FOREIGN KEY ("delegation_id") REFERENCES "delegation" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "delegation_reward"
ADD CONSTRAINT "FK_9b6725fd46d4f73e50c437feade" FOREIGN KEY ("delegation_id") REFERENCES "delegation" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "delegation"
ADD CONSTRAINT "FK_4cad60806071170f1022e206b29" FOREIGN KEY ("owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "delegation"
ADD CONSTRAINT "FK_2c1d740ba7239fdba1520d4e9fb" FOREIGN KEY ("real_owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "delegation"
ADD CONSTRAINT "FK_cf70e6312546e7e6d0e5ac5bea6" FOREIGN KEY ("worker_id") REFERENCES "worker" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "gateway_status_change"
ADD CONSTRAINT "FK_70339c4e33f0eea17598ebd218d" FOREIGN KEY ("gateway_id") REFERENCES "gateway" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "gateway"
ADD CONSTRAINT "FK_96e763858e395ca5d21257543b4" FOREIGN KEY ("owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "gateway"
ADD CONSTRAINT "FK_552709a55697b67c4fdf7e262b7" FOREIGN KEY ("real_owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "gateway"
ADD CONSTRAINT "FK_3ee2bb729914d8b6ae595b47d35" FOREIGN KEY ("stake_id") REFERENCES "gateway_stake" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "gateway_stake"
ADD CONSTRAINT "FK_c638851a0d3e4eaee443c054d01" FOREIGN KEY ("owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "gateway_stake"
ADD CONSTRAINT "FK_6ce9ac8fe1ba9315c8e05d46fde" FOREIGN KEY ("real_owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "transfer"
ADD CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496" FOREIGN KEY ("from_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "transfer"
ADD CONSTRAINT "FK_0751309c66e97eac9ef11493623" FOREIGN KEY ("to_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "transfer"
ADD CONSTRAINT "FK_47501c21ae9856de69db7e5eed5" FOREIGN KEY ("delegation_id") REFERENCES "delegation" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "transfer"
ADD CONSTRAINT "FK_c01c16aa30a8f62c6726350645a" FOREIGN KEY ("worker_id") REFERENCES "worker" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "transfer"
ADD CONSTRAINT "FK_d53aa78bdf21697e2105fb3fbed" FOREIGN KEY ("gateway_stake_id") REFERENCES "gateway_stake" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "transfer"
ADD CONSTRAINT "FK_b62e1549fb545499452aeb36ece" FOREIGN KEY ("vesting_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "account_transfer"
ADD CONSTRAINT "FK_d5240d17696e229585da974641a" FOREIGN KEY ("account_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "account_transfer"
ADD CONSTRAINT "FK_2c2313461bd6c19983900ef539c" FOREIGN KEY ("transfer_id") REFERENCES "transfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "account"
ADD CONSTRAINT "FK_7e86daab9d155ec4cc3fd654454" FOREIGN KEY ("owner_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Query to show accumulated number of holders over time based on transfer history
WITH daily_balances AS (
    SELECT 
        DATE_TRUNC('day', t.timestamp) as date,
        account_id,
        SUM(CASE 
            WHEN t.to_id = account_id THEN t.amount 
            WHEN t.from_id = account_id THEN -t.amount 
            ELSE 0 
        END) as daily_change
    FROM transfer t
    CROSS JOIN LATERAL (VALUES (t.from_id), (t.to_id)) AS accounts(account_id)
    GROUP BY DATE_TRUNC('day', t.timestamp), account_id
),
running_balances AS (
    SELECT 
        date,
        account_id,
        SUM(daily_change) OVER (PARTITION BY account_id ORDER BY date) as balance
    FROM daily_balances
),
holder_counts AS (
    SELECT 
        date,
        COUNT(DISTINCT account_id) FILTER (WHERE balance > 0) OVER (ORDER BY date) as holder_count
    FROM running_balances
    GROUP BY date, account_id, balance
    ORDER BY date
)
SELECT DISTINCT
    date,
    holder_count,
    LAG(holder_count) OVER (ORDER BY date) as previous_count,
    holder_count - LAG(holder_count) OVER (ORDER BY date) as change
FROM holder_counts;