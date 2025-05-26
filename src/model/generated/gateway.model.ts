import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {GatewayStake} from "./gatewayStake.model"
import {GatewayStatus} from "./_gatewayStatus"
import {GatewayStatusChange} from "./gatewayStatusChange.model"

@Entity_()
export class Gateway {
    constructor(props?: Partial<Gateway>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    realOwner!: Account

    @Index_()
    @ManyToOne_(() => GatewayStake, {nullable: true})
    stake!: GatewayStake

    @Column_("varchar", {length: 12, nullable: false})
    status!: GatewayStatus

    @OneToMany_(() => GatewayStatusChange, e => e.gateway)
    statusHistory!: GatewayStatusChange[]

    @StringColumn_({nullable: true})
    name!: string | undefined | null

    @StringColumn_({nullable: true})
    website!: string | undefined | null

    @StringColumn_({nullable: true})
    email!: string | undefined | null

    @StringColumn_({nullable: true})
    description!: string | undefined | null

    @StringColumn_({nullable: true})
    endpointUrl!: string | undefined | null
}
