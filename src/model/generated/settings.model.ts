import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Contracts} from "./_contracts"

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

    @StringColumn_({nullable: true})
    minimalWorkerVersion!: string | undefined | null

    @StringColumn_({nullable: true})
    recommendedWorkerVersion!: string | undefined | null

    @IntColumn_({nullable: true})
    lockPeriod!: number | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new Contracts(undefined, obj)}, nullable: false})
    contracts!: Contracts

    @IntColumn_({nullable: true})
    currentEpoch!: number | undefined | null

    @BigIntColumn_({nullable: false})
    utilizedStake!: bigint

    @FloatColumn_({nullable: false})
    baseApr!: number
}
