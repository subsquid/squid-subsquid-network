import { DateTime } from '@subsquid/graphql-server'
import { max, min } from 'date-fns'
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { getGroupSize } from '~/utils/groupSize'
import { toStartOfInterval } from '~/utils/time'

function sql(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values).replace(/[\n\s]+/g, ' ')
}

function dateBin(
  column: string,
  from: Date,
  to: Date,
  step: { targetPoints?: number } | string = { targetPoints: 50 },
): string {
  const groupSize = getGroupSize(
    typeof step === 'string' ? step : { from, to, maxPoints: step.targetPoints },
  )
  return sql`date_bin('${groupSize.label}', ${column}, '2001-01-01'::timestamp)`
}

function generateTimeSeries(
  from: Date,
  to: Date,
  step: { targetPoints?: number } | string = { targetPoints: 50 },
): string {
  const groupSize = getGroupSize(
    typeof step === 'string' ? step : { from, to, maxPoints: step.targetPoints },
  )

  return sql`generate_series(
    date_bin('${groupSize.label}', $1::timestamptz, '2001-01-01'::timestamp) + '${groupSize.label}'::interval,
    date_bin('${groupSize.label}', $2::timestamptz, '2001-01-01'::timestamp),
    '${groupSize.label}'::interval
  )`
}

function timeseriesFilter(field: string): string {
  return sql`${field} >= $1 AND ${field} < $2`
}

function trimNullValues<T extends { value: any }>(data: T[]): T[] {
  if (data.length === 0) return data

  // Find first non-null index
  let firstNonNullIndex = 0
  while (firstNonNullIndex < data.length && isValueNull(data[firstNonNullIndex].value)) {
    firstNonNullIndex++
  }

  // Find last non-null index
  let lastNonNullIndex = data.length - 1
  while (lastNonNullIndex >= 0 && isValueNull(data[lastNonNullIndex].value)) {
    lastNonNullIndex--
  }

  // If all values are null, return empty array
  if (firstNonNullIndex > lastNonNullIndex) {
    return []
  }

  return data.slice(firstNonNullIndex, lastNonNullIndex + 1)
}

function isValueNull(value: any): boolean {
  if (value == null) return true

  // Handle objects like AprValue where all properties might be null
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).every((v) => v == null)
  }

  return false
}

/*************************************
 * Holders count timeseries          *
 *************************************/
@ObjectType()
class HoldersCountEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<HoldersCountEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class HoldersCountTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [HoldersCountEntry])
  async holdersCountTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<HoldersCountEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
        WITH events_binned AS (
          SELECT
            date as bin_ts,
            SUM (CASE WHEN balance > 0 AND change = balance THEN 1 WHEN balance = 0 AND change < 0 THEN -1 ELSE 0 END) as delta
          FROM (
            SELECT
              ${dateBin('t.timestamp', from, to, step)} as date,
              account_id,
              (array_agg(balance ORDER BY t.id DESC))[1] as balance,
              SUM (CASE WHEN direction = 'FROM' THEN - t.amount WHEN direction = 'TO' THEN t.amount ELSE 0 END) as change
            FROM account_transfer
            LEFT JOIN transfer as t ON transfer_id = t.id
            GROUP BY date, account_id
          ) daily_balances
          GROUP BY date
        ),
        time_series AS (
          SELECT ${generateTimeSeries(from, to, step)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            COALESCE(ts.bin_ts, e.bin_ts) AS timestamp,
            SUM(e.delta) OVER (ORDER BY COALESCE(ts.bin_ts, e.bin_ts)) AS value
          FROM time_series ts
          FULL JOIN events_binned e
            ON e.bin_ts = ts.bin_ts
        )
        SELECT
          timestamp,
          value
        FROM cumulative_data
        WHERE ${timeseriesFilter('timestamp')}
        ORDER BY timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new HoldersCountEntry({
          timestamp: r.timestamp,
          value: r.value ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

@ObjectType()
class TvlEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => BigInt, { nullable: true })
  value!: bigint | null

  constructor(props: Partial<TvlEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class LockedValueTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [TvlEntry])
  async lockedValueTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<TvlEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
        WITH events_binned AS (
          SELECT
            ${dateBin('t.timestamp', from, to, step)} AS bin_ts,
            SUM(CASE WHEN t.type = 'DEPOSIT' THEN t.amount WHEN t.type = 'WITHDRAW' THEN - t.amount ELSE 0 END) AS delta
          FROM transfer t
          WHERE t.type in ('DEPOSIT', 'WITHDRAW')
          GROUP BY 1
        ),
        time_series AS (
          SELECT ${generateTimeSeries(from, to, step)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            COALESCE(ts.bin_ts, e.bin_ts) AS timestamp,
            SUM(e.delta) OVER (ORDER BY COALESCE(ts.bin_ts, e.bin_ts)) AS value
          FROM time_series ts
          FULL JOIN events_binned e
            ON e.bin_ts = ts.bin_ts
        )
        SELECT
          timestamp,
          value
        FROM cumulative_data
        WHERE ${timeseriesFilter('timestamp')}
        ORDER BY timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new TvlEntry({
          timestamp: r.timestamp,
          value: r.value == null ? null : BigInt(r.value),
        }),
    )

    return trimNullValues(mapped)
  }
}

/*************************************
 * Active workers timeseries         *
 *************************************/
@ObjectType()
class ActiveWorkersEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<ActiveWorkersEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class ActiveWorkersTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ActiveWorkersEntry])
  async activeWorkersTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<ActiveWorkersEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const query = sql`
      WITH events_binned AS (
        SELECT
          ${dateBin('timestamp', from, to, step)} AS bin_ts,
          SUM((status = 'ACTIVE')::int) - SUM((status = 'DEREGISTERED')::int) AS delta
        FROM worker_status_change
        WHERE pending = FALSE
        GROUP BY 1
      ),
      time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} AS bin_ts
      ),
      cumulative_data AS (
      SELECT
        COALESCE(ts.bin_ts, e.bin_ts) AS timestamp,
        SUM(e.delta) OVER (ORDER BY COALESCE(ts.bin_ts, e.bin_ts)) AS value
      FROM time_series ts
      FULL JOIN events_binned e
        ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      WHERE ${timeseriesFilter('timestamp')}
      ORDER BY timestamp;
    `
    const raw = await manager.query(query, [from, to])

    const mapped = raw.map(
      (r: any) =>
        new ActiveWorkersEntry({
          timestamp: r.timestamp,
          value: r.value ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

/*************************************
 * Unique operators timeseries       *
 *************************************/
@ObjectType()
class OperatorsEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<OperatorsEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class UniqueOperatorsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [OperatorsEntry])
  async uniqueOperatorsTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<OperatorsEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH events_binned AS (
        SELECT
          date as bin_ts,
          SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as delta
        FROM (
          SELECT date, owner_id, change,
            SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
          FROM (
            SELECT ${dateBin('timestamp', from, to, step)} as date,
              owner_id,
              SUM(CASE WHEN status = 'REGISTERING' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 END) as change
            FROM (
              SELECT wsc.id, wsc.timestamp, w.owner_id, wsc.status
              FROM worker_status_change as wsc
              JOIN worker as w ON w.id = wsc.worker_id
              WHERE wsc.status IN ('REGISTERING', 'WITHDRAWN')
            ) events
            GROUP BY date, owner_id
          ) raw
        ) with_counts
        GROUP BY date
      ),
      time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} AS bin_ts
      ),
      cumulative_data AS (
        SELECT
          COALESCE(ts.bin_ts, e.bin_ts) AS timestamp,
          SUM(e.delta) OVER (ORDER BY COALESCE(ts.bin_ts, e.bin_ts)) AS value
        FROM time_series ts
        FULL JOIN events_binned e
          ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      WHERE ${timeseriesFilter('timestamp')}
      ORDER BY timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new OperatorsEntry({
          timestamp: r.timestamp,
          value: r.value ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

/*************************************
 * Delegations count timeseries      *
 *************************************/
@ObjectType()
class DelegationsEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<DelegationsEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class DelegationsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [DelegationsEntry])
  async delegationsTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<DelegationsEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH events_binned AS (
        SELECT
          ${dateBin('wsc.timestamp', from, to, step)} AS bin_ts,
          SUM(CASE WHEN wsc.status = 'ACTIVE' THEN 1 WHEN wsc.status = 'WITHDRAWN' THEN -1 ELSE 0 END) AS delta
        FROM delegation_status_change as wsc
        WHERE wsc.pending = false
        GROUP BY 1
      ),
      time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} AS bin_ts
      ),
      cumulative_data AS (
        SELECT
          COALESCE(ts.bin_ts, e.bin_ts) AS timestamp,
          SUM(e.delta) OVER (ORDER BY COALESCE(ts.bin_ts, e.bin_ts)) AS value
        FROM time_series ts
        FULL JOIN events_binned e
          ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      WHERE ${timeseriesFilter('timestamp')}
      ORDER BY timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new DelegationsEntry({
          timestamp: r.timestamp,
          value: r.value ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

/*************************************
 * Unique delegators timeseries      *
 *************************************/
@ObjectType()
class DelegatorsEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<DelegatorsEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class DelegatorsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [DelegatorsEntry])
  async delegatorsTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<DelegatorsEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH events_binned AS (
        SELECT
          date as bin_ts,
          SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as delta
        FROM (
          SELECT date, owner_id, change,
            SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
          FROM (
            SELECT ${dateBin('timestamp', from, to, step)} as date,
              owner_id,
              SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) as change
            FROM (
              SELECT wsc.id, wsc.timestamp, delegation.owner_id, wsc.status
              FROM delegation_status_change wsc
              JOIN delegation ON delegation.id = wsc.delegation_id
              WHERE wsc.status IN ('ACTIVE', 'WITHDRAWN')
            ) events
            GROUP BY date, owner_id
          ) raw
        ) with_counts
        GROUP BY date
      ),
      time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} AS bin_ts
      ),
      cumulative_data AS (
        SELECT
          COALESCE(ts.bin_ts, e.bin_ts) AS timestamp,
          SUM(e.delta) OVER (ORDER BY COALESCE(ts.bin_ts, e.bin_ts)) AS value
        FROM time_series ts
        FULL JOIN events_binned e
          ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      WHERE ${timeseriesFilter('timestamp')}
      ORDER BY timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new DelegatorsEntry({
          timestamp: r.timestamp,
          value: r.value ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

@ObjectType()
class TransferCountByTypeValue {
  @Field(() => Number)
  deposit!: number

  @Field(() => Number)
  withdraw!: number

  @Field(() => Number)
  transfer!: number

  @Field(() => Number)
  reward!: number

  @Field(() => Number)
  release!: number

  constructor(props: Partial<TransferCountByTypeValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class TransferCountByType {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => TransferCountByTypeValue, { nullable: true })
  value!: TransferCountByTypeValue | null

  constructor(props: Partial<TransferCountByType>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class TransfersByTypeTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [TransferCountByType])
  async transfersByTypeTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<TransferCountByType[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
        WITH time_series AS (
          SELECT ${generateTimeSeries(from, to, step)} as timestamp
        ),
                 transfer_counts AS (
           SELECT ${dateBin('timestamp', from, to, step)} as date,
             count(*) FILTER (WHERE type = 'DEPOSIT') AS deposit,
             count(*) FILTER (WHERE type = 'WITHDRAW') AS withdraw,
             count(*) FILTER (WHERE type = 'CLAIM') AS reward,
             count(*) FILTER (WHERE type = 'RELEASE') AS release,
             count(*) FILTER (WHERE type NOT IN ('DEPOSIT', 'WITHDRAW', 'CLAIM', 'RELEASE')) AS transfer
           FROM transfer
           WHERE ${timeseriesFilter(dateBin('timestamp', from, to, step))}
           GROUP BY date
         )
        SELECT 
          ts.timestamp as date,
          tc.deposit,
          tc.withdraw,
          tc.transfer,
          tc.reward,
          tc.release
        FROM time_series ts
         LEFT JOIN transfer_counts tc ON ts.timestamp = tc.date
         ORDER BY ts.timestamp
      `,
      [from, to],
    )

    return raw.map(
      (r: any) =>
        new TransferCountByType({
          timestamp: r.date,
          value:
            r.deposit != null ||
            r.withdraw != null ||
            r.transfer != null ||
            r.reward != null ||
            r.release != null
              ? new TransferCountByTypeValue({
                  deposit: parseInt(r.deposit || 0),
                  withdraw: parseInt(r.withdraw || 0),
                  transfer: parseInt(r.transfer || 0),
                  reward: parseInt(r.reward || 0),
                  release: parseInt(r.release || 0),
                })
              : null,
        }),
    )
  }
}

/*************************************
 * Unique accounts timeseries        *
 *************************************/
@ObjectType()
class UniqueAccountsEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<UniqueAccountsEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class UniqueAccountsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [UniqueAccountsEntry])
  async uniqueAccountsTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<UniqueAccountsEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} as timestamp
      ),
      account_counts AS (
        SELECT ${dateBin('timestamp', from, to, step)} as date, count(DISTINCT account_id) as value
        FROM (
          SELECT timestamp, from_id as account_id FROM transfer
          UNION ALL
          SELECT timestamp, to_id as account_id FROM transfer
        ) AS tr
        WHERE ${timeseriesFilter(dateBin('timestamp', from, to, step))}
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        ac.value as value
      FROM time_series ts
      LEFT JOIN account_counts ac ON ts.timestamp = ac.date
      WHERE ${timeseriesFilter('ts.timestamp')}
      ORDER BY ts.timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new UniqueAccountsEntry({
          timestamp: r.date,
          value: r.value != null ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

/*************************************
 * Queries count timeseries          *
 *************************************/
@ObjectType()
class QueriesCountEntry {
  @Field(() => DateTime)
  timestamp!: Date
  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<QueriesCountEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class QueriesCountTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [QueriesCountEntry])
  async queriesCountTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<QueriesCountEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} as timestamp
      ),
      query_counts AS (
        SELECT ${dateBin('timestamp', from, to, step)} as date, sum(queries) as value
        FROM worker_metrics
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        qc.value as value
      FROM time_series ts
      LEFT JOIN query_counts qc ON ts.timestamp = qc.date
      WHERE ${timeseriesFilter('ts.timestamp')}
      ORDER BY ts.timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new QueriesCountEntry({
          timestamp: r.date,
          value: r.value != null ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

/*************************************
 * Served data timeseries            *
 *************************************/
@ObjectType()
class ServedDataEntry {
  @Field(() => DateTime)
  timestamp!: Date
  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<ServedDataEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class ServedDataTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ServedDataEntry])
  async servedDataTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<ServedDataEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} as timestamp
      ),
      served_data_counts AS (
        SELECT ${dateBin('timestamp', from, to, step)} as date, sum(served_data) as value
        FROM worker_metrics
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        sdc.value as value
      FROM time_series ts
      LEFT JOIN served_data_counts sdc ON ts.timestamp = sdc.date
      WHERE ${timeseriesFilter('ts.timestamp')}
      ORDER BY ts.timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new ServedDataEntry({
          timestamp: r.date,
          value: r.value != null ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

/*************************************
 * Stored data timeseries            *
 *************************************/
@ObjectType()
class StoredDataEntry {
  @Field(() => DateTime)
  timestamp!: Date
  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<StoredDataEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class StoredDataTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [StoredDataEntry])
  async storedDataTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<StoredDataEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} as timestamp
      ),
      stored_data_counts AS (
        SELECT date, sum(stored_data) as value
        FROM (
          SELECT ${dateBin('timestamp', from, to, step)} as date, worker_id, max(stored_data) as stored_data
          FROM worker_metrics
          WHERE ${timeseriesFilter('timestamp')}
          GROUP BY date, worker_id
        ) w
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(sdc.value, LAG(sdc.value) OVER (ORDER BY ts.timestamp)) as value
      FROM time_series ts
      LEFT JOIN stored_data_counts sdc ON ts.timestamp = sdc.date
      WHERE ${timeseriesFilter('ts.timestamp')}
      ORDER BY ts.timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new StoredDataEntry({
          timestamp: r.date,
          value: r.value != null ? parseInt(r.value) : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

@ObjectType()
class RewardValue {
  @Field(() => BigInt)
  workerReward!: bigint
  @Field(() => BigInt)
  stakerReward!: bigint

  constructor(props: Partial<RewardValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class RewardEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => RewardValue, { nullable: true })
  value!: RewardValue | null

  constructor(props: Partial<RewardEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class RewardTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [RewardEntry])
  async rewardTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<RewardEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} as timestamp
      ),
      reward_counts AS (
        SELECT
          ${dateBin('wr.timestamp', from, to, step)} as date,
          SUM(wr.amount) AS worker_value,
          SUM(wr.stakers_reward) AS staker_value
        FROM worker_reward as wr
        WHERE ${timeseriesFilter(dateBin('wr.timestamp', from, to, step))}
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        rc.worker_value as worker_value,
        rc.staker_value as staker_value
      FROM time_series ts
      LEFT JOIN reward_counts rc ON ts.timestamp = rc.date
      WHERE ${timeseriesFilter('ts.timestamp')}
      ORDER BY ts.timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new RewardEntry({
          timestamp: r.date,
          value:
            r.worker_value != null || r.staker_value != null
              ? new RewardValue({
                  workerReward: BigInt(r.worker_value || 0),
                  stakerReward: BigInt(r.staker_value || 0),
                })
              : null,
        }),
    )

    return trimNullValues(mapped)
  }
}

@ObjectType()
class AprValue {
  @Field(() => Number)
  workerApr!: number

  @Field(() => Number)
  stakerApr!: number

  constructor(props: Partial<AprValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class AprEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => AprValue, { nullable: true })
  value!: AprValue | null

  constructor(props: Partial<AprEntry>) {
    Object.assign(this, props)
  }
}

/*************************************
 * APR timeseries                    *
 *************************************/
@Resolver()
export class AprTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [AprEntry])
  async aprTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to: Date = new Date(),
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<AprEntry[]> {
    const manager = await this.tx()

    to = min([to, new Date()])
    from = min([from, to])

    const raw = await manager.query(
      sql`
      WITH time_series AS (
        SELECT ${generateTimeSeries(from, to, step)} as timestamp
      ),
      apr_data AS (
        SELECT
          ${dateBin('timestamp', from, to, step)} as date,
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS "workerApr",
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS "stakerApr"
        FROM worker_reward
        WHERE ${timeseriesFilter(dateBin('timestamp', from, to, step))}
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        ad."workerApr",
        ad."stakerApr"
      FROM time_series ts
      LEFT JOIN apr_data ad ON ts.timestamp = ad.date
      WHERE ${timeseriesFilter('ts.timestamp')}
      ORDER BY ts.timestamp
      `,
      [from, to],
    )

    const mapped = raw.map(
      (r: any) =>
        new AprEntry({
          timestamp: r.date,
          value:
            r.workerApr != null || r.stakerApr != null
              ? new AprValue({
                  workerApr: Number(r.workerApr || 0),
                  stakerApr: Number(r.stakerApr || 0),
                })
              : null,
        }),
    )

    return trimNullValues(mapped)
  }
}
