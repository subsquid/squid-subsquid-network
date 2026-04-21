import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {PortalPool} from "./portalPool.model"

@Index_(["pool", "providerId"], {unique: false})
@Entity_()
export class PoolProvider {
    constructor(props?: Partial<PoolProvider>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => PortalPool, {nullable: true})
    pool!: PortalPool

    @Index_()
    @StringColumn_({nullable: false})
    providerId!: string

    @BigIntColumn_({nullable: false})
    deposited!: bigint
}
