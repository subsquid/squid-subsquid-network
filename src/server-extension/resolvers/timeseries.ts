import { DateTime } from '@subsquid/graphql-server'
import { max, min } from 'date-fns'
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { GroupSize, getGroupSize } from '~/utils/groupSize'

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

function msToInterval(ms: number): string {
  // Convert milliseconds to PostgreSQL interval format
  // Use the largest unit that divides evenly
  const seconds = ms / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if (days >= 1 && days === Math.floor(days)) {
    return `${days} days`
  } else if (hours >= 1 && hours === Math.floor(hours)) {
    return `${hours} hours`
  } else if (minutes >= 1 && minutes === Math.floor(minutes)) {
    return `${minutes} minutes`
  } else {
    return `${seconds} seconds`
  }
}

async function getAlignedDates(
  manager: EntityManager,
  from: Date,
  to: Date,
  groupSize: GroupSize,
): Promise<{ alignedFrom: Date; alignedTo: Date }> {
  // Convert ms to a fixed-length interval for date_bin
  const interval = msToInterval(groupSize.ms)

  const result = await manager.query(
    `SELECT
      date_bin('${interval}', $1::timestamptz, '2001-01-01'::timestamp) as aligned_from,
      date_bin('${interval}', $2::timestamptz, '2001-01-01'::timestamp) as aligned_to`,
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

function dateBin(column: string, groupSize: GroupSize): string {
  const interval = msToInterval(groupSize.ms)
  return sql`date_bin('${interval}', ${column}, '2001-01-01'::timestamp)`
}

function generateTimeSeries(groupSize: GroupSize): string {
  const interval = msToInterval(groupSize.ms)
  return sql`generate_series(
    $1::timestamptz,
    $2::timestamptz - '${interval}'::interval,
    '${interval}'::interval
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

  // Handle objects like AprValue where all properties might be null or zero
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).every((v) => v == null || v === 0 || v === 0n)
  }

  // Handle numeric zero values (both number and bigint)
  if (value === 0 || value === 0n) return true

  return false
}

/**
 * Helper to build worker filter SQL and parameters
 */
function buildWorkerFilter(workerId?: string): {
  filter: string
  params: (Date | string)[]
  paramIndex: number
} {
  if (workerId) {
    return {
      filter: sql`AND worker_id = $3`,
      params: [] as any[], // Will be filled by caller with [from, to, workerId]
      paramIndex: 3,
    }
  }
  return {
    filter: '',
    params: [] as any[], // Will be filled by caller with [from, to]
    paramIndex: 2,
  }
}

/**
 * Prepare timeseries query context
 */
async function prepareTimeseriesContext(
  manager: EntityManager,
  fromArg?: Date,
  toArg?: Date,
  step?: string,
) {
  const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
  const groupSize = getGroupSizeInfo(from, to, step)
  const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)
  return { from, to, groupSize, alignedFrom, alignedTo }
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_holders_count_daily
          WHERE timestamp < $1
        ),
        events_binned AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as bin_ts,
            SUM(delta) as delta
          FROM mv_holders_count_daily
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY bin_ts
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e ON e.bin_ts = ts.bin_ts
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    const data = raw.map(
      (r: any) =>
        new HoldersCountEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new HoldersCountTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    const raw = await manager.query(
      sql`
        WITH initial_value AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_locked
          FROM mv_locked_value_daily
          WHERE timestamp < $1
        ),
        events_binned AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as bin_ts,
            SUM(delta) as delta
          FROM mv_locked_value_daily
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY bin_ts
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_locked FROM initial_value) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e ON e.bin_ts = ts.bin_ts
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    const data = raw.map(
      (r: any) =>
        new TvlEntry({
          timestamp: r.timestamp,
          value: BigInt(r.value),
        }),
    )

    return new LockedValueTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_active_workers_daily
          WHERE timestamp < $1
        ),
        events_binned AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as bin_ts,
            SUM(delta) as delta
          FROM mv_active_workers_daily
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY bin_ts
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e ON e.bin_ts = ts.bin_ts
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    const data = raw.map(
      (r: any) =>
        new ActiveWorkersEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new ActiveWorkersTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_unique_operators_daily
          WHERE timestamp < $1
        ),
        events_binned AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as bin_ts,
            SUM(delta) as delta
          FROM mv_unique_operators_daily
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY bin_ts
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e ON e.bin_ts = ts.bin_ts
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    const data = raw.map(
      (r: any) =>
        new OperatorsEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new UniqueOperatorsTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_delegations_daily
          WHERE timestamp < $1
        ),
        events_binned AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as bin_ts,
            SUM(delta) as delta
          FROM mv_delegations_daily
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY bin_ts
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e ON e.bin_ts = ts.bin_ts
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    const data = raw.map(
      (r: any) =>
        new DelegationsEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new DelegationsTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_delegators_daily
          WHERE timestamp < $1
        ),
        events_binned AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as bin_ts,
            SUM(delta) as delta
          FROM mv_delegators_daily
          WHERE timestamp >= $1 AND timestamp < $2
          GROUP BY bin_ts
        ),
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} AS bin_ts
        ),
        cumulative_data AS (
          SELECT
            ts.bin_ts AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(COALESCE(e.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
          FROM time_series ts
          LEFT JOIN events_binned e ON e.bin_ts = ts.bin_ts
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `,
      [alignedFrom, alignedTo],
    )

    const data = raw.map(
      (r: any) =>
        new DelegatorsEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new DelegatorsTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    const raw = await manager.query(
      sql`
        WITH
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} as timestamp
        ),
        transfer_counts AS (
          SELECT 
            ${dateBin('timestamp', groupSize)} as date,
            SUM(deposit) as deposit,
            SUM(withdraw) as withdraw,
            SUM(reward) as reward,
            SUM(release) as release,
            SUM(transfer) as transfer
          FROM mv_transfers_by_type_daily
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

    const data = raw.map(
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
    )

    return new TransfersByTypeTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)

    // For daily or larger buckets, use materialized view and sum
    // Note: This is an approximation - actual unique count across days may be lower
    // due to overlapping accounts, but it's much faster
    const raw = await manager.query(
      sql`
        WITH
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} as timestamp
        ),
        account_counts AS (
          SELECT 
            ${dateBin('timestamp', groupSize)} as date,
            SUM(value) as value
          FROM mv_unique_accounts_daily
          WHERE timestamp >= $1 AND timestamp < $2
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

    const data = raw.map(
      (r: any) =>
        new UniqueAccountsEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new UniqueAccountsTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
    )

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [alignedFrom, alignedTo, workerId] : [alignedFrom, alignedTo]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      query_counts AS (
        SELECT ${dateBin('timestamp', groupSize)} as date, sum(value) as value
        FROM mv_queries_daily
        WHERE timestamp >= $1 AND timestamp < $2 ${workerFilter}
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(qc.value, 0) as value
      FROM time_series ts
      LEFT JOIN query_counts qc ON ts.timestamp = qc.date
      ORDER BY ts.timestamp
      `,
      params,
    )

    const data = raw.map(
      (r: any) =>
        new QueriesCountEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new QueriesCountTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
    )

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [alignedFrom, alignedTo, workerId] : [alignedFrom, alignedTo]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      served_data_counts AS (
        SELECT ${dateBin('timestamp', groupSize)} as date, sum(value) as value
        FROM mv_served_data_daily
        WHERE timestamp >= $1 AND timestamp < $2 ${workerFilter}
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(sdc.value, 0) as value
      FROM time_series ts
      LEFT JOIN served_data_counts sdc ON ts.timestamp = sdc.date
      ORDER BY ts.timestamp
      `,
      params,
    )

    const data = raw.map(
      (r: any) =>
        new ServedDataEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new ServedDataTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
    )

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [alignedFrom, alignedTo, workerId] : [alignedFrom, alignedTo]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      stored_data_counts AS (
        SELECT date, SUM(avg_per_worker) as value
        FROM (
          SELECT 
            ${dateBin('timestamp', groupSize)} as date,
            worker_id,
            AVG(value) as avg_per_worker
          FROM mv_stored_data_daily
          WHERE timestamp >= $1 AND timestamp < $2 ${workerFilter}
          GROUP BY date, worker_id
        ) worker_averages
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(sdc.value, COALESCE(LAG(sdc.value) OVER (ORDER BY ts.timestamp), 0)) as value
      FROM time_series ts
      LEFT JOIN stored_data_counts sdc ON ts.timestamp = sdc.date
      ORDER BY ts.timestamp
      `,
      params,
    )

    const data = raw.map(
      (r: any) =>
        new StoredDataEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new StoredDataTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
    })
  }
}

/*************************************
| * Uptime timeseries                 *
 *************************************/
@ObjectType()
class UptimeEntry {
  @Field(() => DateTime)
  timestamp!: Date
  @Field(() => Number, { nullable: true })
  value!: number | null

  constructor(props: Partial<UptimeEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class UptimeTimeseries {
  @Field(() => [UptimeEntry])
  data!: UptimeEntry[]

  @Field(() => Number)
  step!: number

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
    )

    const { filter: workerFilter } = buildWorkerFilter(workerId)
    const params = workerId ? [alignedFrom, alignedTo, workerId] : [alignedFrom, alignedTo]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      uptime_data AS (
        SELECT 
          ${dateBin('timestamp', groupSize)} as date,
          AVG(value) as value
        FROM mv_uptime_daily
        WHERE timestamp >= $1 AND timestamp < $2 ${workerFilter}
        GROUP BY date
      )
      SELECT 
        ts.timestamp as date,
        COALESCE(ud.value, 0) as value
      FROM time_series ts
      LEFT JOIN uptime_data ud ON ts.timestamp = ud.date
      ORDER BY ts.timestamp
      `,
      params,
    )

    const data = raw.map(
      (r: any) =>
        new UptimeEntry({
          timestamp: r.date,
          value: parseFloat(r.value),
        }),
    )

    return new UptimeTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
    })
  }
}

/*************************************
| * Account balance history timeseries *
 *************************************/
@ObjectType()
class AccountBalanceEntry {
  @Field(() => DateTime)
  timestamp!: Date
  @Field(() => BigInt, { nullable: true })
  value!: bigint | null

  constructor(props: Partial<AccountBalanceEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class AccountBalanceTimeseries {
  @Field(() => [AccountBalanceEntry])
  data!: AccountBalanceEntry[]

  @Field(() => Number)
  step!: number

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

  constructor(props: Partial<AccountBalanceTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class AccountBalanceTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => AccountBalanceTimeseries)
  async accountBalanceTimeseries(
    @Arg('accountId') accountId: string,
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
  ): Promise<AccountBalanceTimeseries> {
    const manager = await this.tx()
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
    )

    const raw = await manager.query(
      sql`
      WITH
      owned_accounts AS (
        SELECT id FROM account WHERE id = $3
        UNION ALL
        SELECT id FROM account WHERE owner_id = $3
      ),
      all_transfers AS (
        SELECT
          t.timestamp,
          CASE 
            WHEN at.direction = 'TO' THEN t.amount
            WHEN at.direction = 'FROM' THEN -t.amount
            ELSE 0
          END AS delta
        FROM account_transfer at
        INNER JOIN transfer t ON at.transfer_id = t.id
        WHERE at.account_id IN (SELECT id FROM owned_accounts)
          AND t.timestamp < $2
          AND t.type NOT IN ('DEPOSIT', 'WITHDRAW')
      ),
      initial_balance AS (
        SELECT COALESCE(SUM(delta), 0) AS initial_value
        FROM all_transfers
        WHERE timestamp < $1
      ),
      balance_deltas AS (
        SELECT
          ${dateBin('timestamp', groupSize)} AS bin_ts,
          SUM(delta) AS delta
        FROM all_transfers
        WHERE timestamp >= $1
        GROUP BY bin_ts
      ),
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} AS bin_ts
      ),
      cumulative_balance AS (
        SELECT
          ts.bin_ts AS timestamp,
          (SELECT initial_value FROM initial_balance) +
          SUM(COALESCE(bd.delta, 0)) OVER (ORDER BY ts.bin_ts) AS value
        FROM time_series ts
        LEFT JOIN balance_deltas bd ON ts.bin_ts = bd.bin_ts
      )
      SELECT
        timestamp,
        value
      FROM cumulative_balance
      ORDER BY timestamp
      `,
      [alignedFrom, alignedTo, accountId],
    )

    const data = raw.map(
      (r: any) =>
        new AccountBalanceEntry({
          timestamp: r.timestamp,
          value: r.value ? BigInt(r.value) : null,
        }),
    )

    return new AccountBalanceTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
    })
  }
}

/*************************************
| * Cumulative reward timeseries      *
 *************************************/
@ObjectType()
class CumulativeRewardValue {
  @Field(() => BigInt)
  workerReward!: bigint
  @Field(() => BigInt)
  stakerReward!: bigint

  constructor(props: Partial<CumulativeRewardValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class CumulativeRewardEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => CumulativeRewardValue, { nullable: true })
  value!: CumulativeRewardValue | null

  constructor(props: Partial<CumulativeRewardEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class CumulativeRewardTimeseries {
  @Field(() => [CumulativeRewardEntry])
  data!: CumulativeRewardEntry[]

  @Field(() => Number)
  step!: number

  constructor(props: Partial<CumulativeRewardTimeseries>) {
    Object.assign(this, props)
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
    )

    const workerFilter = workerId ? sql`AND worker_id = $3` : ''
    const params = workerId ? [alignedFrom, alignedTo, workerId] : [alignedFrom, alignedTo]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      reward_counts AS (
        SELECT
          ${dateBin('timestamp', groupSize)} as date,
          SUM(worker_value) AS worker_value,
          SUM(staker_value) AS staker_value
        FROM mv_reward_daily
        WHERE timestamp >= $1 AND timestamp < $2 ${workerFilter}
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

    return new RewardTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
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

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

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
    @Arg('workerId', { nullable: true }) workerId?: string,
  ): Promise<AprTimeseries> {
    const manager = await this.tx()
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
    )

    let raw

    if (workerId) {
      // For specific worker, query raw data (materialized view doesn't have per-worker data)
      const params = [alignedFrom, alignedTo, workerId]
      raw = await manager.query(
        sql`
        WITH
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} as timestamp
        ),
        apr_data AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as date,
            COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS "workerApr",
            COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS "stakerApr"
          FROM worker_reward
          WHERE timestamp >= $1 AND timestamp < $2 AND worker_id = $3
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
        params,
      )
    } else {
      // For all workers, use materialized view with pre-computed overall median
      const params = [alignedFrom, alignedTo]
      raw = await manager.query(
        sql`
        WITH
        time_series AS (
          SELECT ${generateTimeSeries(groupSize)} as timestamp
        ),
        apr_data AS (
          SELECT
            ${dateBin('timestamp', groupSize)} as date,
            AVG(worker_apr) FILTER (WHERE worker_apr > 0) AS "workerApr",
            AVG(staker_apr) FILTER (WHERE staker_apr > 0) AS "stakerApr"
          FROM mv_apr_daily
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

    return new AprTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
    })
  }
}
