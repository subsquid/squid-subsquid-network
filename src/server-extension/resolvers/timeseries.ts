import { DateTime } from '@subsquid/graphql-server'
import { max, min } from 'date-fns'
import { Arg, Field, ObjectType, Query, Resolver, registerEnumType } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { GroupSize, getGroupSize } from '~/utils/groupSize'

enum TvlType {
  WORKER = 'WORKER',
  DELEGATION = 'DELEGATION',
  PORTAL = 'PORTAL',
  PORTAL_POOL = 'PORTAL_POOL',
}

registerEnumType(TvlType, {
  name: 'TvlType',
})

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

/**
 * Period ends, anchored backward from $2 (to). Last period is always a full step;
 * first period may be shorter. bin_ts = exclusive upper bound of each period.
 * Generates: to, to-step, to-2*step, … while bin_ts > from, ascending.
 */
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

/**
 * Bucket join: day falls within [bin_ts - step, bin_ts).
 */
function binJoin(dayColumn: string, seriesColumn: string, groupSize: GroupSize): string {
  const interval = stepInterval(groupSize)
  return sql`${dayColumn} >= ${seriesColumn} - '${interval}'::interval AND ${dayColumn} < ${seriesColumn}`
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
  return { groupSize, from, to }
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

    const raw = await manager.query(
      sql`
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_holders_count_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_holders_count_daily
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
      (r: any) =>
        new HoldersCountEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new HoldersCountTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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

function getTvlTypeFilter(type: TvlType): string {
  switch (type) {
    case TvlType.WORKER:
      return 'worker_id IS NOT NULL'
    case TvlType.DELEGATION:
      return 'delegation_id IS NOT NULL'
    case TvlType.PORTAL:
      return 'gateway_stake_id IS NOT NULL'
    case TvlType.PORTAL_POOL:
      return 'portal_pool_id IS NOT NULL'
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
    @Arg('type', () => TvlType, { nullable: true }) type?: TvlType,
  ): Promise<LockedValueTimeseries> {
    const manager = await this.tx()
    const { from, to } = await normalizeTimeRange(manager, fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)

    let raw
    if (type) {
      const typeFilter = getTvlTypeFilter(type)
      raw = await manager.query(
        sql`
          WITH initial_value AS (
            SELECT COALESCE(SUM(
              CASE WHEN type = 'DEPOSIT' THEN amount WHEN type = 'WITHDRAW' THEN -amount ELSE 0 END
            ), 0) AS initial_locked
            FROM transfer
            WHERE type IN ('DEPOSIT', 'WITHDRAW') AND timestamp < ${TRUNC_FROM} AND ${typeFilter}
          ),
          daily AS (
            SELECT
              ${truncDayUtc('timestamp')} as day,
              SUM(CASE WHEN type = 'DEPOSIT' THEN amount WHEN type = 'WITHDRAW' THEN -amount ELSE 0 END) as delta
            FROM transfer
            WHERE type IN ('DEPOSIT', 'WITHDRAW') AND timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} AND ${typeFilter}
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
              (SELECT initial_locked FROM initial_value) +
              SUM(delta) OVER (ORDER BY bin_ts) AS value
            FROM binned
          )
          SELECT timestamp, value
          FROM cumulative_data
          ORDER BY timestamp
        `,
        [from, to],
      )
    } else {
      raw = await manager.query(
        sql`
          WITH initial_value AS (
            SELECT COALESCE(SUM(delta), 0) AS initial_locked
            FROM mv_locked_value_daily
            WHERE timestamp < ${TRUNC_FROM}
          ),
          daily AS (
            SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
            FROM mv_locked_value_daily
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
              (SELECT initial_locked FROM initial_value) +
              SUM(delta) OVER (ORDER BY bin_ts) AS value
            FROM binned
          )
          SELECT timestamp, value
          FROM cumulative_data
          ORDER BY timestamp
        `,
        [from, to],
      )
    }

    const data = raw.map(
      (r: any) =>
        new TvlEntry({
          timestamp: r.timestamp,
          value: BigInt(r.value),
        }),
    )

    return new LockedValueTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
      (r: any) =>
        new ActiveWorkersEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new ActiveWorkersTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
      (r: any) =>
        new OperatorsEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new UniqueOperatorsTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
      (r: any) =>
        new DelegationsEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new DelegationsTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
      (r: any) =>
        new DelegatorsEntry({
          timestamp: r.timestamp,
          value: parseInt(r.value),
        }),
    )

    return new DelegatorsTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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

    const raw = await manager.query(
      sql`
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT 
            ${truncDayUtc('timestamp')} as day,
            SUM(deposit) as deposit,
            SUM(withdraw) as withdraw,
            SUM(reward) as reward,
            SUM(release) as release,
            SUM(transfer) as transfer
          FROM mv_transfers_by_type_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        )
        SELECT 
          (ts.bin_ts - interval '1 second') as date,
          COALESCE(SUM(d.deposit), 0) as deposit,
          COALESCE(SUM(d.withdraw), 0) as withdraw,
          COALESCE(SUM(d.transfer), 0) as transfer,
          COALESCE(SUM(d.reward), 0) as reward,
          COALESCE(SUM(d.release), 0) as release
        FROM time_series ts
        LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
        ORDER BY ts.bin_ts
      `,
      [from, to],
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
      ...buildTimeseries(data, groupSize, from, to),
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

    // For daily or larger buckets, use materialized view and sum
    // Note: This is an approximation - actual unique count across days may be lower
    // due to overlapping accounts, but it's much faster
    const raw = await manager.query(
      sql`
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT 
            ${truncDayUtc('timestamp')} as day,
            SUM(value) as value
          FROM mv_unique_accounts_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
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
      [from, to],
    )

    const data = raw.map(
      (r: any) =>
        new UniqueAccountsEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new UniqueAccountsTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
    const { groupSize, from, to } = await prepareTimeseriesContext(manager, fromArg, toArg, step)

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
      (r: any) =>
        new QueriesCountEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new QueriesCountTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
    const { groupSize, from, to } = await prepareTimeseriesContext(manager, fromArg, toArg, step)

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
      (r: any) =>
        new ServedDataEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new ServedDataTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
    const { groupSize, from, to } = await prepareTimeseriesContext(manager, fromArg, toArg, step)

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
      (r: any) =>
        new StoredDataEntry({
          timestamp: r.date,
          value: parseInt(r.value),
        }),
    )

    return new StoredDataTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
    const { groupSize, from, to } = await prepareTimeseriesContext(manager, fromArg, toArg, step)

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
      (r: any) =>
        new UptimeEntry({
          timestamp: r.date,
          value: parseFloat(r.value),
        }),
    )

    return new UptimeTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
    const { groupSize, from, to } = await prepareTimeseriesContext(manager, fromArg, toArg, step)

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
          AND t.timestamp < ${TRUNC_TO}
          AND t.type NOT IN ('DEPOSIT', 'WITHDRAW')
      ),
      initial_balance AS (
        SELECT COALESCE(SUM(delta), 0) AS initial_value
        FROM all_transfers
        WHERE timestamp < ${TRUNC_FROM}
      ),
      balance_daily AS (
        SELECT
          ${truncDayUtc('timestamp')} AS day,
          SUM(delta) AS delta
        FROM all_transfers
        WHERE timestamp >= ${TRUNC_FROM}
        GROUP BY day
      ),
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      balance_binned AS (
        SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
        FROM time_series ts
        LEFT JOIN balance_daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
      ),
      cumulative_balance AS (
        SELECT
          (bin_ts - interval '1 second') AS timestamp,
          (SELECT initial_value FROM initial_balance) +
          SUM(delta) OVER (ORDER BY bin_ts) AS value
        FROM balance_binned
      )
      SELECT
        timestamp,
        value
      FROM cumulative_balance
      ORDER BY timestamp
      `,
      [from, to, accountId],
    )

    const data = raw.map(
      (r: any) =>
        new AccountBalanceEntry({
          timestamp: r.timestamp,
          value: r.value ? BigInt(r.value) : null,
        }),
    )

    return new AccountBalanceTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
    const { groupSize, from, to } = await prepareTimeseriesContext(manager, fromArg, toArg, step)

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

    return new RewardTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
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
    const { groupSize, from, to } = await prepareTimeseriesContext(manager, fromArg, toArg, step)

    let raw

    if (workerId) {
      // For specific worker, query raw data (materialized view doesn't have per-worker data)
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
      // For all workers, use materialized view with pre-computed overall median
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

    return new AprTimeseries({
      ...buildTimeseries(data, groupSize, from, to),
    })
  }
}
