import { DateTime } from '@subsquid/graphql-server'
import { max, min } from 'date-fns'
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { getGroupSize, GroupSize } from '~/utils/groupSize'

let cachedFirstTransferTimestamp: Date | null = null

async function getFirstTransferTimestamp(manager: EntityManager): Promise<Date | null> {
  if (cachedFirstTransferTimestamp) {
    return cachedFirstTransferTimestamp
  }

  const result = await manager.query('SELECT MIN(timestamp) as min_timestamp FROM transfer')
  if (result[0]?.min_timestamp) {
    cachedFirstTransferTimestamp = new Date(result[0].min_timestamp)
  }

  return cachedFirstTransferTimestamp
}

async function normalizeTimeRange(
  manager: EntityManager,
  from?: Date,
  to?: Date,
): Promise<{ from: Date; to: Date }> {
  const firstTransfer = await getFirstTransferTimestamp(manager)
  const defaultFrom = firstTransfer || new Date('2020-01-01')

  const initialFrom = from || defaultFrom
  const normalizedFrom = from && firstTransfer ? max([from, firstTransfer]) : initialFrom

  const normalizedTo = min([to || new Date(), new Date()])
  const finalFrom = min([normalizedFrom, normalizedTo])

  return { from: finalFrom, to: normalizedTo }
}

function getGroupSizeInfo(
  from: Date,
  to: Date,
  step: { targetPoints?: number } | string = { targetPoints: 50 },
): GroupSize {
  const groupSize = getGroupSize(
    typeof step === 'string' ? step : { from, to, maxPoints: step.targetPoints },
  )
  return groupSize
}

async function getAlignedDates(
  manager: EntityManager,
  from: Date,
  to: Date,
  groupSizeLabel: string,
): Promise<{ alignedFrom: Date; alignedTo: Date }> {
  const result = await manager.query(
    `SELECT
      date_bin('${groupSizeLabel}', $1::timestamptz, '2001-01-01'::timestamp) as aligned_from,
      date_bin('${groupSizeLabel}', $2::timestamptz, '2001-01-01'::timestamp) as aligned_to`,
    [from, to],
  )
  return {
    alignedFrom: new Date(result[0].aligned_from),
    alignedTo: new Date(result[0].aligned_to),
  }
}

function sql(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values).replace(/[\n\s]+/g, ' ')
}

function dateBin(column: string, groupSizeLabel: string): string {
  return sql`date_bin('${groupSizeLabel}', ${column}, '2001-01-01'::timestamp)`
}

function generateTimeSeries(groupSizeLabel: string): string {
  return sql`generate_series(
    $1::timestamptz,
    $2::timestamptz - '${groupSizeLabel}'::interval,
    '${groupSizeLabel}'::interval
  )`
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

@ObjectType()
class HoldersCountTimeseries {
  @Field(() => [HoldersCountEntry])
  data!: HoldersCountEntry[]

  @Field(() => Number)
  step!: number

  constructor(props: Partial<HoldersCountTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class HoldersCountTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => HoldersCountTimeseries)
  async holdersCountTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<HoldersCountTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT
            COALESCE(
              SUM(CASE WHEN balance > 0 AND change = balance THEN 1 WHEN balance = 0 AND change < 0 THEN -1 ELSE 0 END),
              0
            ) AS initial_value
          FROM (
            SELECT
              account_id,
              (array_agg(balance ORDER BY t.id DESC))[1] as balance,
              SUM(CASE WHEN direction = 'FROM' THEN -t.amount WHEN direction = 'TO' THEN t.amount ELSE 0 END) as change
            FROM account_transfer at
            INNER JOIN transfer t ON at.transfer_id = t.id
            WHERE t.timestamp < $1
            GROUP BY account_id
          ) initial_balances
        ),
        events_binned AS (
          SELECT
            date as bin_ts,
            SUM (CASE WHEN balance > 0 AND change = balance THEN 1 WHEN balance = 0 AND change < 0 THEN -1 ELSE 0 END) as delta
          FROM (
            SELECT
              ${dateBin('t.timestamp', groupSize.label)} as date,
              at.account_id,
              (array_agg(at.balance ORDER BY t.id DESC))[1] as balance,
              SUM (CASE WHEN at.direction = 'FROM' THEN - t.amount WHEN at.direction = 'TO' THEN t.amount ELSE 0 END) as change
            FROM account_transfer at
            INNER JOIN transfer t ON at.transfer_id = t.id
            WHERE t.timestamp >= $1 AND t.timestamp < $2
            GROUP BY date, at.account_id
          ) daily_balances
          GROUP BY date
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize.label)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e
            ON e.bin_ts = ts.bin_ts
        )
        SELECT
          timestamp,
          value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new HoldersCountTimeseries({
      data: raw.map(
        (r: any) =>
          new HoldersCountEntry({
            timestamp: r.timestamp,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class LockedValueTimeseries {
  @Field(() => [TvlEntry])
  data!: TvlEntry[]

  @Field(() => Number)
  step!: number

  constructor(props: Partial<LockedValueTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class LockedValueTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => LockedValueTimeseries)
  async lockedValueTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<LockedValueTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
        WITH
        initial_value AS (
          SELECT
            COALESCE(
              SUM(CASE WHEN t.type = 'DEPOSIT' THEN t.amount WHEN t.type = 'WITHDRAW' THEN -t.amount ELSE 0 END),
              0
            ) AS initial_locked
          FROM transfer t
          WHERE t.type IN ('DEPOSIT', 'WITHDRAW') AND t.timestamp < $1
        ),
        events_binned AS (
          SELECT
            ${dateBin('t.timestamp', groupSize.label)} AS bin_ts,
            SUM(CASE WHEN t.type = 'DEPOSIT' THEN t.amount WHEN t.type = 'WITHDRAW' THEN - t.amount ELSE 0 END) AS delta
          FROM transfer t
          WHERE t.type in ('DEPOSIT', 'WITHDRAW') AND t.timestamp >= $1 AND t.timestamp < $2
          GROUP BY bin_ts
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize.label)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_locked FROM initial_value) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e
            ON e.bin_ts = ts.bin_ts
        )
        SELECT
          timestamp,
          value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new LockedValueTimeseries({
      data: raw.map(
        (r: any) =>
          new TvlEntry({
            timestamp: r.timestamp,
            value: BigInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class ActiveWorkersTimeseries {
  @Field(() => [ActiveWorkersEntry])
  data!: ActiveWorkersEntry[]

  @Field(() => Number)
  step!: number

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
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const query = sql`
      WITH
      events_with_dates AS (
        SELECT
          worker_id,
          status,
          block_number,
          COALESCE(
            timestamp,
            LAG(timestamp) OVER (PARTITION BY worker_id ORDER BY block_number)
          ) AS timestamp
        FROM worker_status_change
        WHERE pending = FALSE
      ),
      initial_count AS (
        SELECT 
          COALESCE(
            SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'DEREGISTERED' THEN -1 ELSE 0 END),
            0
          ) AS initial_value
        FROM events_with_dates
        WHERE timestamp < $1
      ),
      events_binned AS (
        SELECT
          ${dateBin('timestamp', groupSize.label)} AS bin_ts,
          SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'DEREGISTERED' THEN -1 ELSE 0 END) AS delta
        FROM events_with_dates
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY 1
      ),
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} AS bin_ts
      ),
      cumulative_data AS (
        SELECT
          ts.bin_ts AS timestamp,
          (SELECT initial_value FROM initial_count) +
          SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
        FROM time_series ts
        LEFT JOIN events_binned e
          ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      ORDER BY timestamp;
    `
    const raw = await manager.query(query, [alignedFrom, alignedTo])

    return new ActiveWorkersTimeseries({
      data: raw.map(
        (r: any) =>
          new ActiveWorkersEntry({
            timestamp: r.timestamp,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class UniqueOperatorsTimeseries {
  @Field(() => [OperatorsEntry])
  data!: OperatorsEntry[]

  @Field(() => Number)
  step!: number

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
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      events_with_dates AS (
        SELECT
          wsc.id,
          w.owner_id,
          wsc.status,
          wsc.block_number,
          COALESCE(
            wsc.timestamp,
            LAG(wsc.timestamp) OVER (PARTITION BY wsc.worker_id ORDER BY wsc.block_number)
          ) AS timestamp
        FROM worker_status_change wsc
        INNER JOIN worker w ON w.id = wsc.worker_id
        WHERE wsc.status IN ('REGISTERING', 'WITHDRAWN')
      ),
      initial_count AS (
        SELECT
          COALESCE(
            SUM(CASE WHEN workers_count > 0 THEN 1 ELSE 0 END),
            0
          ) AS initial_value
        FROM (
          SELECT
            owner_id,
            SUM(CASE WHEN status = 'REGISTERING' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) as workers_count
          FROM events_with_dates
          WHERE timestamp < $1
          GROUP BY owner_id
        ) initial_operators
      ),
      events_binned AS (
        SELECT
          date as bin_ts,
          SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as delta
        FROM (
          SELECT date, owner_id, change,
            SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
          FROM (
            SELECT ${dateBin('timestamp', groupSize.label)} as date,
              owner_id,
              SUM(CASE WHEN status = 'REGISTERING' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 END) as change
            FROM events_with_dates
            WHERE timestamp >= $1 AND timestamp < $2
            GROUP BY date, owner_id
          ) raw
        ) with_counts
        GROUP BY date
      ),
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} AS bin_ts
      ),
      cumulative_data AS (
        SELECT
          ts.bin_ts AS timestamp,
          (SELECT initial_value FROM initial_count) +
          SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
        FROM time_series ts
        LEFT JOIN events_binned e
          ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new UniqueOperatorsTimeseries({
      data: raw.map(
        (r: any) =>
          new OperatorsEntry({
            timestamp: r.timestamp,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class DelegationsTimeseries {
  @Field(() => [DelegationsEntry])
  data!: DelegationsEntry[]

  @Field(() => Number)
  step!: number

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
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      events_with_dates AS (
        SELECT
          delegation_id,
          status,
          block_number,
          COALESCE(
            timestamp,
            LAG(timestamp) OVER (PARTITION BY delegation_id ORDER BY block_number)
          ) AS timestamp
        FROM delegation_status_change
        WHERE pending = false
      ),
      initial_count AS (
        SELECT
          COALESCE(
            SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END),
            0
          ) AS initial_value
        FROM events_with_dates
        WHERE timestamp < $1
      ),
      events_binned AS (
        SELECT
          ${dateBin('timestamp', groupSize.label)} AS bin_ts,
          SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) AS delta
        FROM events_with_dates
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY 1
      ),
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} AS bin_ts
      ),
      cumulative_data AS (
        SELECT
          ts.bin_ts AS timestamp,
          (SELECT initial_value FROM initial_count) +
          SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
        FROM time_series ts
        LEFT JOIN events_binned e
          ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new DelegationsTimeseries({
      data: raw.map(
        (r: any) =>
          new DelegationsEntry({
            timestamp: r.timestamp,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class DelegatorsTimeseries {
  @Field(() => [DelegatorsEntry])
  data!: DelegatorsEntry[]

  @Field(() => Number)
  step!: number

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
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      events_with_dates AS (
        SELECT
          wsc.id,
          d.owner_id,
          wsc.status,
          wsc.block_number,
          COALESCE(
            wsc.timestamp,
            LAG(wsc.timestamp) OVER (PARTITION BY wsc.delegation_id ORDER BY wsc.block_number)
          ) AS timestamp
        FROM delegation_status_change wsc
        INNER JOIN delegation d ON d.id = wsc.delegation_id
        WHERE wsc.status IN ('ACTIVE', 'WITHDRAWN')
      ),
      initial_count AS (
        SELECT
          COALESCE(
            SUM(CASE WHEN workers_count > 0 THEN 1 ELSE 0 END),
            0
          ) AS initial_value
        FROM (
          SELECT
            owner_id,
            SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) as workers_count
          FROM events_with_dates
          WHERE timestamp < $1
          GROUP BY owner_id
        ) initial_delegators
      ),
      events_binned AS (
        SELECT
          date as bin_ts,
          SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as delta
        FROM (
          SELECT date, owner_id, change,
            SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
          FROM (
            SELECT ${dateBin('timestamp', groupSize.label)} as date,
              owner_id,
              SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) as change
            FROM events_with_dates
            WHERE timestamp >= $1 AND timestamp < $2
            GROUP BY date, owner_id
          ) raw
        ) with_counts
        GROUP BY date
      ),
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} AS bin_ts
      ),
      cumulative_data AS (
        SELECT
          ts.bin_ts AS timestamp,
          (SELECT initial_value FROM initial_count) +
          SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
        FROM time_series ts
        LEFT JOIN events_binned e
          ON e.bin_ts = ts.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_data
      ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new DelegatorsTimeseries({
      data: raw.map(
        (r: any) =>
          new DelegatorsEntry({
            timestamp: r.timestamp,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class TransfersByTypeTimeseries {
  @Field(() => [TransferCountByType])
  data!: TransferCountByType[]

  @Field(() => Number)
  step!: number

  constructor(props: Partial<TransfersByTypeTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class TransfersByTypeTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => TransfersByTypeTimeseries)
  async transfersByTypeTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<TransfersByTypeTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
        WITH
        time_series AS (
          SELECT ${generateTimeSeries(groupSize.label)} as timestamp
        ),
        transfer_counts AS (
          SELECT ${dateBin('timestamp', groupSize.label)} as date,
            count(*) FILTER (WHERE type = 'DEPOSIT') AS deposit,
            count(*) FILTER (WHERE type = 'WITHDRAW') AS withdraw,
            count(*) FILTER (WHERE type = 'CLAIM') AS reward,
            count(*) FILTER (WHERE type = 'RELEASE') AS release,
            count(*) FILTER (WHERE type NOT IN ('DEPOSIT', 'WITHDRAW', 'CLAIM', 'RELEASE')) AS transfer
          FROM transfer
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY date
        )
        SELECT 
          ts.timestamp as date,
          COALESCE(tc.deposit, 0) as deposit,
          COALESCE(tc.withdraw, 0) as withdraw,
          COALESCE(tc.transfer, 0) as transfer,
          COALESCE(tc.reward, 0) as reward,
          COALESCE(tc.release, 0) as release
        FROM time_series ts
        LEFT JOIN transfer_counts tc ON ts.timestamp = tc.date
        ORDER BY ts.timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new TransfersByTypeTimeseries({
      data: raw.map(
        (r: any) =>
          new TransferCountByType({
            timestamp: r.date,
            value: new TransferCountByTypeValue({
              deposit: parseInt(r.deposit),
              withdraw: parseInt(r.withdraw),
              transfer: parseInt(r.transfer),
              reward: parseInt(r.reward),
              release: parseInt(r.release),
            }),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class UniqueAccountsTimeseries {
  @Field(() => [UniqueAccountsEntry])
  data!: UniqueAccountsEntry[]

  @Field(() => Number)
  step!: number

  constructor(props: Partial<UniqueAccountsTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class UniqueAccountsTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => UniqueAccountsTimeseries)
  async uniqueAccountsTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<UniqueAccountsTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} as timestamp
      ),
      account_counts AS (
        SELECT 
          ${dateBin('t.timestamp', groupSize.label)} as date,
          COUNT(DISTINCT at.account_id) as value
        FROM transfer t
        INNER JOIN account_transfer at ON at.transfer_id = t.id
        WHERE t.timestamp >= $1 AND t.timestamp < $2
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(ac.value, 0) as value
      FROM time_series ts
      LEFT JOIN account_counts ac ON ts.timestamp = ac.date
      ORDER BY ts.timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new UniqueAccountsTimeseries({
      data: raw.map(
        (r: any) =>
          new UniqueAccountsEntry({
            timestamp: r.date,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class QueriesCountTimeseries {
  @Field(() => [QueriesCountEntry])
  data!: QueriesCountEntry[]

  @Field(() => Number)
  step!: number

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
  ): Promise<QueriesCountTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} as timestamp
      ),
      query_counts AS (
        SELECT ${dateBin('timestamp', groupSize.label)} as date, sum(queries) as value
        FROM worker_metrics
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(qc.value, 0) as value
      FROM time_series ts
      LEFT JOIN query_counts qc ON ts.timestamp = qc.date
      ORDER BY ts.timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new QueriesCountTimeseries({
      data: raw.map(
        (r: any) =>
          new QueriesCountEntry({
            timestamp: r.date,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class ServedDataTimeseries {
  @Field(() => [ServedDataEntry])
  data!: ServedDataEntry[]

  @Field(() => Number)
  step!: number

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
  ): Promise<ServedDataTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} as timestamp
      ),
      served_data_counts AS (
        SELECT ${dateBin('timestamp', groupSize.label)} as date, sum(served_data) as value
        FROM worker_metrics
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(sdc.value, 0) as value
      FROM time_series ts
      LEFT JOIN served_data_counts sdc ON ts.timestamp = sdc.date
      ORDER BY ts.timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new ServedDataTimeseries({
      data: raw.map(
        (r: any) =>
          new ServedDataEntry({
            timestamp: r.date,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class StoredDataTimeseries {
  @Field(() => [StoredDataEntry])
  data!: StoredDataEntry[]

  @Field(() => Number)
  step!: number

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
  ): Promise<StoredDataTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} as timestamp
      ),
      stored_data_counts AS (
        SELECT date, SUM(avg_stored_data) as value
        FROM (
          SELECT 
            ${dateBin('timestamp', groupSize.label)} as date,
            worker_id,
            AVG(stored_data) as avg_stored_data
          FROM worker_metrics
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY date, worker_id
        ) avg_per_worker
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(sdc.value, COALESCE(LAG(sdc.value) OVER (ORDER BY ts.timestamp), 0)) as value
      FROM time_series ts
      LEFT JOIN stored_data_counts sdc ON ts.timestamp = sdc.date
      ORDER BY ts.timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new StoredDataTimeseries({
      data: raw.map(
        (r: any) =>
          new StoredDataEntry({
            timestamp: r.date,
            value: parseInt(r.value),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class RewardTimeseries {
  @Field(() => [RewardEntry])
  data!: RewardEntry[]

  @Field(() => Number)
  step!: number

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
  ): Promise<RewardTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} as timestamp
      ),
      reward_counts AS (
        SELECT
          ${dateBin('wr.timestamp', groupSize.label)} as date,
          SUM(wr.amount) AS worker_value,
          SUM(wr.stakers_reward) AS staker_value
        FROM worker_reward as wr
        WHERE wr.timestamp >= $1 AND wr.timestamp < $2
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(rc.worker_value, 0) as worker_value,
        COALESCE(rc.staker_value, 0) as staker_value
      FROM time_series ts
      LEFT JOIN reward_counts rc ON ts.timestamp = rc.date
      ORDER BY ts.timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new RewardTimeseries({
      data: raw.map(
        (r: any) =>
          new RewardEntry({
            timestamp: r.date,
            value: new RewardValue({
              workerReward: BigInt(r.worker_value),
              stakerReward: BigInt(r.staker_value),
            }),
          }),
      ),
      step: groupSize.ms,
    })
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

@ObjectType()
class AprTimeseries {
  @Field(() => [AprEntry])
  data!: AprEntry[]

  @Field(() => Number)
  step!: number

  constructor(props: Partial<AprTimeseries>) {
    Object.assign(this, props)
  }
}

/*************************************
 * APR timeseries                    *
 *************************************/
@Resolver()
export class AprTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => AprTimeseries)
  async aprTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<AprTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize.label)

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize.label)} as timestamp
      ),
      apr_data AS (
        SELECT
          ${dateBin('timestamp', groupSize.label)} as date,
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS "workerApr",
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS "stakerApr"
        FROM worker_reward
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(ad."workerApr", 0) as "workerApr",
        COALESCE(ad."stakerApr", 0) as "stakerApr"
      FROM time_series ts
      LEFT JOIN apr_data ad ON ts.timestamp = ad.date
      ORDER BY ts.timestamp
      `,
      [alignedFrom, alignedTo],
    )

    return new AprTimeseries({
      data: raw.map(
        (r: any) =>
          new AprEntry({
            timestamp: r.date,
            value: new AprValue({
              workerApr: Number(r.workerApr),
              stakerApr: Number(r.stakerApr),
            }),
          }),
      ),
      step: groupSize.ms,
    })
  }
}
