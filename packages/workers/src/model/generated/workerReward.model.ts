import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"

@Index_(["worker", "timestamp"], {unique: false})
@Index_(["timestamp", "apr"], {unique: false})
@Index_(["timestamp", "stakerApr"], {unique: false})
@Entity_()
export class WorkerReward {
    constructor(props?: Partial<WorkerReward>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @ManyToOne_(() => Worker, {nullable: true})
    worker!: Worker

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @FloatColumn_({nullable: false})
    apr!: number

    @BigIntColumn_({nullable: false})
    stakersReward!: bigint

    @FloatColumn_({nullable: false})
    stakerApr!: number
}
