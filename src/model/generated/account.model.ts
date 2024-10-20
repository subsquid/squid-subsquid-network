import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_, OneToOne as OneToOne_} from "@subsquid/typeorm-store"
import {AccountType} from "./_accountType"
import {AccountTransfer} from "./accountTransfer.model"
import {Transfer} from "./transfer.model"
import {Worker} from "./worker.model"
import {Delegation} from "./delegation.model"
import {Claim} from "./claim.model"
import {GatewayOperator} from "./gatewayOperator.model"
import {Gateway} from "./gateway.model"
import {GatewayStake} from "./gatewayStake.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 7, nullable: false})
    type!: AccountType

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @OneToMany_(() => Account, e => e.owner)
    owned!: Account[]

    @OneToMany_(() => AccountTransfer, e => e.account)
    transfers!: AccountTransfer[]

    @OneToMany_(() => Transfer, e => e.to)
    transfersTo!: Transfer[]

    @OneToMany_(() => Transfer, e => e.from)
    transfersFrom!: Transfer[]

    @OneToMany_(() => Worker, e => e.realOwner)
    workers!: Worker[]

    @OneToMany_(() => Worker, e => e.owner)
    workers2!: Worker[]

    @OneToMany_(() => Delegation, e => e.realOwner)
    delegations!: Delegation[]

    @OneToMany_(() => Delegation, e => e.owner)
    delegations2!: Delegation[]

    @IntColumn_({nullable: false})
    claimableDelegationCount!: number

    @OneToMany_(() => Claim, e => e.account)
    claims!: Claim[]

    @OneToOne_(() => GatewayOperator, e => e.account)
    gatewayOperator!: GatewayOperator | undefined | null

    @OneToMany_(() => Gateway, e => e.owner)
    gateways!: Gateway[]

    @OneToMany_(() => GatewayStake, e => e.owner)
    gatewayStakes!: GatewayStake[]
}
