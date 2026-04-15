import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"
import {WorkerStatus} from "./_workerStatus"

@Index_(["pending", "timestamp"], {unique: false})
@Index_(["status", "timestamp"], {unique: false})
@Index_(["worker", "blockNumber"], {unique: false})
@Entity_()
export class WorkerStatusChange {
    constructor(props?: Partial<WorkerStatusChange>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => Worker, {nullable: true})
    worker!: Worker

    @Column_("varchar", {length: 13, nullable: false})
    status!: WorkerStatus

    @DateTimeColumn_({nullable: true})
    timestamp!: Date | undefined | null

    @IntColumn_({nullable: false})
    blockNumber!: number

    @BooleanColumn_({nullable: false})
    pending!: boolean
}
