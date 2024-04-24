import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import {EpochStatus} from "./_epochStatus"

@Entity_()
export class Epoch {
    constructor(props?: Partial<Epoch>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    number!: number

    @Column_("int4", {nullable: false})
    start!: number

    @Column_("timestamp with time zone", {nullable: true})
    startedAt!: Date | undefined | null

    @Column_("int4", {nullable: false})
    end!: number

    @Column_("timestamp with time zone", {nullable: true})
    endedAt!: Date | undefined | null

    @Column_("varchar", {length: 7, nullable: false})
    status!: EpochStatus

    @Column_("text", {array: true, nullable: true})
    activeWorkerIds!: (string)[] | undefined | null
}
