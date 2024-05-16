import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Gateway} from "./gateway.model"
import {GatewayStake} from "./gatewayStake.model"

@Entity_()
export class GatewayOperator {
    constructor(props?: Partial<GatewayOperator>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @OneToOne_(() => Account, {nullable: true})
    @JoinColumn_()
    account!: Account

    @BooleanColumn_({nullable: false})
    autoExtension!: boolean

    @OneToMany_(() => Gateway, e => e.operator)
    gateways!: Gateway[]

    @Index_()
    @ManyToOne_(() => GatewayStake, {nullable: true})
    stake!: GatewayStake | undefined | null

    @Index_()
    @ManyToOne_(() => GatewayStake, {nullable: true})
    pendingStake!: GatewayStake | undefined | null
}
