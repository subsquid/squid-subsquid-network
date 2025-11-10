import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Delegation} from "./delegation.model"
import {DelegationStatus} from "./_delegationStatus"

@Index_(["pending", "timestamp"], {unique: false})
@Index_(["status", "timestamp"], {unique: false})
@Index_(["delegation", "blockNumber"], {unique: false})
@Entity_()
export class DelegationStatusChange {
    constructor(props?: Partial<DelegationStatusChange>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => Delegation, {nullable: true})
    delegation!: Delegation

    @Column_("varchar", {length: 9, nullable: false})
    status!: DelegationStatus

    @DateTimeColumn_({nullable: true})
    timestamp!: Date | undefined | null

    @IntColumn_({nullable: false})
    blockNumber!: number

    @BooleanColumn_({nullable: false})
    pending!: boolean
}
