import { type GroupSize, getGroupSize, network } from '@sqd/shared'
import { DateTime } from '@subsquid/graphql-server'
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'

/**
 * Timestamp of the first `network.contracts.Router` deployment on each
 * supported network — used as the default lower bound for time-series
 * queries when the caller does not supply `from`.
 *
 * Master used `MIN(transfer.timestamp)` resolved via a DB probe, which was
 * both expensive (extra query per request) and brittle once the `Transfer`
 * entity moved to the `token` package. The fixed constants below reproduce
 * the same effective bound without the cross-package dependency; update them
 * only when deploying the workers indexer to a new network.
 *
 * Sources:
 *   mainnet → first Router deployment block timestamp on Arbitrum One
 *   tethys  → first Router deployment block timestamp on Arbitrum Sepolia
 */
const INITIAL_TIMESTAMP =
  network.name === 'mainnet' ? new Date('2024-03-25T16:55:45Z') : new Date('2024-01-10T00:32:20Z')

export function normalizeTimeRange(from?: Date, to?: Date): { from: Date; to: Date } {
  const now = new Date()
  const normalizedTo = to != null && to < now ? to : now
  // Clamp `from` so the returned range always starts at or after the indexer's
  // earliest observable data. Callers passing `from` from the frontend's date
  // picker routinely ask for multi-year ranges; without this clamp every
  // daily-bucket aggregate would materialize thousands of empty rows.
  const normalizedFrom = from != null && from > INITIAL_TIMESTAMP ? from : INITIAL_TIMESTAMP
  return { from: normalizedFrom, to: normalizedTo }
}

function getGroupSizeInfo(from: Date, to: Date, step?: string): GroupSize {
  return getGroupSize(step ? step : { from, to, maxPoints: 50 })
}

function stepInterval(groupSize: GroupSize): string {
  return `${groupSize.days} days`
}

function startOfDayUtc(date: Date): Date {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function buildTimeseries<T extends { timestamp: Date; value: any }>(
  data: T[],
  groupSize: GroupSize,
  from: Date,
  to: Date,
) {
  return {
    data: data,
    step: groupSize.ms,
    from: data[0]?.timestamp ?? startOfDayUtc(from),
    to: data[data.length - 1]?.timestamp ?? startOfDayUtc(to),
  }
}

function sql(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values).replace(/[\n\s]+/g, ' ')
}

function truncDayUtc(expr: string): string {
  return sql`date_trunc('day', ${expr} AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'`
}

const TRUNC_FROM = truncDayUtc('$1::timestamptz')
const TRUNC_TO = truncDayUtc('$2::timestamptz')

function generateTimeSeries(groupSize: GroupSize): string {
  const interval = stepInterval(groupSize)
  return sql`
    SELECT bin_ts::timestamptz
    FROM generate_series(
      ${TRUNC_TO},
      ${TRUNC_FROM} + '1 day'::interval,
      -'${interval}'::interval
    ) AS bin_ts
    ORDER BY bin_ts
  `
}

function binJoin(dayColumn: string, seriesColumn: string, groupSize: GroupSize): string {
  const interval = stepInterval(groupSize)
  return sql`${dayColumn} >= ${seriesColumn} - '${interval}'::interval AND ${dayColumn} < ${seriesColumn}`
}

function buildWorkerFilter(workerId?: string): {
  filter: string
  params: (Date | string)[]
  paramIndex: number
} {
  if (workerId) {
    return {
      filter: sql`AND worker_id = $3`,
      params: [] as any[],
      paramIndex: 3,
    }
  }
  return {
    filter: '',
    params: [] as any[],
    paramIndex: 2,
  }
}

function prepareTimeseriesContext(fromArg?: Date, toArg?: Date, step?: string) {
  const { from, to } = normalizeTimeRange(fromArg, toArg)
  const groupSize = getGroupSizeInfo(from, to, step)
  return { groupSize, from, to }
}

/* Active workers */

@ObjectType()
class ActiveWorkersEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<ActiveWorkersEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class ActiveWorkersTimeseries {
  @Field(() => [ActiveWorkersEntry]) data!: ActiveWorkersEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<ActiveWorkersTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class ActiveWorkersTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => ActiveWorkersTimeseries)
  async activeWorkersTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<ActiveWorkersTimeseries> {
    const manager = await this.tx()
    const { from, to } = normalizeTimeRange(fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_active_workers_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_active_workers_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [from, to],
    )

    const data = raw.map(
      (r: any) => new ActiveWorkersEntry({ timestamp: r.timestamp, value: parseInt(r.value) }),
    )
    return new ActiveWorkersTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Unique operators */

@ObjectType()
class OperatorsEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<OperatorsEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class UniqueOperatorsTimeseries {
  @Field(() => [OperatorsEntry]) data!: OperatorsEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<UniqueOperatorsTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class UniqueOperatorsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => UniqueOperatorsTimeseries)
  async uniqueOperatorsTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<UniqueOperatorsTimeseries> {
    const manager = await this.tx()
    const { from, to } = normalizeTimeRange(fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_unique_operators_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_unique_operators_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [from, to],
    )

    const data = raw.map(
      (r: any) => new OperatorsEntry({ timestamp: r.timestamp, value: parseInt(r.value) }),
    )
    return new UniqueOperatorsTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Delegations count */

@ObjectType()
class DelegationsEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<DelegationsEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class DelegationsTimeseries {
  @Field(() => [DelegationsEntry]) data!: DelegationsEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<DelegationsTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class DelegationsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => DelegationsTimeseries)
  async delegationsTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<DelegationsTimeseries> {
    const manager = await this.tx()
    const { from, to } = normalizeTimeRange(fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_delegations_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_delegations_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [from, to],
    )

    const data = raw.map(
      (r: any) => new DelegationsEntry({ timestamp: r.timestamp, value: parseInt(r.value) }),
    )
    return new DelegationsTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Unique delegators */

@ObjectType()
class DelegatorsEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<DelegatorsEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class DelegatorsTimeseries {
  @Field(() => [DelegatorsEntry]) data!: DelegatorsEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<DelegatorsTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class DelegatorsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => DelegatorsTimeseries)
  async delegatorsTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<DelegatorsTimeseries> {
    const manager = await this.tx()
    const { from, to } = normalizeTimeRange(fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_delegators_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_delegators_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [from, to],
    )

    const data = raw.map(
      (r: any) => new DelegatorsEntry({ timestamp: r.timestamp, value: parseInt(r.value) }),
    )
    return new DelegatorsTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Queries count */

@ObjectType()
class QueriesCountEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<QueriesCountEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class QueriesCountTimeseries {
  @Field(() => [QueriesCountEntry]) data!: QueriesCountEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<QueriesCountTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class QueriesCountTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => QueriesCountTimeseries)
  async queriesCountTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('workerId', { nullable: true }) workerId?: string,
  ): Promise<QueriesCountTimeseries> {
    const manager = await this.tx()
    const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step)

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [from, to, workerId] : [from, to]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT ${truncDayUtc('timestamp')} as day, sum(value) as value
        FROM mv_queries_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.value), 0) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `,
      params,
    )

    const data = raw.map(
      (r: any) => new QueriesCountEntry({ timestamp: r.date, value: parseInt(r.value) }),
    )
    return new QueriesCountTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Served data */

@ObjectType()
class ServedDataEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<ServedDataEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class ServedDataTimeseries {
  @Field(() => [ServedDataEntry]) data!: ServedDataEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<ServedDataTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class ServedDataTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => ServedDataTimeseries)
  async servedDataTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('workerId', { nullable: true }) workerId?: string,
  ): Promise<ServedDataTimeseries> {
    const manager = await this.tx()
    const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step)

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [from, to, workerId] : [from, to]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT ${truncDayUtc('timestamp')} as day, sum(value) as value
        FROM mv_served_data_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.value), 0) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `,
      params,
    )

    const data = raw.map(
      (r: any) => new ServedDataEntry({ timestamp: r.date, value: parseInt(r.value) }),
    )
    return new ServedDataTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Stored data */

@ObjectType()
class StoredDataEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<StoredDataEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class StoredDataTimeseries {
  @Field(() => [StoredDataEntry]) data!: StoredDataEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<StoredDataTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class StoredDataTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => StoredDataTimeseries)
  async storedDataTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('workerId', { nullable: true }) workerId?: string,
  ): Promise<StoredDataTimeseries> {
    const manager = await this.tx()
    const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step)

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [from, to, workerId] : [from, to]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT day, SUM(avg_per_worker) as value
        FROM (
          SELECT 
            ${truncDayUtc('timestamp')} as day,
            worker_id,
            AVG(value) as avg_per_worker
          FROM mv_stored_data_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
          GROUP BY day, worker_id
        ) worker_averages
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.value), COALESCE(LAG(SUM(d.value)) OVER (ORDER BY ts.bin_ts), 0)) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `,
      params,
    )

    const data = raw.map(
      (r: any) => new StoredDataEntry({ timestamp: r.date, value: parseInt(r.value) }),
    )
    return new StoredDataTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Uptime */

@ObjectType()
class UptimeEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<UptimeEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class UptimeTimeseries {
  @Field(() => [UptimeEntry]) data!: UptimeEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<UptimeTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class UptimeTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => UptimeTimeseries)
  async uptimeTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('workerId', { nullable: true }) workerId?: string,
  ): Promise<UptimeTimeseries> {
    const manager = await this.tx()
    const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step)

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [from, to, workerId] : [from, to]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT 
          ${truncDayUtc('timestamp')} as day,
          AVG(value) as value
        FROM mv_uptime_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(AVG(d.value), 0) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `,
      params,
    )

    const data = raw.map(
      (r: any) => new UptimeEntry({ timestamp: r.date, value: parseFloat(r.value) }),
    )
    return new UptimeTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Reward */

@ObjectType()
class RewardValue {
  @Field(() => BigInt) workerReward!: bigint
  @Field(() => BigInt) stakerReward!: bigint
  constructor(props: Partial<RewardValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class RewardEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => RewardValue, { nullable: true }) value!: RewardValue | null
  constructor(props: Partial<RewardEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class RewardTimeseries {
  @Field(() => [RewardEntry]) data!: RewardEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<RewardTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class RewardTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => RewardTimeseries)
  async rewardTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('workerId', { nullable: true }) workerId?: string,
  ): Promise<RewardTimeseries> {
    const manager = await this.tx()
    const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step)

    const workerFilter = workerId ? sql`AND worker_id = $3` : ''
    const params = workerId ? [from, to, workerId] : [from, to]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT
          ${truncDayUtc('timestamp')} as day,
          SUM(worker_value) AS worker_value,
          SUM(staker_value) AS staker_value
        FROM mv_reward_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.worker_value), 0) as worker_value,
        COALESCE(SUM(d.staker_value), 0) as staker_value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `,
      params,
    )

    const data = raw.map(
      (r: any) =>
        new RewardEntry({
          timestamp: r.date,
          value: new RewardValue({
            workerReward: BigInt(r.worker_value),
            stakerReward: BigInt(r.staker_value),
          }),
        }),
    )
    return new RewardTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* APR */

@ObjectType()
class AprValue {
  @Field(() => Number) workerApr!: number
  @Field(() => Number) stakerApr!: number
  constructor(props: Partial<AprValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class AprEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => AprValue, { nullable: true }) value!: AprValue | null
  constructor(props: Partial<AprEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class AprTimeseries {
  @Field(() => [AprEntry]) data!: AprEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
  constructor(props: Partial<AprTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class AprTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => AprTimeseries)
  async aprTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('workerId', { nullable: true }) workerId?: string,
  ): Promise<AprTimeseries> {
    const manager = await this.tx()
    const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step)

    let raw

    if (workerId) {
      const params = [from, to, workerId]
      raw = await manager.query(
        sql`
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT
            ${truncDayUtc('timestamp')} as day,
            COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS "workerApr",
            COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS "stakerApr"
          FROM worker_reward
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} AND worker_id = $3
          GROUP BY day
        )
        SELECT 
          (ts.bin_ts - interval '1 second') as date,
          COALESCE(AVG(d."workerApr"), 0) as "workerApr",
          COALESCE(AVG(d."stakerApr"), 0) as "stakerApr"
        FROM time_series ts
        LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
        ORDER BY ts.bin_ts
        `,
        params,
      )
    } else {
      const params = [from, to]
      raw = await manager.query(
        sql`
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT
            ${truncDayUtc('timestamp')} as day,
            AVG(worker_apr) FILTER (WHERE worker_apr > 0) AS "workerApr",
            AVG(staker_apr) FILTER (WHERE staker_apr > 0) AS "stakerApr"
          FROM mv_apr_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        )
        SELECT 
          (ts.bin_ts - interval '1 second') as date,
          COALESCE(AVG(d."workerApr"), 0) as "workerApr",
          COALESCE(AVG(d."stakerApr"), 0) as "stakerApr"
        FROM time_series ts
        LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
        ORDER BY ts.bin_ts
        `,
        params,
      )
    }

    const data = raw.map(
      (r: any) =>
        new AprEntry({
          timestamp: r.date,
          value: new AprValue({
            workerApr: Number(r.workerApr),
            stakerApr: Number(r.stakerApr),
          }),
        }),
    )
    return new AprTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}
