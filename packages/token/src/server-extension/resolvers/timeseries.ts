import { type GroupSize, getGroupSize, network } from '@sqd/shared'
import { DateTime } from '@subsquid/graphql-server'
import { Arg, Field, ObjectType, Query, Resolver, registerEnumType } from 'type-graphql'
import { EntityManager } from 'typeorm'

const INITIAL_TIMESTAMP =
  network.name === 'mainnet' ? new Date('2024-03-25T16:55:45Z') : new Date('2024-01-10T00:32:20Z')

enum TvlType {
  WORKER = 'WORKER',
  DELEGATION = 'DELEGATION',
  PORTAL = 'PORTAL',
  PORTAL_POOL = 'PORTAL_POOL',
}

registerEnumType(TvlType, {
  name: 'TvlType',
})

function normalizeTimeRange(from?: Date, to?: Date): { from: Date; to: Date } {
  const now = new Date()
  const normalizedTo = to != null && to < now ? to : now
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

/* Holders count */

@ObjectType()
class HoldersCountEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<HoldersCountEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class HoldersCountTimeseries {
  @Field(() => [HoldersCountEntry]) data!: HoldersCountEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
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
    const { from, to } = normalizeTimeRange(fromArg, toArg)
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
      (r: any) => new HoldersCountEntry({ timestamp: r.timestamp, value: parseInt(r.value) }),
    )
    return new HoldersCountTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Locked value (TVL) */

@ObjectType()
class TvlEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => BigInt, { nullable: true }) value!: bigint | null
  constructor(props: Partial<TvlEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class LockedValueTimeseries {
  @Field(() => [TvlEntry]) data!: TvlEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
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
    const { from, to } = normalizeTimeRange(fromArg, toArg)
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
      (r: any) => new TvlEntry({ timestamp: r.timestamp, value: BigInt(r.value) }),
    )
    return new LockedValueTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Transfers by type */

@ObjectType()
class TransferCountByTypeValue {
  @Field(() => Number) deposit!: number
  @Field(() => Number) withdraw!: number
  @Field(() => Number) transfer!: number
  @Field(() => Number) reward!: number
  @Field(() => Number) release!: number
  constructor(props: Partial<TransferCountByTypeValue>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class TransferCountByType {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => TransferCountByTypeValue, { nullable: true }) value!: TransferCountByTypeValue | null
  constructor(props: Partial<TransferCountByType>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class TransfersByTypeTimeseries {
  @Field(() => [TransferCountByType]) data!: TransferCountByType[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
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
    const { from, to } = normalizeTimeRange(fromArg, toArg)
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
    return new TransfersByTypeTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Unique accounts */

@ObjectType()
class UniqueAccountsEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => Number, { nullable: true }) value!: number | null
  constructor(props: Partial<UniqueAccountsEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class UniqueAccountsTimeseries {
  @Field(() => [UniqueAccountsEntry]) data!: UniqueAccountsEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
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
    const { from, to } = normalizeTimeRange(fromArg, toArg)
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
      (r: any) => new UniqueAccountsEntry({ timestamp: r.date, value: parseInt(r.value) }),
    )
    return new UniqueAccountsTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}

/* Account balance history */

@ObjectType()
class AccountBalanceEntry {
  @Field(() => DateTime) timestamp!: Date
  @Field(() => BigInt, { nullable: true }) value!: bigint | null
  constructor(props: Partial<AccountBalanceEntry>) {
    Object.assign(this, props)
  }
}

@ObjectType()
class AccountBalanceTimeseries {
  @Field(() => [AccountBalanceEntry]) data!: AccountBalanceEntry[]
  @Field(() => Number) step!: number
  @Field(() => DateTime) from!: Date
  @Field(() => DateTime) to!: Date
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
    const { from, to } = normalizeTimeRange(fromArg, toArg)
    const groupSize = getGroupSizeInfo(from, to, step)

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
    return new AccountBalanceTimeseries({ ...buildTimeseries(data, groupSize, from, to) })
  }
}
