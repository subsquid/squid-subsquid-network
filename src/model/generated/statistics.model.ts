import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Statistics {
    constructor(props?: Partial<Statistics>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: true})
    currentEpoch!: number | undefined | null

    @DateTimeColumn_({nullable: false})
    lastSnapshotTimestamp!: Date

    @IntColumn_({nullable: false})
    blockTime!: number

    @IntColumn_({nullable: false})
    lastBlock!: number

    @DateTimeColumn_({nullable: false})
    lastBlockTimestamp!: Date

    @IntColumn_({nullable: false})
    blockTimeL1!: number

    @IntColumn_({nullable: false})
    lastBlockL1!: number

    @DateTimeColumn_({nullable: false})
    lastBlockTimestampL1!: Date

    @BigIntColumn_({nullable: false})
    utilizedStake!: bigint

    @FloatColumn_({nullable: false})
    baseApr!: number
}
