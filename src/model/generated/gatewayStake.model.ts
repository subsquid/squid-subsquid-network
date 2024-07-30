import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Gateway} from "./gateway.model"

@Entity_()
export class GatewayStake {
    constructor(props?: Partial<GatewayStake>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    realOwner!: Account

    @BooleanColumn_({nullable: false})
    autoExtension!: boolean

    @OneToMany_(() => Gateway, e => e.stake)
    gateways!: Gateway[]

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    computationUnits!: bigint

    @BigIntColumn_({nullable: true})
    computationUnitsPending!: bigint | undefined | null

    @BooleanColumn_({nullable: false})
    locked!: boolean

    @IntColumn_({nullable: true})
    lockStart!: number | undefined | null

    @IntColumn_({nullable: true})
    lockEnd!: number | undefined | null
}
