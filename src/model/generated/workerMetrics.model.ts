import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_, FloatColumn as FloatColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"

@Entity_()
export class WorkerMetrics {
    constructor(props?: Partial<WorkerMetrics>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    worker!: Worker

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @FloatColumn_({nullable: false})
    uptime!: number

    @IntColumn_({nullable: false})
    pings!: number

    @BigIntColumn_({nullable: false})
    storedData!: bigint

    @IntColumn_({nullable: false})
    queries!: number

    @BigIntColumn_({nullable: false})
    servedData!: bigint

    @BigIntColumn_({nullable: false})
    scannedData!: bigint
}
