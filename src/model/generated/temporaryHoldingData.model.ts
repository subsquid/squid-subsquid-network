import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"

@Entity_()
export class TemporaryHoldingData {
    constructor(props?: Partial<TemporaryHoldingData>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @OneToOne_(() => Account, {nullable: true})
    @JoinColumn_()
    account!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    beneficiary!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    admin!: Account

    @DateTimeColumn_({nullable: false})
    unlockedAt!: Date

    @BooleanColumn_({nullable: false})
    locked!: boolean
}
