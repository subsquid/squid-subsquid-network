import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", {"version": p.uint64}),
    NetworkControllerSet: event("0xc933942500e5eabdee8f25e1ce6988211cb77b11019381d0ee10f11ca0a7b76a", {"networkController": p.address}),
    RewardCalculationSet: event("0xf0de48adac52cf0a3dedce9122eab2ba78c8418200301785a447bb8c96349c38", {"rewardCalculation": p.address}),
    RewardTreasurySet: event("0x52023115ad9f37137d6559cebbde4f5e58fad94c836e496d927ffc3ed958e9d9", {"rewardTreasury": p.address}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    StakingSet: event("0xf520447191196b125f76f7110397fdf32b1b9cefb7dec323bd3b998022ac2338", {"staking": p.address}),
    WorkerRegistrationSet: event("0xdab5f283cc831e81a29a9774fa3c356e72198f0d3ae83adb2ccd0c425a236877", {"workerRegistration": p.address}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", {}, p.bytes32),
    getRoleAdmin: viewFun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    initialize: fun("0x1459457a", {"_workerRegistration": p.address, "_staking": p.address, "_rewardTreasury": p.address, "_networkController": p.address, "_rewardCalculation": p.address}, ),
    networkController: viewFun("0x853b97c2", {}, p.address),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    rewardCalculation: viewFun("0x8f0b335e", {}, p.address),
    rewardTreasury: viewFun("0xc7c934a1", {}, p.address),
    setNetworkController: fun("0xb7e11add", {"_networkController": p.address}, ),
    setRewardCalculation: fun("0xb697fc5a", {"_rewardCalculation": p.address}, ),
    setRewardTreasury: fun("0xa493415f", {"_rewardTreasury": p.address}, ),
    setStaking: fun("0x8ff39099", {"_staking": p.address}, ),
    setWorkerRegistration: fun("0x7fc49c94", {"_workerRegistration": p.address}, ),
    staking: viewFun("0x4cf088d9", {}, p.address),
    supportsInterface: viewFun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    workerRegistration: viewFun("0xd9ffb4fc", {}, p.address),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    networkController() {
        return this.eth_call(functions.networkController, {})
    }

    rewardCalculation() {
        return this.eth_call(functions.rewardCalculation, {})
    }

    rewardTreasury() {
        return this.eth_call(functions.rewardTreasury, {})
    }

    staking() {
        return this.eth_call(functions.staking, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    workerRegistration() {
        return this.eth_call(functions.workerRegistration, {})
    }
}

/// Event types
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type NetworkControllerSetEventArgs = EParams<typeof events.NetworkControllerSet>
export type RewardCalculationSetEventArgs = EParams<typeof events.RewardCalculationSet>
export type RewardTreasurySetEventArgs = EParams<typeof events.RewardTreasurySet>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type StakingSetEventArgs = EParams<typeof events.StakingSet>
export type WorkerRegistrationSetEventArgs = EParams<typeof events.WorkerRegistrationSet>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type NetworkControllerParams = FunctionArguments<typeof functions.networkController>
export type NetworkControllerReturn = FunctionReturn<typeof functions.networkController>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RewardCalculationParams = FunctionArguments<typeof functions.rewardCalculation>
export type RewardCalculationReturn = FunctionReturn<typeof functions.rewardCalculation>

export type RewardTreasuryParams = FunctionArguments<typeof functions.rewardTreasury>
export type RewardTreasuryReturn = FunctionReturn<typeof functions.rewardTreasury>

export type SetNetworkControllerParams = FunctionArguments<typeof functions.setNetworkController>
export type SetNetworkControllerReturn = FunctionReturn<typeof functions.setNetworkController>

export type SetRewardCalculationParams = FunctionArguments<typeof functions.setRewardCalculation>
export type SetRewardCalculationReturn = FunctionReturn<typeof functions.setRewardCalculation>

export type SetRewardTreasuryParams = FunctionArguments<typeof functions.setRewardTreasury>
export type SetRewardTreasuryReturn = FunctionReturn<typeof functions.setRewardTreasury>

export type SetStakingParams = FunctionArguments<typeof functions.setStaking>
export type SetStakingReturn = FunctionReturn<typeof functions.setStaking>

export type SetWorkerRegistrationParams = FunctionArguments<typeof functions.setWorkerRegistration>
export type SetWorkerRegistrationReturn = FunctionReturn<typeof functions.setWorkerRegistration>

export type StakingParams = FunctionArguments<typeof functions.staking>
export type StakingReturn = FunctionReturn<typeof functions.staking>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type WorkerRegistrationParams = FunctionArguments<typeof functions.workerRegistration>
export type WorkerRegistrationReturn = FunctionReturn<typeof functions.workerRegistration>

