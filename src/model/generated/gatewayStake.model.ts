import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {GatewayOperator} from "./gatewayOperator.model"
import {Account} from "./account.model"

@Entity_()
export class GatewayStake {
    constructor(props?: Partial<GatewayStake>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    index!: number

    @Index_()
    @ManyToOne_(() => GatewayOperator, {nullable: true})
    operator!: GatewayOperator

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    computationUnits!: bigint

    @Column_("bool", {nullable: false})
    locked!: boolean

    @Column_("int4", {nullable: false})
    lockStart!: number

    @Column_("int4", {nullable: false})
    lockEnd!: number
}
