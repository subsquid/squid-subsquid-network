import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {GatewayOperator} from "./gatewayOperator.model"
import {Account} from "./account.model"

@Entity_()
export class GatewayStake {
    constructor(props?: Partial<GatewayStake>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    index!: number

    @Index_()
    @ManyToOne_(() => GatewayOperator, {nullable: true})
    operator!: GatewayOperator

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    computationUnits!: bigint

    @BooleanColumn_({nullable: false})
    locked!: boolean

    @IntColumn_({nullable: false})
    lockStart!: number

    @IntColumn_({nullable: false})
    lockEnd!: number
}
