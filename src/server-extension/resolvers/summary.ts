import assert from 'assert';

import { BigInteger, DateTime } from '@subsquid/graphql-server';
import { defaults, isNil, omitBy } from 'lodash';
import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityManager } from 'typeorm';

@ObjectType()
export class AprSnapshot {
  @Field(() => DateTime, { nullable: false })
  timestamp!: Date;

  @Field(() => Number, { nullable: false })
  stakerApr!: number;

  @Field(() => Number, { nullable: false })
  workerApr!: number;

  constructor({ timestamp, ...props }: AprSnapshot) {
    this.timestamp = new Date(timestamp);
    Object.assign(this, props);
  }
}

@ObjectType()
export class NetworkStats {
  @Field(() => Number, { nullable: false })
  workerApr!: number;

  @Field(() => Number, { nullable: false })
  stakerApr!: number;

  @Field(() => BigInteger, { nullable: false })
  storedData!: bigint;

  @Field(() => BigInteger, { nullable: false })
  queries24Hours!: bigint;

  @Field(() => BigInteger, { nullable: false })
  queries90Days!: bigint;

  @Field(() => BigInteger, { nullable: false })
  servedData24Hours!: bigint;

  @Field(() => BigInteger, { nullable: false })
  servedData90Days!: bigint;

  @Field(() => Number, { nullable: false })
  workersCount!: number;

  @Field(() => Number, { nullable: false })
  onlineWorkersCount!: number;

  @Field(() => BigInteger, { nullable: false })
  totalBond!: bigint;

  @Field(() => BigInteger, { nullable: false })
  totalDelegation!: bigint;

  @Field(() => Number, { nullable: false })
  lastBlock!: number;

  @Field(() => DateTime, { nullable: false })
  lastBlockTimestamp!: Date;

  @Field(() => Number, { nullable: false })
  blockTime!: number;

  @Field(() => Number, { nullable: false })
  lastBlockL1!: number;

  @Field(() => DateTime, { nullable: false, defaultValue: new Date(0) })
  lastBlockTimestampL1!: Date;

  @Field(() => Number, { nullable: false })
  blockTimeL1!: number;

  @Field(() => [AprSnapshot], { nullable: false })
  aprs!: AprSnapshot[];

  constructor({ aprs, ...props }: Partial<NetworkStats>) {
    this.aprs = aprs?.map((apr) => new AprSnapshot(apr)) || [];
    Object.assign(
      this,
      omitBy(props, (v) => isNil(v)),
    );
  }
}

@Resolver()
export class NetworkSummaryResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => NetworkStats)
  async networkStats(): Promise<NetworkStats> {
    const manager = await this.tx();

    return await manager
      .query(
        `
        WITH block_l1 as (
          SELECT l1_block_number as height, min(timestamp) as timestamp FROM public.block GROUP BY l1_block_number ORDER BY height DESC LIMIT 100 
        ),
        block as (
          SELECT height, timestamp as timestamp FROM public.block ORDER BY height DESC LIMIT 100 
        )
        SELECT
          COALESCE(SUM(bond), 0) as "totalBond",
          COALESCE(SUM(total_delegation), 0) as "totalDelegation",
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY apr) FILTER(WHERE apr > 0), 0) as "workerApr",
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY staker_apr) FILTER(WHERE staker_apr > 0), 0) as "stakerApr",
          COALESCE(SUM(queries90_days), 0) as "queries90Days",
          COALESCE(SUM(queries24_hours), 0) as "queries24Hours",
          COALESCE(SUM(served_data24_hours), 0) as "servedData24Hours",
          COALESCE(SUM(served_data90_days), 0) as "servedData90Days",
          COALESCE(SUM(stored_data), 0) as "storedData",
          COALESCE((SELECT count(*) FROM worker WHERE status IN ('ACTIVE')), 0) as "workersCount",
          COALESCE((SELECT count(*) FROM worker WHERE online = TRUE AND status IN ('ACTIVE')), 0) as "onlineWorkersCount",
          (SELECT max(height) FROM block) as "lastBlock",
          (SELECT max(timestamp) FROM block) as "lastBlockTimestamp",
          (SELECT EXTRACT(EPOCH FROM (max(timestamp) - min(timestamp))) / 100 * 1000 FROM block) as "blockTime",
          (SELECT max(height) FROM block_l1) as "lastBlockL1",
          (SELECT max(timestamp) FROM block_l1) as "lastBlockTimestampL1",
          (SELECT ((EXTRACT(EPOCH FROM (max(timestamp) - min(timestamp))) / 100) - 2) * 1000 FROM block_l1) as "blockTimeL1",
          (SELECT json_agg(row_to_json(aprs_raw)) FROM (
            SELECT 
              DATE_TRUNC('day', "to") as "timestamp",
              COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY (recipient -> 'workerApr')::float) FILTER(WHERE (recipient -> 'workerApr')::float > 0), 0) as "workerApr",
              COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY (recipient -> 'stakerApr')::float) FILTER(WHERE (recipient -> 'stakerApr')::float > 0), 0) as "stakerApr"
            FROM COMMITMENT, JSONB_ARRAY_ELEMENTS(recipients) AS recipient
            WHERE "to" >= DATE_TRUNC('day', NOW() - interval '13 DAY')
            GROUP BY DATE_TRUNC('day', "to")
            ORDER BY "timestamp") as "aprs_raw"
          ) as "aprs"
        FROM worker
        `,
      )
      .then((r) => {
        assert(r.length === 1);
        return new NetworkStats(r[0]);
      });
  }
}
