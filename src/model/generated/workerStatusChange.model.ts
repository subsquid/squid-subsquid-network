import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"
import {WorkerStatus} from "./_workerStatus"

@Entity_()
export class WorkerStatusChange {
    constructor(props?: Partial<WorkerStatusChange>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
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
