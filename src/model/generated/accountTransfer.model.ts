import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {TransferDirection} from "./_transferDirection"
import {Account} from "./account.model"
import {Transfer} from "./transfer.model"

@Entity_()
export class AccountTransfer {
    constructor(props?: Partial<AccountTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 4, nullable: false})
    direction!: TransferDirection

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Transfer, {nullable: true})
    transfer!: Transfer
}
