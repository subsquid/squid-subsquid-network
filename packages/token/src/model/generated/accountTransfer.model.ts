import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, Relation as Relation_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {TransferDirection} from "./_transferDirection"
import {Account} from "./account.model"
import {Transfer} from "./transfer.model"

@Index_(["account", "transfer"], {unique: false})
@Entity_()
export class AccountTransfer {
    constructor(props?: Partial<AccountTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 4, nullable: false})
    direction!: TransferDirection

    @ManyToOne_(() => Account, {nullable: true})
    account!: Relation_<Account>

    @Index_()
    @ManyToOne_(() => Transfer, {nullable: true})
    transfer!: Relation_<Transfer>

    @BigIntColumn_({nullable: false})
    balance!: bigint
}
