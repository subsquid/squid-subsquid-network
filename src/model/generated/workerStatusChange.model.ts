import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
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

    @Column_("timestamp with time zone", {nullable: true})
    timestamp!: Date | undefined | null

    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("bool", {nullable: false})
    pending!: boolean
}
