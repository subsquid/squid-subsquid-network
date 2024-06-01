import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Claimed: event("0xa6836ed9f6b0bfa430c6b744cac7cc781c2a5b5be98f6e7ca42d32fd16bc6af3", {"staker": indexed(p.address), "amount": p.uint256, "workerIds": p.array(p.uint256)}),
    Deposited: event("0x1599c0fcf897af5babc2bfcf707f5dc050f841b044d97c3251ecec35b9abf80b", {"worker": indexed(p.uint256), "staker": indexed(p.address), "amount": p.uint256}),
    Distributed: event("0xddc9c30275a04c48091f24199f9c405765de34d979d6847f5b9798a57232d2e5", {"epoch": p.uint256}),
    EpochsLockChanged: event("0x6d1a1e80fd96834b1293514ebab21ebac9637f9ad7ab1a533a05e4c6929bdd0a", {"epochsLock": p.uint128}),
    MaxDelegationsChanged: event("0x8c59f6213d7200a03c81eac511632ea48656d94e2bc3b07730bab2e04f5f5286", {"maxDelegations": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", {"account": p.address}),
    Rewarded: event("0x6d46424d7308d93179bbc5c8c01e098e8353dad13aff9809fd8a881a69feaa3a", {"workerId": indexed(p.uint256), "staker": indexed(p.address), "amount": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", {"account": p.address}),
    Withdrawn: event("0xcf7d23a3cbe4e8b36ff82fd1b05b1b17373dc7804b4ebbd6e2356716ef202372", {"worker": indexed(p.uint256), "staker": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", {}, p.bytes32),
    PAUSER_ROLE: viewFun("0xe63ab1e9", {}, p.bytes32),
    REWARDS_DISTRIBUTOR_ROLE: viewFun("0xc34c2289", {}, p.bytes32),
    claim: fun("0x1e83409a", {"staker": p.address}, p.uint256),
    claimable: viewFun("0x402914f5", {"staker": p.address}, p.uint256),
    delegated: viewFun("0x18e44a49", {"worker": p.uint256}, p.uint256),
    delegates: viewFun("0x587cde1e", {"staker": p.address}, p.array(p.uint256)),
    deposit: fun("0xe2bbb158", {"worker": p.uint256, "amount": p.uint256}, ),
    distribute: fun("0x8e1b57c5", {"workers": p.array(p.uint256), "amounts": p.array(p.uint256)}, ),
    epochsLockedAfterStake: viewFun("0x31603b62", {}, p.uint128),
    getDeposit: viewFun("0x2726b506", {"staker": p.address, "worker": p.uint256}, {"depositAmount": p.uint256, "withdrawAllowed": p.uint256}),
    getRoleAdmin: viewFun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    lastEpochRewarded: viewFun("0xd760cdd8", {}, p.uint256),
    lockLengthBlocks: viewFun("0xc7ad6dd9", {}, p.uint128),
    maxDelegations: viewFun("0x5612a838", {}, p.uint256),
    pause: fun("0x8456cb59", {}, ),
    paused: viewFun("0x5c975abb", {}, p.bool),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    router: viewFun("0xf887ea40", {}, p.address),
    setEpochsLock: fun("0xe03f56e4", {"_epochsLock": p.uint128}, ),
    setMaxDelegations: fun("0xe2ef0024", {"_maxDelegations": p.uint256}, ),
    supportsInterface: viewFun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    token: viewFun("0xfc0c546a", {}, p.address),
    totalStakedPerWorker: viewFun("0x5f2c3ffe", {"workers": p.array(p.uint256)}, p.array(p.uint256)),
    unpause: fun("0x3f4ba83a", {}, ),
    withdraw: fun("0x441a3e70", {"worker": p.uint256, "amount": p.uint256}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    PAUSER_ROLE() {
        return this.eth_call(functions.PAUSER_ROLE, {})
    }

    REWARDS_DISTRIBUTOR_ROLE() {
        return this.eth_call(functions.REWARDS_DISTRIBUTOR_ROLE, {})
    }

    claimable(staker: ClaimableParams["staker"]) {
        return this.eth_call(functions.claimable, {staker})
    }

    delegated(worker: DelegatedParams["worker"]) {
        return this.eth_call(functions.delegated, {worker})
    }

    delegates(staker: DelegatesParams["staker"]) {
        return this.eth_call(functions.delegates, {staker})
    }

    epochsLockedAfterStake() {
        return this.eth_call(functions.epochsLockedAfterStake, {})
    }

    getDeposit(staker: GetDepositParams["staker"], worker: GetDepositParams["worker"]) {
        return this.eth_call(functions.getDeposit, {staker, worker})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    lastEpochRewarded() {
        return this.eth_call(functions.lastEpochRewarded, {})
    }

    lockLengthBlocks() {
        return this.eth_call(functions.lockLengthBlocks, {})
    }

    maxDelegations() {
        return this.eth_call(functions.maxDelegations, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    router() {
        return this.eth_call(functions.router, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    token() {
        return this.eth_call(functions.token, {})
    }

    totalStakedPerWorker(workers: TotalStakedPerWorkerParams["workers"]) {
        return this.eth_call(functions.totalStakedPerWorker, {workers})
    }
}

/// Event types
export type ClaimedEventArgs = EParams<typeof events.Claimed>
export type DepositedEventArgs = EParams<typeof events.Deposited>
export type DistributedEventArgs = EParams<typeof events.Distributed>
export type EpochsLockChangedEventArgs = EParams<typeof events.EpochsLockChanged>
export type MaxDelegationsChangedEventArgs = EParams<typeof events.MaxDelegationsChanged>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RewardedEventArgs = EParams<typeof events.Rewarded>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>

export type REWARDS_DISTRIBUTOR_ROLEParams = FunctionArguments<typeof functions.REWARDS_DISTRIBUTOR_ROLE>
export type REWARDS_DISTRIBUTOR_ROLEReturn = FunctionReturn<typeof functions.REWARDS_DISTRIBUTOR_ROLE>

export type ClaimParams = FunctionArguments<typeof functions.claim>
export type ClaimReturn = FunctionReturn<typeof functions.claim>

export type ClaimableParams = FunctionArguments<typeof functions.claimable>
export type ClaimableReturn = FunctionReturn<typeof functions.claimable>

export type DelegatedParams = FunctionArguments<typeof functions.delegated>
export type DelegatedReturn = FunctionReturn<typeof functions.delegated>

export type DelegatesParams = FunctionArguments<typeof functions.delegates>
export type DelegatesReturn = FunctionReturn<typeof functions.delegates>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DistributeParams = FunctionArguments<typeof functions.distribute>
export type DistributeReturn = FunctionReturn<typeof functions.distribute>

export type EpochsLockedAfterStakeParams = FunctionArguments<typeof functions.epochsLockedAfterStake>
export type EpochsLockedAfterStakeReturn = FunctionReturn<typeof functions.epochsLockedAfterStake>

export type GetDepositParams = FunctionArguments<typeof functions.getDeposit>
export type GetDepositReturn = FunctionReturn<typeof functions.getDeposit>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type LastEpochRewardedParams = FunctionArguments<typeof functions.lastEpochRewarded>
export type LastEpochRewardedReturn = FunctionReturn<typeof functions.lastEpochRewarded>

export type LockLengthBlocksParams = FunctionArguments<typeof functions.lockLengthBlocks>
export type LockLengthBlocksReturn = FunctionReturn<typeof functions.lockLengthBlocks>

export type MaxDelegationsParams = FunctionArguments<typeof functions.maxDelegations>
export type MaxDelegationsReturn = FunctionReturn<typeof functions.maxDelegations>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RouterParams = FunctionArguments<typeof functions.router>
export type RouterReturn = FunctionReturn<typeof functions.router>

export type SetEpochsLockParams = FunctionArguments<typeof functions.setEpochsLock>
export type SetEpochsLockReturn = FunctionReturn<typeof functions.setEpochsLock>

export type SetMaxDelegationsParams = FunctionArguments<typeof functions.setMaxDelegations>
export type SetMaxDelegationsReturn = FunctionReturn<typeof functions.setMaxDelegations>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type TotalStakedPerWorkerParams = FunctionArguments<typeof functions.totalStakedPerWorker>
export type TotalStakedPerWorkerReturn = FunctionReturn<typeof functions.totalStakedPerWorker>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

