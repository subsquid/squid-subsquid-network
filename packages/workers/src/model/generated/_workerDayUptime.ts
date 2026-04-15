import assert from "assert"
import * as marshal from "./marshal"

export class WorkerDayUptime {
    private _timestamp!: Date
    private _uptime!: number

    constructor(props?: Partial<Omit<WorkerDayUptime, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._timestamp = marshal.datetime.fromJSON(json.timestamp)
            this._uptime = marshal.float.fromJSON(json.uptime)
        }
    }

    get timestamp(): Date {
        assert(this._timestamp != null, 'uninitialized access')
        return this._timestamp
    }

    set timestamp(value: Date) {
        this._timestamp = value
    }

    get uptime(): number {
        assert(this._uptime != null, 'uninitialized access')
        return this._uptime
    }

    set uptime(value: number) {
        this._uptime = value
    }

    toJSON(): object {
        return {
            timestamp: marshal.datetime.toJSON(this.timestamp),
            uptime: this.uptime,
        }
    }
}
