import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {GatewayOperator} from "./gatewayOperator.model"
import {Account} from "./account.model"
import {GatewayStatus} from "./_gatewayStatus"
import {GatewayStatusChange} from "./gatewayStatusChange.model"

@Entity_()
export class Gateway {
    constructor(props?: Partial<Gateway>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Index_()
    @ManyToOne_(() => GatewayOperator, {nullable: true})
    operator!: GatewayOperator | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @Column_("varchar", {length: 12, nullable: false})
    status!: GatewayStatus

    @OneToMany_(() => GatewayStatusChange, e => e.gateway)
    statusHistory!: GatewayStatusChange[]

    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Column_("text", {nullable: true})
    website!: string | undefined | null

    @Column_("text", {nullable: true})
    email!: string | undefined | null

    @Column_("text", {nullable: true})
    description!: string | undefined | null

    @Column_("text", {nullable: true})
    endpointUrl!: string | undefined | null
}
