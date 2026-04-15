import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {EpochStatus} from "./_epochStatus"

@Entity_()
export class Epoch {
    constructor(props?: Partial<Epoch>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    number!: number

    @IntColumn_({nullable: false})
    start!: number

    @DateTimeColumn_({nullable: true})
    startedAt!: Date | undefined | null

    @IntColumn_({nullable: false})
    end!: number

    @DateTimeColumn_({nullable: true})
    endedAt!: Date | undefined | null

    @Column_("varchar", {length: 7, nullable: false})
    status!: EpochStatus

    @StringColumn_({array: true, nullable: true})
    activeWorkerIds!: (string)[] | undefined | null
}
