import assert from "assert"
import * as marshal from "./marshal"

export class CommitmentRecipient {
    private _workerId!: string
    private _workerReward!: bigint
    private _workerApr!: number
    private _stakerReward!: bigint
    private _stakerApr!: number

    constructor(props?: Partial<Omit<CommitmentRecipient, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._workerId = marshal.id.fromJSON(json.workerId)
            this._workerReward = marshal.bigint.fromJSON(json.workerReward)
            this._workerApr = marshal.float.fromJSON(json.workerApr)
            this._stakerReward = marshal.bigint.fromJSON(json.stakerReward)
            this._stakerApr = marshal.float.fromJSON(json.stakerApr)
        }
    }

    get workerId(): string {
        assert(this._workerId != null, 'uninitialized access')
        return this._workerId
    }

    set workerId(value: string) {
        this._workerId = value
    }

    get workerReward(): bigint {
        assert(this._workerReward != null, 'uninitialized access')
        return this._workerReward
    }

    set workerReward(value: bigint) {
        this._workerReward = value
    }

    get workerApr(): number {
        assert(this._workerApr != null, 'uninitialized access')
        return this._workerApr
    }

    set workerApr(value: number) {
        this._workerApr = value
    }

    get stakerReward(): bigint {
        assert(this._stakerReward != null, 'uninitialized access')
        return this._stakerReward
    }

    set stakerReward(value: bigint) {
        this._stakerReward = value
    }

    get stakerApr(): number {
        assert(this._stakerApr != null, 'uninitialized access')
        return this._stakerApr
    }

    set stakerApr(value: number) {
        this._stakerApr = value
    }

    toJSON(): object {
        return {
            workerId: this.workerId,
            workerReward: marshal.bigint.toJSON(this.workerReward),
            workerApr: this.workerApr,
            stakerReward: marshal.bigint.toJSON(this.stakerReward),
            stakerApr: this.stakerApr,
        }
    }
}
