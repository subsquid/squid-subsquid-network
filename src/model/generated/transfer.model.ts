import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {TransferType} from "./_transferType"
import {Account} from "./account.model"
import {Delegation} from "./delegation.model"
import {Worker} from "./worker.model"
import {GatewayStake} from "./gatewayStake.model"

@Index_(["type", "timestamp"], {unique: false})
@Entity_()
export class Transfer {
    constructor(props?: Partial<Transfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @Column_("varchar", {length: 8, nullable: false})
    type!: TransferType

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    from!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    to!: Account

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @Index_()
    @ManyToOne_(() => Delegation, {nullable: true})
    delegation!: Delegation | undefined | null

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    worker!: Worker | undefined | null

    @Index_()
    @ManyToOne_(() => GatewayStake, {nullable: true})
    gatewayStake!: GatewayStake | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    vesting!: Account | undefined | null
}
