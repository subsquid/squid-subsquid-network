import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
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

    @Column_("timestamp with time zone", {nullable: true})
    timestamp!: Date | undefined | null

    @Column_("int4", {nullable: false})
    blockNumber!: number
}
