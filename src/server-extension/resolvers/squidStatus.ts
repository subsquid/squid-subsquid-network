import assert from 'assert';

import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityManager } from 'typeorm';

@ObjectType()
export class SquidStatus {
  @Field(() => Number, { nullable: false })
  height!: number;

  @Field(() => Number, { nullable: false })
  finalizedHeight!: number;

  constructor(props: Partial<SquidStatus>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class SquidStatusResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => SquidStatus)
  async squidStatus(): Promise<SquidStatus> {
    const manager = await this.tx();

    return await manager
      .query(
        `
        SELECT f.height AS "finalizedHeight",
            COALESCE(h.height, f.height) AS height
        FROM squid_processor.status AS f
        FULL JOIN
            (SELECT *
                FROM squid_processor.hot_block
                ORDER BY height DESC
                LIMIT 1) AS h ON TRUE
        WHERE f.id = 0
        `,
      )
      .then((r) => {
        assert(r.length === 1);
        const height = parseInt(r[0].height);
        const finalizedHeight = parseInt(r[0].finalizedHeight);
        return new SquidStatus({ height, finalizedHeight });
      });
  }
}
