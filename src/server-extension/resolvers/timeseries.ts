import { DateTime } from '@subsquid/graphql-server'
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AprSnapshot } from './summary'

/*************************************
 * Holders count timeseries          *
 *************************************/
@ObjectType()
class HoldersCountEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  dailyChange!: number

  @Field(() => Number)
  holders!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<HoldersCountEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      WITH daily_balances AS NOT MATERIALIZED (
        SELECT
          t.date_trunc('day', timestamp) as date,
          account_id,
          (array_agg(balance ORDER BY t.id DESC))[1] as balance,
          SUM (CASE WHEN direction = 'FROM' THEN - t.amount WHEN direction = 'TO' THEN t.amount ELSE 0 END) as change
        FROM account_transfer
        LEFT JOIN transfer as t ON transfer_id = t.id
        WHERE t.timestamp >= $1 AND t.timestamp < $2
        GROUP BY date, account_id
      ),
      daily_changes AS NOT MATERIALIZED (
        SELECT
          date,
          SUM (CASE WHEN balance > 0 AND change = balance THEN 1 WHEN balance = 0 AND change < 0 THEN -1 ELSE 0 END) as daily_change
        FROM daily_balances
        GROUP BY date
      )
      SELECT
        date,
        daily_change as "dailyChange",
        SUM(daily_change) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS holders
      FROM daily_changes
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new HoldersCountEntry(r))
  }
}

/*************************************
 * Vesting value timeseries          *
 *************************************/
@ObjectType()
class VestingValueEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  vesting!: number

  @Field(() => Number)
  bonded!: number

  @Field(() => Number)
  delegated!: number

  @Field(() => Number)
  released!: number

  constructor(props: Partial<VestingValueEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class VestingValueTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [VestingValueEntry])
  async vestingValueTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<VestingValueEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      /* Panel 14 SQL simplified for variable dates */
      WITH vesting AS (
        SELECT date_trunc('day', timestamp) as date,
          sum(CASE WHEN t.type = 'TRANSFER' AND a.type = 'VESTING' THEN amount WHEN t.type = 'RELEASE' THEN -amount ELSE 0 END) / 1e18 as amount
        FROM transfer as t
        JOIN account as a ON a.id = t.to_id
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY date
      ),
      bonded AS (
        SELECT date_trunc('day', timestamp) as date,
          sum(CASE WHEN t.type = 'DEPOSIT' AND af.type = 'VESTING' THEN amount WHEN t.type = 'WITHDRAW' AND at.type = 'VESTING' THEN -amount ELSE 0 END) / 1e18 as amount
        FROM transfer as t
        JOIN account as af ON af.id = t.from_id
        JOIN account as at ON at.id = t.to_id
        WHERE worker_id IS NOT NULL AND timestamp >= $1 AND timestamp < $2
        GROUP BY date
      ),
      delegated AS (
        SELECT date_trunc('day', timestamp) as date,
          sum(CASE WHEN t.type = 'DEPOSIT' AND af.type = 'VESTING' THEN amount WHEN t.type = 'WITHDRAW' AND at.type = 'VESTING' THEN -amount ELSE 0 END) / 1e18 as amount
        FROM transfer as t
        JOIN account as af ON af.id = t.from_id
        JOIN account as at ON at.id = t.to_id
        WHERE delegation_id IS NOT NULL AND timestamp >= $1 AND timestamp < $2
        GROUP BY date
      ),
      released AS (
        SELECT date_trunc('day', timestamp) as date, sum(amount) / 1e18 as amount
        FROM transfer
        WHERE type = 'RELEASE' AND timestamp >= $1 AND timestamp < $2
        GROUP BY date
      )
      SELECT d.date,
        COALESCE(v.amount,0) as vesting,
        COALESCE(b.amount,0) as bonded,
        COALESCE(de.amount,0) as delegated,
        COALESCE(r.amount,0) as released
      FROM generate_series($1::date, ($2 - interval '1 day')::date, interval '1 day') d(date)
      LEFT JOIN vesting v ON v.date = d.date
      LEFT JOIN bonded b ON b.date = d.date
      LEFT JOIN delegated de ON de.date = d.date
      LEFT JOIN released r ON r.date = d.date
      ORDER BY d.date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new VestingValueEntry(r))
  }
}

/*************************************
 * Locked value (TVL) timeseries     *
 *************************************/
@ObjectType()
class TvlEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  dailyChange!: number

  @Field(() => Number)
  tvl!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<TvlEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      WITH filtered_events AS (
        SELECT t.date_trunc('day', timestamp) AS event_date,
          CASE WHEN t.type = 'DEPOSIT' THEN t.amount WHEN t.type = 'WITHDRAW' THEN - t.amount ELSE 0 END AS change_value
        FROM transfer t
        WHERE t.type in ('DEPOSIT', 'WITHDRAW') AND t.timestamp >= $1 AND t.timestamp < $2
      ),
      daily_changes AS (
        SELECT event_date, SUM(change_value) / 1e18 AS daily_change
        FROM filtered_events
        GROUP BY event_date
      )
      SELECT event_date AS date,
        daily_change as "dailyChange",
        SUM(daily_change) OVER (ORDER BY event_date) AS tvl
      FROM daily_changes
      ORDER BY event_date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new TvlEntry(r))
  }
}

/*************************************
 * Active workers timeseries         *
 *************************************/
@ObjectType()
class ActiveWorkersEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  dailyChange!: number

  @Field(() => Number)
  activeWorkers!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<ActiveWorkersEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      WITH filtered_events AS (
        SELECT COALESCE(wsc.timestamp, LAG(wsc.timestamp) OVER (PARTITION BY wsc.worker_id ORDER BY wsc.block_number ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING))::date AS event_date,
          CASE WHEN wsc.status = 'ACTIVE' THEN 1 WHEN wsc.status = 'DEREGISTERED' THEN -1 ELSE 0 END AS change_value
        FROM worker_status_change wsc
        WHERE wsc.pending = false AND wsc.timestamp >= $1 AND wsc.timestamp < $2
      ),
      daily_changes AS (
        SELECT event_date, SUM(change_value) AS daily_change FROM filtered_events WHERE event_date IS NOT NULL GROUP BY event_date
      )
      SELECT event_date AS date,
        daily_change as "dailyChange",
        SUM(daily_change) OVER (ORDER BY event_date) AS "activeWorkers"
      FROM daily_changes
      ORDER BY event_date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new ActiveWorkersEntry(r))
  }
}

/*************************************
 * Online workers timeseries         *
 *************************************/
@ObjectType()
class OnlineWorkersEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  online!: number

  constructor(props: Partial<OnlineWorkersEntry>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class OnlineWorkersTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [OnlineWorkersEntry])
  async onlineWorkersTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<OnlineWorkersEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      SELECT date_trunc('day', timestamp) as date,
        count(DISTINCT worker_id) as online
      FROM worker_metrics
      WHERE uptime > 0 AND timestamp >= $1 AND timestamp < $2
      GROUP BY date
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new OnlineWorkersEntry(r))
  }
}

/*************************************
 * Unique operators timeseries       *
 *************************************/
@ObjectType()
class OperatorsEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  dailyChange!: number

  @Field(() => Number)
  operators!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<OperatorsEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      WITH raw AS (
        SELECT date_trunc('day', timestamp) as date,
          owner_id,
          SUM(CASE WHEN status = 'REGISTERING' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 END) as change
        FROM (
          SELECT wsc.id, wsc.timestamp, w.owner_id, wsc.status
          FROM worker_status_change as wsc
          JOIN worker as w ON w.id = wsc.worker_id
          WHERE wsc.status IN ('REGISTERING', 'WITHDRAWN') AND wsc.timestamp >= $1 AND wsc.timestamp < $2
        ) events
        GROUP BY date, owner_id
      ),
      with_counts AS (
        SELECT date, owner_id, change,
          SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
        FROM raw
      ),
      summarized AS (
        SELECT date,
          SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as change
        FROM with_counts
        GROUP BY date
      )
      SELECT date,
        change as "dailyChange",
        SUM(change) OVER (ORDER BY date) AS operators
      FROM summarized
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new OperatorsEntry(r))
  }
}

/*************************************
 * Delegations count timeseries      *
 *************************************/
@ObjectType()
class DelegationsEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  dailyChange!: number

  @Field(() => Number)
  delegations!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<DelegationsEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      WITH filtered_events AS (
        SELECT wsc.date_trunc('day', timestamp) AS event_date,
          CASE WHEN wsc.status = 'ACTIVE' THEN 1 WHEN wsc.status = 'WITHDRAWN' THEN -1 ELSE 0 END AS change_value
        FROM delegation_status_change wsc
        WHERE wsc.pending = false AND wsc.timestamp >= $1 AND wsc.timestamp < $2
      ),
      daily_changes AS (
        SELECT event_date, SUM(change_value) AS daily_change
        FROM filtered_events
        GROUP BY event_date
      )
      SELECT event_date AS date,
        daily_change as "dailyChange",
        SUM(daily_change) OVER (ORDER BY event_date) AS delegations
      FROM daily_changes
      ORDER BY event_date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new DelegationsEntry(r))
  }
}

/*************************************
 * Unique delegators timeseries      *
 *************************************/
@ObjectType()
class DelegatorsEntry {
  @Field(() => DateTime)
  date!: Date

  @Field(() => Number)
  dailyChange!: number

  @Field(() => Number)
  delegators!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<DelegatorsEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      WITH raw AS (
        SELECT date_trunc('day', timestamp) as date,
          owner_id,
          SUM(CASE WHEN status = 'ACTIVE' THEN 1 WHEN status = 'WITHDRAWN' THEN -1 ELSE 0 END) as change
        FROM (
          SELECT wsc.id, wsc.timestamp, delegation.owner_id, wsc.status
          FROM delegation_status_change wsc
          JOIN delegation ON delegation.id = wsc.delegation_id
          WHERE wsc.status IN ('ACTIVE', 'WITHDRAWN') AND wsc.timestamp >= $1 AND wsc.timestamp < $2
        ) events
        GROUP BY date, owner_id
      ),
      with_counts AS (
        SELECT date, owner_id, change,
          SUM(change) OVER (PARTITION BY owner_id ORDER BY date) as workers_count
        FROM raw
      ),
      summarized AS (
        SELECT date,
          SUM(CASE WHEN workers_count > 0 AND change = workers_count THEN 1 WHEN workers_count <= 0 AND change < 0 THEN -1 ELSE 0 END) as change
        FROM with_counts
        GROUP BY date
      )
      SELECT date,
        change as "dailyChange",
        SUM(change) OVER (ORDER BY date) AS delegators
      FROM summarized
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new DelegatorsEntry(r))
  }
}

/*************************************
 * Transfers by type timeseries      *
 *************************************/
@ObjectType()
class TransferCountByType {
  @Field(() => DateTime) date!: Date
  @Field(() => String) type!: string
  @Field(() => Number) count!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<TransferCountByType[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      SELECT date_trunc('day', timestamp) as date, type, count(*)
      FROM transfer
      WHERE timestamp >= $1 AND timestamp < $2
      GROUP BY date, type
      ORDER BY date, type
      `,
      [from, to || new Date()],
    )

    return raw.map(
      (r: any) => new TransferCountByType({ date: r.date, type: r.type, count: parseInt(r.count) }),
    )
  }
}

/*************************************
 * Unique accounts timeseries        *
 *************************************/
@ObjectType()
class UniqueAccountsEntry {
  @Field(() => DateTime) date!: Date
  @Field(() => Number) accounts!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<UniqueAccountsEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      SELECT date_trunc('day', timestamp) as date, count(DISTINCT account_id) as accounts
      FROM (
        SELECT timestamp, from_id as account_id FROM transfer
        UNION ALL
        SELECT timestamp, to_id as account_id FROM transfer
      ) AS t
      WHERE timestamp >= $1 AND timestamp < $2
      GROUP BY date
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map(
      (r: any) => new UniqueAccountsEntry({ date: r.date, accounts: parseInt(r.accounts) }),
    )
  }
}

/*************************************
 * Queries count timeseries          *
 *************************************/
@ObjectType()
class QueriesCountEntry {
  @Field(() => DateTime)
  date!: Date
  @Field(() => Number)
  dailyChange!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<QueriesCountEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      SELECT date_trunc('day', timestamp) as date, sum(queries) as daily_change
      FROM worker_metrics
      WHERE timestamp >= $1 AND timestamp < $2
      GROUP BY date
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map(
      (r: any) =>
        new QueriesCountEntry({
          date: r.date,
          dailyChange: parseInt(r.daily_change ?? r.daily_change ?? r.dailyChange),
        }),
    )
  }
}

/*************************************
 * Served data timeseries            *
 *************************************/
@ObjectType()
class ServedDataEntry {
  @Field(() => DateTime)
  date!: Date
  @Field(() => Number)
  dailyChange!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<ServedDataEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      SELECT date_trunc('day', timestamp) as date, sum(served_data) as daily_change
      FROM worker_metrics
      WHERE timestamp >= $1 AND timestamp < $2
      GROUP BY date
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map(
      (r: any) =>
        new ServedDataEntry({
          date: r.date,
          dailyChange: parseInt(r.daily_change ?? r.dailyChange),
        }),
    )
  }
}

/*************************************
 * Stored data timeseries            *
 *************************************/
@ObjectType()
class StoredDataEntry {
  @Field(() => DateTime)
  date!: Date
  @Field(() => Number)
  stored!: number

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
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<StoredDataEntry[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      SELECT date, sum(stored_data) as stored
      FROM (
        SELECT date_trunc('day', timestamp) as date, worker_id, max(stored_data) as stored_data
        FROM worker_metrics
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY date, worker_id
      ) w
      GROUP BY date
      ORDER BY date
      `,
      [from, to || new Date()],
    )

    return raw.map((r: any) => new StoredDataEntry({ date: r.date, stored: parseInt(r.stored) }))
  }
}

/*************************************
 * Reward timeseries                 *
 *************************************/
@ObjectType()
class RewardSnapshot {
  @Field(() => DateTime)
  timestamp!: Date

  @Field(() => Number)
  workerReward!: number

  @Field(() => Number)
  delegationReward!: number

  constructor(props: Partial<RewardSnapshot>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class RewardTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [RewardSnapshot])
  async rewardTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<RewardSnapshot[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      WITH worker AS (
        SELECT DATE_TRUNC('day', timestamp) AS day, SUM(amount) AS worker_reward
        FROM worker_reward
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY day
      ),
      delegation AS (
        SELECT DATE_TRUNC('day', timestamp) AS day, SUM(amount) AS delegation_reward
        FROM delegation_reward
        WHERE timestamp >= $1 AND timestamp < $2
        GROUP BY day
      ),
      combined AS (
        SELECT day, worker_reward, 0 AS delegation_reward FROM worker
        UNION ALL
        SELECT day, 0 AS worker_reward, delegation_reward FROM delegation
      )
      SELECT day AS "timestamp",
             COALESCE(SUM(worker_reward), 0) / 1e18 AS "workerReward",
             COALESCE(SUM(delegation_reward), 0) / 1e18 AS "delegationReward"
      FROM combined
      GROUP BY day
      ORDER BY day
      `,
      [from, to || new Date()],
    )

    return raw.map(
      (r: any) =>
        new RewardSnapshot({
          timestamp: r.timestamp,
          workerReward: Number(r.workerReward),
          delegationReward: Number(r.delegationReward),
        }),
    )
  }
}

/*************************************
 * APR timeseries                    *
 *************************************/
@Resolver()
export class AprTimeseriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [AprSnapshot])
  async aprTimeseries(
    @Arg('from') from: Date,
    @Arg('to', { nullable: true }) to?: Date,
  ): Promise<AprSnapshot[]> {
    const manager = await this.tx()

    const raw = await manager.query(
      `
      SELECT DATE_TRUNC('day', timestamp) AS "timestamp",
        COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS "workerApr",
        COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS "stakerApr"
      FROM worker_reward
      WHERE timestamp >= $1 AND timestamp < $2
      GROUP BY "timestamp"
      ORDER BY "timestamp"
      `,
      [from, to || new Date()],
    )

    return raw.map(
      (r: any) =>
        new AprSnapshot({
          timestamp: r.timestamp,
          workerApr: Number(r.workerApr),
          stakerApr: Number(r.stakerApr),
        }),
    )
  }
}
