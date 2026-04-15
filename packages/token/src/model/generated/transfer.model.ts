import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {TransferType} from "./_transferType"
import {Account} from "./account.model"

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

    /**
     * String reference to delegation in workers indexer
     */
    @StringColumn_({nullable: true})
    delegationId!: string | undefined | null

    /**
     * String reference to worker in workers indexer
     */
    @StringColumn_({nullable: true})
    workerId!: string | undefined | null

    /**
     * String reference to gateway stake in gateways indexer
     */
    @StringColumn_({nullable: true})
    gatewayStakeId!: string | undefined | null

    /**
     * String reference to vesting account in accounts indexer
     */
    @StringColumn_({nullable: true})
    vestingId!: string | undefined | null

    /**
     * String reference to portal pool in gateways indexer
     */
    @StringColumn_({nullable: true})
    portalPoolId!: string | undefined | null
}
