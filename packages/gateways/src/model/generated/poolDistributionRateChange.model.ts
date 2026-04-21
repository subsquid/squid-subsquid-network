import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {PortalPool} from "./portalPool.model"

@Index_(["pool", "timestamp"], {unique: false})
@Entity_()
export class PoolDistributionRateChange {
    constructor(props?: Partial<PoolDistributionRateChange>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @ManyToOne_(() => PortalPool, {nullable: true})
    pool!: PortalPool

    @BigIntColumn_({nullable: false})
    oldRate!: bigint

    @BigIntColumn_({nullable: false})
    newRate!: bigint
}
