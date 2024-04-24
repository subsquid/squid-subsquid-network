import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Statistics {
    constructor(props?: Partial<Statistics>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: true})
    currentEpoch!: number | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    lastSnapshotTimestamp!: Date

    @Column_("int4", {nullable: false})
    blockTime!: number

    @Column_("int4", {nullable: false})
    lastBlock!: number

    @Column_("timestamp with time zone", {nullable: false})
    lastBlockTimestamp!: Date

    @Column_("int4", {nullable: false})
    blockTimeL1!: number

    @Column_("int4", {nullable: false})
    lastBlockL1!: number

    @Column_("timestamp with time zone", {nullable: false})
    lastBlockTimestampL1!: Date
}
