import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"
import {DelegationStatus} from "./_delegationStatus"
import {DelegationStatusChange} from "./delegationStatusChange.model"
import {DelegationReward} from "./delegationReward.model"

@Entity_()
export class Delegation {
    constructor(props?: Partial<Delegation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    ownerId!: string

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    worker!: Worker

    @Column_("varchar", {length: 9, nullable: false})
    status!: DelegationStatus

    @OneToMany_(() => DelegationStatusChange, e => e.delegation)
    statusHistory!: DelegationStatusChange[]

    @BigIntColumn_({nullable: false})
    deposit!: bigint

    @BooleanColumn_({nullable: true})
    locked!: boolean | undefined | null

    @IntColumn_({nullable: true})
    lockStart!: number | undefined | null

    @IntColumn_({nullable: true})
    lockEnd!: number | undefined | null

    @BigIntColumn_({nullable: false})
    claimableReward!: bigint

    @OneToMany_(() => DelegationReward, e => e.delegation)
    rewards!: DelegationReward[]

    @BigIntColumn_({nullable: false})
    claimedReward!: bigint
}
