import assert from 'assert';

import { BigInteger } from '@subsquid/graphql-server';
import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityManager } from 'typeorm';

@ObjectType()
export class NetworkSummary {
  @Field(() => Number, { nullable: false })
  workerApr!: number;

  @Field(() => Number, { nullable: false })
  stakerApr!: number;

  @Field(() => BigInteger, { nullable: false })
  storedData!: bigint;

  @Field(() => BigInteger, { nullable: false })
  queries90Days!: bigint;

  @Field(() => Number, { nullable: false })
  workersCount!: number;

  @Field(() => Number, { nullable: false })
  onlineWorkersCount!: number;

  @Field(() => BigInteger, { nullable: false })
  totalBond!: bigint;

  @Field(() => BigInteger, { nullable: false })
  totalDelegation!: bigint;

  constructor(props: Partial<NetworkSummary>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class NetworkSummaryResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => NetworkSummary)
  async networkSummary(): Promise<NetworkSummary> {
    const manager = await this.tx();

    return await manager
      .query(
        `
        SELECT
          SUM(bond) as "totalBond",
          SUM(total_delegation) as "totalDelegation",
          PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY apr) as "workerApr",
          PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY staker_apr) as "stakerApr",
          SUM(queries90_days) as "queries90Days",
          SUM(stored_data) as "storedData",
          (SELECT count(*) FROM worker WHERE status NOT IN ('WITHDRAWN', 'UNKNOWN')) as "workersCount",
          (SELECT count(*) FROM worker WHERE online = TRUE) as "onlineWorkersCount"
        FROM worker
        `,
      )
      .then((r) => {
        assert(r.length === 1);
        return new NetworkSummary(r[0]);
      });
  }
}
