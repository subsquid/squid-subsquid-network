import assert from "assert"
import * as marshal from "./marshal"

export class CommitmentRecipient {
    private _workerId!: string
    private _workerReward!: bigint
    private _stakerReward!: bigint

    constructor(props?: Partial<Omit<CommitmentRecipient, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._workerId = marshal.id.fromJSON(json.workerId)
            this._workerReward = marshal.bigint.fromJSON(json.workerReward)
            this._stakerReward = marshal.bigint.fromJSON(json.stakerReward)
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

    get stakerReward(): bigint {
        assert(this._stakerReward != null, 'uninitialized access')
        return this._stakerReward
    }

    set stakerReward(value: bigint) {
        this._stakerReward = value
    }

    toJSON(): object {
        return {
            workerId: this.workerId,
            workerReward: marshal.bigint.toJSON(this.workerReward),
            stakerReward: marshal.bigint.toJSON(this.stakerReward),
        }
    }
}
