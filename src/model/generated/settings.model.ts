import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Settings {
    constructor(props?: Partial<Settings>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: true})
    bondAmount!: bigint | undefined | null

    @FloatColumn_({nullable: false})
    delegationLimitCoefficient!: number

    @IntColumn_({nullable: true})
    epochLength!: number | undefined | null
}
