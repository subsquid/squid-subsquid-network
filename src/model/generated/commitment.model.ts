import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {CommitmentRecipient} from "./_commitmentRecipient"

@Entity_()
export class Commitment {
    constructor(props?: Partial<Commitment>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @DateTimeColumn_({nullable: false})
    from!: Date

    @IntColumn_({nullable: false})
    fromBlock!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    to!: Date

    @IntColumn_({nullable: false})
    toBlock!: number

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new CommitmentRecipient(undefined, marshal.nonNull(val)))}, nullable: false})
    recipients!: (CommitmentRecipient)[]
}
