import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {WorkerStatus} from "./_workerStatus"
import {WorkerStatusChange} from "./workerStatusChange.model"
import {WorkerReward} from "./workerReward.model"
import {Claim} from "./claim.model"
import {Delegation} from "./delegation.model"
import {WorkerSnapshot} from "./workerSnapshot.model"

@Index_(["id", "createdAt", "status"], {unique: false})
@Index_(["id", "realOwner"], {unique: false})
@Entity_()
export class Worker {
    constructor(props?: Partial<Worker>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    peerId!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    /**
     * owner.owner for VESTING account
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    realOwner!: Account

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    bond!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("bool", {nullable: true})
    locked!: boolean | undefined | null

    @Column_("int4", {nullable: true})
    lockStart!: number | undefined | null

    @Column_("int4", {nullable: true})
    lockEnd!: number | undefined | null

    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Column_("text", {nullable: true})
    website!: string | undefined | null

    @Column_("text", {nullable: true})
    email!: string | undefined | null

    @Column_("text", {nullable: true})
    description!: string | undefined | null

    @Column_("varchar", {length: 13, nullable: false})
    status!: WorkerStatus

    @OneToMany_(() => WorkerStatusChange, e => e.worker)
    statusHistory!: WorkerStatusChange[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    claimableReward!: bigint

    @OneToMany_(() => WorkerReward, e => e.worker)
    rewards!: WorkerReward[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    claimedReward!: bigint

    @OneToMany_(() => Claim, e => e.worker)
    claims!: Claim[]

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: true})
    apr!: number | undefined | null

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: true})
    stakerApr!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalDelegation!: bigint

    @Column_("int4", {nullable: false})
    delegationCount!: number

    @OneToMany_(() => Delegation, e => e.worker)
    delegations!: Delegation[]

    @Index_()
    @Column_("bool", {nullable: true})
    online!: boolean | undefined | null

    @Column_("bool", {nullable: true})
    dialOk!: boolean | undefined | null

    @Column_("bool", {nullable: true})
    jailed!: boolean | undefined | null

    @Column_("text", {nullable: true})
    version!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    storedData!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    queries24Hours!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    queries90Days!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    servedData24Hours!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    servedData90Days!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    scannedData24Hours!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    scannedData90Days!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: true})
    uptime24Hours!: number | undefined | null

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: true})
    uptime90Days!: number | undefined | null

    @OneToMany_(() => WorkerSnapshot, e => e.worker)
    snapshots!: WorkerSnapshot[]
}
