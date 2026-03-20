import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"

@Entity_()
export class PortalPool {
    constructor(props?: Partial<PortalPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtBlock!: number

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    operator!: Account

    @StringColumn_({nullable: false})
    rewardToken!: string

    @BigIntColumn_({nullable: false})
    capacity!: bigint

    @BigIntColumn_({nullable: false})
    distributionRatePerSecond!: bigint

    @BigIntColumn_({nullable: false})
    initialDeposit!: bigint

    @StringColumn_({nullable: false})
    tokenSuffix!: string

    @StringColumn_({nullable: true})
    metadata!: string | undefined | null
}
