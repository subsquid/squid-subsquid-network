import { DateTime } from '@subsquid/graphql-server';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityManager } from 'typeorm';

@ObjectType()
export class WorkerSnapshotDay {
  @Field(() => DateTime, { nullable: false })
  timestamp!: Date;

  @Field(() => Number, { nullable: false })
  uptime!: number;

  constructor(props: Partial<WorkerSnapshotDay>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class DaysUptimeResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [WorkerSnapshotDay])
  async workerSnapshotsByDay(
    @Arg('workerId') workerId: string,
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<number> {
    const manager = await this.tx();

    const raw = await manager.query(
      `
      SELECT
        "timestamp",
        AVG(uptime) as "uptime"
      FROM
        (SELECT
            DATE_TRUNC('day', "timestamp") AS "timestamp",
            "uptime"
          FROM
            "worker_snapshot"
          WHERE
            "worker_id" = $1 AND
            "timestamp" >= $2 AND
            "timestamp" < $3
        ) AS a
      GROUP BY
        "timestamp"
      ORDER BY
        "timestamp"
      `,
      [workerId, from, to || new Date()],
    );
    return raw.map((d: any) => new WorkerSnapshotDay(d));
  }
}
