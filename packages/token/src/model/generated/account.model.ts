import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {AccountType} from "./_accountType"
import {AccountTransfer} from "./accountTransfer.model"
import {Transfer} from "./transfer.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 17, nullable: false})
    type!: AccountType

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @OneToMany_(() => Account, e => e.owner)
    owned!: Account[]

    @OneToMany_(() => AccountTransfer, e => e.account)
    transfers!: AccountTransfer[]

    @OneToMany_(() => Transfer, e => e.to)
    transfersTo!: Transfer[]

    @OneToMany_(() => Transfer, e => e.from)
    transfersFrom!: Transfer[]

    @IntColumn_({nullable: false})
    claimableDelegationCount!: number
}
