import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
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

    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
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

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
