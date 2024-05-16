import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Worker} from "./worker.model"
import {DelegationReward} from "./delegationReward.model"
import {Claim} from "./claim.model"

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

    @OneToMany_(() => Claim, e => e.delegation)
    claims!: Claim[]
}
