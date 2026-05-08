import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
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
    owner!: Relation_<Account> | undefined | null

    @OneToMany_(() => Account, e => e.owner)
    owned!: Relation_<Account[]>

    @OneToMany_(() => AccountTransfer, e => e.account)
    transfers!: Relation_<AccountTransfer[]>

    @OneToMany_(() => Transfer, e => e.to)
    transfersTo!: Relation_<Transfer[]>

    @OneToMany_(() => Transfer, e => e.from)
    transfersFrom!: Relation_<Transfer[]>

    @IntColumn_({nullable: false})
    claimableDelegationCount!: number
}
