import { DateTime, BigInteger } from '@subsquid/graphql-server'
import { max, min } from 'date-fns'
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { type GroupSize, getGroupSize } from '@sqd/shared'

let cachedFirstEventTimestamp: Date | null = null

async function getFirstEventTimestamp(manager: EntityManager): Promise<Date | null> {
  if (cachedFirstEventTimestamp) {
    return cachedFirstEventTimestamp
  }

  const result = await manager.query('SELECT MIN(timestamp) as min_timestamp FROM pool_event')
  if (result[0]?.min_timestamp) {
    cachedFirstEventTimestamp = new Date(result[0].min_timestamp)
  }

  return cachedFirstEventTimestamp
}

async function normalizeTimeRange(
  manager: EntityManager,
  from?: Date,
  to?: Date,
): Promise<{ from: Date; to: Date }> {
  const firstEvent = await getFirstEventTimestamp(manager)
  const defaultFrom = firstEvent || new Date('2020-01-01')

  const initialFrom = from || defaultFrom
  const normalizedFrom = from && firstEvent ? max([from, firstEvent]) : initialFrom

  const normalizedTo = min([to || new Date(), new Date()])
  const finalFrom = min([normalizedFrom, normalizedTo])

  return { from: finalFrom, to: normalizedTo }
}

function getGroupSizeInfo(
  from: Date,
  to: Date,
  step?: string,
): GroupSize {
  return getGroupSize(
    step ? step : { from, to, maxPoints: 50 },
  )
}

function msToInterval(ms: number): string {
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
    $2::timestamptz,
    '${interval}'::interval
  )`
}

function trimNullValues<T extends { value: any }>(data: T[]): T[] {
  if (data.length === 0) return data

  let firstNonNullIndex = 0
  while (firstNonNullIndex < data.length && isValueNull(data[firstNonNullIndex].value)) {
    firstNonNullIndex++
  }

  let lastNonNullIndex = data.length - 1
  while (lastNonNullIndex >= 0 && isValueNull(data[lastNonNullIndex].value)) {
    lastNonNullIndex--
  }

  if (firstNonNullIndex > lastNonNullIndex) {
    return []
  }

  return data.slice(firstNonNullIndex, lastNonNullIndex + 1)
}

function isValueNull(value: any): boolean {
  if (value == null) return true

  if (typeof value === 'object' && value !== null) {
    return Object.values(value).every((v) => v == null || v === 0 || v === 0n)
  }

  if (value === 0 || value === 0n) return true

  return false
}

async function prepareTimeseriesContext(
  manager: EntityManager,
  fromArg?: Date,
  toArg?: Date,
  step?: string,
  poolId?: string,
): Promise<{ groupSize: GroupSize; alignedFrom: Date; alignedTo: Date }> {
  let { from, to } = await normalizeTimeRange(manager, fromArg, toArg)

  if (poolId) {
    const poolResult = await manager.query(
      'SELECT created_at FROM portal_pool WHERE id = $1',
      [poolId],
    )
    if (poolResult[0]?.created_at) {
      const poolCreatedAt = new Date(poolResult[0].created_at)
      from = max([from, poolCreatedAt])
    }
  }

  const groupSize = getGroupSizeInfo(from, to, step)
  const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize)
  return { groupSize, alignedFrom, alignedTo }
}

/* Pool TVL Timeseries */

@ObjectType()
class PoolTvlValue {
  @Field(() => BigInteger)
  tvlTotal!: bigint

  @Field(() => BigInteger)
  tvlStable!: bigint

  constructor(props: Partial<PoolTvlValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class PoolTvlEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => PoolTvlValue)
  value!: PoolTvlValue

  constructor(props: Partial<PoolTvlEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class PoolTvlTimeseries {
  @Field(() => [PoolTvlEntry])
  data!: PoolTvlEntry[]

  @Field(() => Number)
  step!: number

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

  constructor(props: Partial<PoolTvlTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class PoolTvlTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => PoolTvlTimeseries)
  async poolTvlTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('poolId', { nullable: true }) poolId?: string,
  ): Promise<PoolTvlTimeseries> {
    const manager = await this.tx()
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
      poolId,
    )

    const poolFilter = poolId ? sql`AND pool_id = $3` : ''
    const params = poolId ? [alignedFrom, alignedTo, poolId] : [alignedFrom, alignedTo]

    const raw = await manager.query(
      sql`
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      events_binned AS (
        SELECT
          ${dateBin('timestamp', groupSize)} as bin_ts,
          SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN 0
            WHEN event_type = 'EXIT' THEN -amount
          END) as stable_delta,
          SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN -amount
            WHEN event_type = 'EXIT' THEN 0
          END) as total_delta
        FROM pool_event
        WHERE event_type IN ('DEPOSIT', 'WITHDRAWAL', 'EXIT')
          AND ${dateBin('timestamp', groupSize)} >= $1 AND ${dateBin('timestamp', groupSize)} <= $2 ${poolFilter}
        GROUP BY bin_ts
      ),
      initial_tvl AS (
        SELECT
          COALESCE(SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN 0
            WHEN event_type = 'EXIT' THEN -amount
          END), 0) as initial_stable,
          COALESCE(SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN -amount
            WHEN event_type = 'EXIT' THEN 0
          END), 0) as initial_total
        FROM pool_event
        WHERE event_type IN ('DEPOSIT', 'WITHDRAWAL', 'EXIT')
          AND timestamp < $1 ${poolFilter}
      ),
      cumulative_tvl AS (
        SELECT
          ts.timestamp,
          (SELECT initial_stable FROM initial_tvl) +
          SUM(COALESCE(eb.stable_delta, 0)) OVER (ORDER BY ts.timestamp) as tvl_stable,
          (SELECT initial_total FROM initial_tvl) +
          SUM(COALESCE(eb.total_delta, 0)) OVER (ORDER BY ts.timestamp) as tvl_total
        FROM time_series ts
        LEFT JOIN events_binned eb ON ts.timestamp = eb.bin_ts
      )
      SELECT timestamp, tvl_total, tvl_stable
      FROM cumulative_tvl
      ORDER BY timestamp
      `,
      params,
    )

    const data = raw.map(
      (r: any) =>
        new PoolTvlEntry({
          timestamp: r.timestamp,
          value: new PoolTvlValue({
            tvlTotal: BigInt(r.tvl_total),
            tvlStable: BigInt(r.tvl_stable),
          }),
        }),
    )

    return new PoolTvlTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
    })
  }
}

/* Pool APY Timeseries */

@ObjectType()
class PoolApyEntry {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number)
  value!: number

  constructor(props: Partial<PoolApyEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class PoolApyTimeseries {
  @Field(() => [PoolApyEntry])
  data!: PoolApyEntry[]

  @Field(() => Number)
  step!: number

  @Field(() => DateTime)
  from!: Date

  @Field(() => DateTime)
  to!: Date

  constructor(props: Partial<PoolApyTimeseries>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class PoolApyTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => PoolApyTimeseries)
  async poolApyTimeseries(
    @Arg('from', { nullable: true }) fromArg?: Date,
    @Arg('to', { nullable: true }) toArg?: Date,
    @Arg('step', { nullable: true }) step?: string,
    @Arg('poolId', { nullable: true }) poolId?: string,
  ): Promise<PoolApyTimeseries> {
    const manager = await this.tx()
    const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(
      manager,
      fromArg,
      toArg,
      step,
      poolId,
    )

    const poolFilter = poolId ? 'AND pool_id = $3' : ''
    const poolWhereClause = poolId ? 'WHERE id = $3' : ''
    const params = poolId ? [alignedFrom, alignedTo, poolId] : [alignedFrom, alignedTo]

    const query = `
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      rate_history AS (
        SELECT
          ${dateBin('timestamp', groupSize)} as bin_ts,
          LAST_VALUE(new_rate) OVER (
            PARTITION BY ${dateBin('timestamp', groupSize)}
            ORDER BY timestamp
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          ) as reward_rate
        FROM pool_distribution_rate_change
        WHERE ${dateBin('timestamp', groupSize)} >= $1 AND ${dateBin('timestamp', groupSize)} <= $2 ${poolFilter}
      ),
      capacity_history AS (
        SELECT
          ${dateBin('timestamp', groupSize)} as bin_ts,
          LAST_VALUE(new_capacity) OVER (
            PARTITION BY ${dateBin('timestamp', groupSize)}
            ORDER BY timestamp
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          ) as capacity
        FROM pool_capacity_change
        WHERE ${dateBin('timestamp', groupSize)} >= $1 AND ${dateBin('timestamp', groupSize)} < $2 ${poolFilter}
      ),
      initial_rate AS (
        SELECT COALESCE(
          (SELECT new_rate FROM pool_distribution_rate_change 
           WHERE timestamp < $1 ${poolFilter}
           ORDER BY timestamp DESC LIMIT 1),
          (SELECT reward_rate FROM portal_pool ${poolWhereClause} LIMIT 1),
          0
        ) as rate
      ),
      initial_capacity AS (
        SELECT COALESCE(
          (SELECT new_capacity FROM pool_capacity_change 
           WHERE timestamp < $1 ${poolFilter}
           ORDER BY timestamp DESC LIMIT 1),
          (SELECT capacity FROM portal_pool ${poolWhereClause} LIMIT 1),
          0
        ) as capacity
      )
      SELECT
        ts.timestamp,
        COALESCE(rh.reward_rate, (SELECT rate FROM initial_rate)) as reward_rate,
        COALESCE(ch.capacity, (SELECT capacity FROM initial_capacity)) as capacity
      FROM time_series ts
      LEFT JOIN rate_history rh ON ts.timestamp = rh.bin_ts
      LEFT JOIN capacity_history ch ON ts.timestamp = ch.bin_ts
      ORDER BY ts.timestamp
    `

    const raw = await manager.query(query, params)

    const data = raw.map((r: any) => {
      const rewardRate = BigInt(r.reward_rate || 0)
      const capacity = BigInt(r.capacity || 0)

      const secondsPerYear = 365 * 24 * 3600
      let apy = 0

      if (capacity > 0n) {
        apy = (Number(rewardRate) * secondsPerYear / 1000) / Number(capacity)
      }

      return new PoolApyEntry({
        timestamp: r.timestamp,
        value: apy,
      })
    })

    return new PoolApyTimeseries({
      data: trimNullValues(data),
      step: groupSize.ms,
      from: alignedFrom,
      to: alignedTo,
    })
  }
}
