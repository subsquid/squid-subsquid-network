import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {ClaimType} from "./_claimType"
import {Worker} from "./worker.model"
import {Delegation} from "./delegation.model"
import {Account} from "./account.model"

@Entity_()
export class Claim {
    constructor(props?: Partial<Claim>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("varchar", {length: 10, nullable: false})
    type!: ClaimType

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    worker!: Worker | undefined | null

    @Index_()
    @ManyToOne_(() => Delegation, {nullable: true})
    delegation!: Delegation | undefined | null

    /**
     * worker.realOwner or delegation.realOwner
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint
}
