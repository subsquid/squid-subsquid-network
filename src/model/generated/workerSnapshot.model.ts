import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"
import {Epoch} from "./epoch.model"

@Entity_()
export class WorkerSnapshot {
    constructor(props?: Partial<WorkerSnapshot>) {
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

    @Index_()
    @ManyToOne_(() => Epoch, {nullable: true})
    epoch!: Epoch
}
