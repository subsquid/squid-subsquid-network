import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {WorkerStatus} from "./_workerStatus"
import {WorkerStatusChange} from "./workerStatusChange.model"
import {WorkerReward} from "./workerReward.model"
import {Delegation} from "./delegation.model"
import {WorkerDayUptime} from "./_workerDayUptime"
import {WorkerSnapshot} from "./workerSnapshot.model"

@Index_(["id", "createdAt", "status"], {unique: false})
@Index_(["id", "realOwner"], {unique: false})
@Index_(["status", "online"], {unique: false})
@Entity_()
export class Worker {
    constructor(props?: Partial<Worker>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
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

    @BigIntColumn_({nullable: false})
    bond!: bigint

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @BooleanColumn_({nullable: true})
    locked!: boolean | undefined | null

    @IntColumn_({nullable: true})
    lockStart!: number | undefined | null

    @IntColumn_({nullable: true})
    lockEnd!: number | undefined | null

    @StringColumn_({nullable: true})
    name!: string | undefined | null

    @StringColumn_({nullable: true})
    website!: string | undefined | null

    @StringColumn_({nullable: true})
    email!: string | undefined | null

    @StringColumn_({nullable: true})
    description!: string | undefined | null

    @Column_("varchar", {length: 13, nullable: false})
    status!: WorkerStatus

    @OneToMany_(() => WorkerStatusChange, e => e.worker)
    statusHistory!: WorkerStatusChange[]

    @BigIntColumn_({nullable: false})
    claimableReward!: bigint

    @OneToMany_(() => WorkerReward, e => e.worker)
    rewards!: WorkerReward[]

    @BigIntColumn_({nullable: false})
    claimedReward!: bigint

    @FloatColumn_({nullable: true})
    apr!: number | undefined | null

    @FloatColumn_({nullable: true})
    stakerApr!: number | undefined | null

    @BigIntColumn_({nullable: false})
    totalDelegation!: bigint

    @BigIntColumn_({nullable: false})
    capedDelegation!: bigint

    @IntColumn_({nullable: false})
    delegationCount!: number

    @OneToMany_(() => Delegation, e => e.worker)
    delegations!: Delegation[]

    @BigIntColumn_({nullable: false})
    totalDelegationRewards!: bigint

    @Index_()
    @BooleanColumn_({nullable: true})
    online!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    dialOk!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    jailed!: boolean | undefined | null

    @StringColumn_({nullable: true})
    jailReason!: string | undefined | null

    @StringColumn_({nullable: true})
    version!: string | undefined | null

    @BigIntColumn_({nullable: true})
    storedData!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    queries24Hours!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    queries90Days!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    servedData24Hours!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    servedData90Days!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    scannedData24Hours!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    scannedData90Days!: bigint | undefined | null

    @FloatColumn_({nullable: true})
    uptime24Hours!: number | undefined | null

    @FloatColumn_({nullable: true})
    uptime90Days!: number | undefined | null

    @FloatColumn_({nullable: true})
    trafficWeight!: number | undefined | null

    @FloatColumn_({nullable: true})
    liveness!: number | undefined | null

    @FloatColumn_({nullable: true})
    dTenure!: number | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new WorkerDayUptime(undefined, marshal.nonNull(val)))}, nullable: true})
    dayUptimes!: (WorkerDayUptime)[] | undefined | null

    @OneToMany_(() => WorkerSnapshot, e => e.worker)
    snapshots!: WorkerSnapshot[]
}
