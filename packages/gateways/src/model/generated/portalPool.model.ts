import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {PoolProvider} from "./poolProvider.model"
import {PoolEvent} from "./poolEvent.model"
import {PoolDistributionRateChange} from "./poolDistributionRateChange.model"
import {PoolCapacityChange} from "./poolCapacityChange.model"

@Entity_()
export class PortalPool {
    constructor(props?: Partial<PortalPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtBlock!: number

    @DateTimeColumn_({nullable: true})
    closedAt!: Date | undefined | null

    @IntColumn_({nullable: true})
    closedAtBlock!: number | undefined | null

    @Index_()
    @StringColumn_({nullable: false})
    operator!: string

    @StringColumn_({nullable: false})
    rewardToken!: string

    @StringColumn_({nullable: false})
    tokenSuffix!: string

    @StringColumn_({nullable: true})
    metadata!: string | undefined | null

    @BigIntColumn_({nullable: false})
    capacity!: bigint

    @BigIntColumn_({nullable: false})
    rewardRate!: bigint

    @BigIntColumn_({nullable: false})
    totalRewardsToppedUp!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    tvlTotal!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    tvlStable!: bigint

    @OneToMany_(() => PoolProvider, e => e.pool)
    providers!: PoolProvider[]

    @OneToMany_(() => PoolEvent, e => e.pool)
    events!: PoolEvent[]

    @OneToMany_(() => PoolDistributionRateChange, e => e.pool)
    distributionRateHistory!: PoolDistributionRateChange[]

    @OneToMany_(() => PoolCapacityChange, e => e.pool)
    capacityHistory!: PoolCapacityChange[]
}
