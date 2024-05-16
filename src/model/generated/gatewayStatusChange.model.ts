import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Gateway} from "./gateway.model"
import {GatewayStatus} from "./_gatewayStatus"

@Entity_()
export class GatewayStatusChange {
    constructor(props?: Partial<GatewayStatusChange>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Gateway, {nullable: true})
    gateway!: Gateway

    @Column_("varchar", {length: 12, nullable: false})
    status!: GatewayStatus

    @DateTimeColumn_({nullable: true})
    timestamp!: Date | undefined | null

    @IntColumn_({nullable: false})
    blockNumber!: number
}
