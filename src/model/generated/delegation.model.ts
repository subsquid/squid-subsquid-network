import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Worker} from "./worker.model"
import {DelegationStatus} from "./_delegationStatus"
import {DelegationStatusChange} from "./delegationStatusChange.model"
import {DelegationReward} from "./delegationReward.model"

@Index_(["id", "realOwner"], {unique: false})
@Entity_()
export class Delegation {
    constructor(props?: Partial<Delegation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    /**
     * owner.owner for VESTING account
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    realOwner!: Account

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
