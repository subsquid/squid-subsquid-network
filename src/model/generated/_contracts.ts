import assert from "assert"
import * as marshal from "./marshal"

export class Contracts {
    private _router!: string | undefined | null
    private _networkController!: string | undefined | null
    private _staking!: string | undefined | null
    private _workerRegistration!: string | undefined | null
    private _rewardTreasury!: string | undefined | null
    private _distributedRewardsDistribution!: string | undefined | null
    private _gatewayRegistry!: string | undefined | null
    private _rewardCalculation!: string | undefined | null
    private _softCap!: string | undefined | null
    private _vestingFactory!: string | undefined | null
    private _temporaryHoldingFactory!: string | undefined | null

    constructor(props?: Partial<Omit<Contracts, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._router = json.router == null ? undefined : marshal.string.fromJSON(json.router)
            this._networkController = json.networkController == null ? undefined : marshal.string.fromJSON(json.networkController)
            this._staking = json.staking == null ? undefined : marshal.string.fromJSON(json.staking)
            this._workerRegistration = json.workerRegistration == null ? undefined : marshal.string.fromJSON(json.workerRegistration)
            this._rewardTreasury = json.rewardTreasury == null ? undefined : marshal.string.fromJSON(json.rewardTreasury)
            this._distributedRewardsDistribution = json.distributedRewardsDistribution == null ? undefined : marshal.string.fromJSON(json.distributedRewardsDistribution)
            this._gatewayRegistry = json.gatewayRegistry == null ? undefined : marshal.string.fromJSON(json.gatewayRegistry)
            this._rewardCalculation = json.rewardCalculation == null ? undefined : marshal.string.fromJSON(json.rewardCalculation)
            this._softCap = json.softCap == null ? undefined : marshal.string.fromJSON(json.softCap)
            this._vestingFactory = json.vestingFactory == null ? undefined : marshal.string.fromJSON(json.vestingFactory)
            this._temporaryHoldingFactory = json.temporaryHoldingFactory == null ? undefined : marshal.string.fromJSON(json.temporaryHoldingFactory)
        }
    }

    get router(): string | undefined | null {
        return this._router
    }

    set router(value: string | undefined | null) {
        this._router = value
    }

    get networkController(): string | undefined | null {
        return this._networkController
    }

    set networkController(value: string | undefined | null) {
        this._networkController = value
    }

    get staking(): string | undefined | null {
        return this._staking
    }

    set staking(value: string | undefined | null) {
        this._staking = value
    }

    get workerRegistration(): string | undefined | null {
        return this._workerRegistration
    }

    set workerRegistration(value: string | undefined | null) {
        this._workerRegistration = value
    }

    get rewardTreasury(): string | undefined | null {
        return this._rewardTreasury
    }

    set rewardTreasury(value: string | undefined | null) {
        this._rewardTreasury = value
    }

    get distributedRewardsDistribution(): string | undefined | null {
        return this._distributedRewardsDistribution
    }

    set distributedRewardsDistribution(value: string | undefined | null) {
        this._distributedRewardsDistribution = value
    }

    get gatewayRegistry(): string | undefined | null {
        return this._gatewayRegistry
    }

    set gatewayRegistry(value: string | undefined | null) {
        this._gatewayRegistry = value
    }

    get rewardCalculation(): string | undefined | null {
        return this._rewardCalculation
    }

    set rewardCalculation(value: string | undefined | null) {
        this._rewardCalculation = value
    }

    get softCap(): string | undefined | null {
        return this._softCap
    }

    set softCap(value: string | undefined | null) {
        this._softCap = value
    }

    get vestingFactory(): string | undefined | null {
        return this._vestingFactory
    }

    set vestingFactory(value: string | undefined | null) {
        this._vestingFactory = value
    }

    get temporaryHoldingFactory(): string | undefined | null {
        return this._temporaryHoldingFactory
    }

    set temporaryHoldingFactory(value: string | undefined | null) {
        this._temporaryHoldingFactory = value
    }

    toJSON(): object {
        return {
            router: this.router,
            networkController: this.networkController,
            staking: this.staking,
            workerRegistration: this.workerRegistration,
            rewardTreasury: this.rewardTreasury,
            distributedRewardsDistribution: this.distributedRewardsDistribution,
            gatewayRegistry: this.gatewayRegistry,
            rewardCalculation: this.rewardCalculation,
            softCap: this.softCap,
            vestingFactory: this.vestingFactory,
            temporaryHoldingFactory: this.temporaryHoldingFactory,
        }
    }
}
