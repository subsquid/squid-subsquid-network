import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class TemporaryHolding {
    constructor(props?: Partial<TemporaryHolding>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    beneficiary!: string

    @StringColumn_({nullable: false})
    admin!: string

    @DateTimeColumn_({nullable: false})
    unlockedAt!: Date

    @BooleanColumn_({nullable: false})
    locked!: boolean
}
