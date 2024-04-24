import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
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

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    deposit!: bigint

    @Column_("bool", {nullable: true})
    locked!: boolean | undefined | null

    @Column_("int4", {nullable: true})
    lockStart!: number | undefined | null

    @Column_("int4", {nullable: true})
    lockEnd!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    claimableReward!: bigint

    @OneToMany_(() => DelegationReward, e => e.delegation)
    rewards!: DelegationReward[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    claimedReward!: bigint

    @OneToMany_(() => Claim, e => e.delegation)
    claims!: Claim[]
}
