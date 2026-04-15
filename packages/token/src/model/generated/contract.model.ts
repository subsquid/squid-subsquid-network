import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "@subsquid/typeorm-store"
import {ContractType} from "./_contractType"

@Entity_()
export class Contract {
    constructor(props?: Partial<Contract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 19, nullable: false})
    type!: ContractType
}
