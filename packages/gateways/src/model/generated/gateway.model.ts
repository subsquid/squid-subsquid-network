import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
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
    @StringColumn_({nullable: false})
    ownerId!: string

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
