import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Settings {
    constructor(props?: Partial<Settings>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    bondAmount!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    delegationLimitCoefficient!: number

    @Column_("int4", {nullable: true})
    epochLength!: number | undefined | null
}
