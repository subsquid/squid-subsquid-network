import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
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

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    uptime!: number

    @Index_()
    @ManyToOne_(() => Epoch, {nullable: true})
    epoch!: Epoch
}
