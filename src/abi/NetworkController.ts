import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AllowedVestedTargetUpdated: event("0x13077507c996c414a31510046627495d92322309f93e988a33cedb8108f2747f", {"target": p.address, "isAllowed": p.bool}),
    BondAmountUpdated: event("0xa15246e54ef77ae7edbf99b267138a83931b938b03e9f853067299eddb4099a7", {"bondAmount": p.uint256}),
    EpochLengthUpdated: event("0xbddf13f72535a30b09d184d523d014c36ebb18c3fcbdefca337707cd3a14731d", {"epochLength": p.uint128}),
    RewardCoefficientUpdated: event("0xd5eee2f0795409a39ce32b09109addf49185c076a0a1f860b71eef53f6859a15", {"coefficient": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    StakingDeadlockUpdated: event("0x188ac85a2477b360c1360199e1cc6200bc87dc4e640848bb7fb10476d2850761", {"stakingDeadlock": p.uint256}),
    StoragePerWorkerInGbUpdated: event("0xf014b48e4917612e4346d196ad58d0a8a1c465b3cf12c32079bad77d0de205fa", {"storagePerWorkerInGb": p.uint128}),
    TargetCapacityUpdated: event("0x9b533265fa62d942c09baea98ca07a219597ec12534a0e0ed84e45f40bdb3b33", {"target": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", {}, p.bytes32),
    bondAmount: viewFun("0x80f323a7", {}, p.uint256),
    epochLength: viewFun("0x57d775f8", {}, p.uint128),
    epochNumber: viewFun("0xf4145a83", {}, p.uint128),
    firstEpochBlock: viewFun("0x578e2a85", {}, p.uint128),
    getRoleAdmin: viewFun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    isAllowedVestedTarget: viewFun("0x9425d1f4", {"_0": p.address}, p.bool),
    nextEpoch: viewFun("0xaea0e78b", {}, p.uint128),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    setAllowedVestedTarget: fun("0x02ac6b6c", {"target": p.address, "isAllowed": p.bool}, ),
    setBondAmount: fun("0x28f9f3e6", {"_bondAmount": p.uint256}, ),
    setEpochLength: fun("0x0d8d840b", {"_epochLength": p.uint128}, ),
    setStakingDeadlock: fun("0x6214e299", {"_newDeadlock": p.uint256}, ),
    setStoragePerWorkerInGb: fun("0x7e9d6b0a", {"_storagePerWorkerInGb": p.uint128}, ),
    setTargetCapacity: fun("0xe10e9d60", {"target": p.uint256}, ),
    setYearlyRewardCapCoefficient: fun("0xbdf97dc9", {"coefficient": p.uint256}, ),
    stakingDeadlock: viewFun("0x5b446c44", {}, p.uint256),
    storagePerWorkerInGb: viewFun("0x2b5d1529", {}, p.uint128),
    supportsInterface: viewFun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    targetCapacityGb: viewFun("0x17395c74", {}, p.uint256),
    yearlyRewardCapCoefficient: viewFun("0x1cb34cb6", {}, p.uint256),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    bondAmount() {
        return this.eth_call(functions.bondAmount, {})
    }

    epochLength() {
        return this.eth_call(functions.epochLength, {})
    }

    epochNumber() {
        return this.eth_call(functions.epochNumber, {})
    }

    firstEpochBlock() {
        return this.eth_call(functions.firstEpochBlock, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isAllowedVestedTarget(_0: IsAllowedVestedTargetParams["_0"]) {
        return this.eth_call(functions.isAllowedVestedTarget, {_0})
    }

    nextEpoch() {
        return this.eth_call(functions.nextEpoch, {})
    }

    stakingDeadlock() {
        return this.eth_call(functions.stakingDeadlock, {})
    }

    storagePerWorkerInGb() {
        return this.eth_call(functions.storagePerWorkerInGb, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    targetCapacityGb() {
        return this.eth_call(functions.targetCapacityGb, {})
    }

    yearlyRewardCapCoefficient() {
        return this.eth_call(functions.yearlyRewardCapCoefficient, {})
    }
}

/// Event types
export type AllowedVestedTargetUpdatedEventArgs = EParams<typeof events.AllowedVestedTargetUpdated>
export type BondAmountUpdatedEventArgs = EParams<typeof events.BondAmountUpdated>
export type EpochLengthUpdatedEventArgs = EParams<typeof events.EpochLengthUpdated>
export type RewardCoefficientUpdatedEventArgs = EParams<typeof events.RewardCoefficientUpdated>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type StakingDeadlockUpdatedEventArgs = EParams<typeof events.StakingDeadlockUpdated>
export type StoragePerWorkerInGbUpdatedEventArgs = EParams<typeof events.StoragePerWorkerInGbUpdated>
export type TargetCapacityUpdatedEventArgs = EParams<typeof events.TargetCapacityUpdated>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type BondAmountParams = FunctionArguments<typeof functions.bondAmount>
export type BondAmountReturn = FunctionReturn<typeof functions.bondAmount>

export type EpochLengthParams = FunctionArguments<typeof functions.epochLength>
export type EpochLengthReturn = FunctionReturn<typeof functions.epochLength>

export type EpochNumberParams = FunctionArguments<typeof functions.epochNumber>
export type EpochNumberReturn = FunctionReturn<typeof functions.epochNumber>

export type FirstEpochBlockParams = FunctionArguments<typeof functions.firstEpochBlock>
export type FirstEpochBlockReturn = FunctionReturn<typeof functions.firstEpochBlock>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type IsAllowedVestedTargetParams = FunctionArguments<typeof functions.isAllowedVestedTarget>
export type IsAllowedVestedTargetReturn = FunctionReturn<typeof functions.isAllowedVestedTarget>

export type NextEpochParams = FunctionArguments<typeof functions.nextEpoch>
export type NextEpochReturn = FunctionReturn<typeof functions.nextEpoch>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetAllowedVestedTargetParams = FunctionArguments<typeof functions.setAllowedVestedTarget>
export type SetAllowedVestedTargetReturn = FunctionReturn<typeof functions.setAllowedVestedTarget>

export type SetBondAmountParams = FunctionArguments<typeof functions.setBondAmount>
export type SetBondAmountReturn = FunctionReturn<typeof functions.setBondAmount>

export type SetEpochLengthParams = FunctionArguments<typeof functions.setEpochLength>
export type SetEpochLengthReturn = FunctionReturn<typeof functions.setEpochLength>

export type SetStakingDeadlockParams = FunctionArguments<typeof functions.setStakingDeadlock>
export type SetStakingDeadlockReturn = FunctionReturn<typeof functions.setStakingDeadlock>

export type SetStoragePerWorkerInGbParams = FunctionArguments<typeof functions.setStoragePerWorkerInGb>
export type SetStoragePerWorkerInGbReturn = FunctionReturn<typeof functions.setStoragePerWorkerInGb>

export type SetTargetCapacityParams = FunctionArguments<typeof functions.setTargetCapacity>
export type SetTargetCapacityReturn = FunctionReturn<typeof functions.setTargetCapacity>

export type SetYearlyRewardCapCoefficientParams = FunctionArguments<typeof functions.setYearlyRewardCapCoefficient>
export type SetYearlyRewardCapCoefficientReturn = FunctionReturn<typeof functions.setYearlyRewardCapCoefficient>

export type StakingDeadlockParams = FunctionArguments<typeof functions.stakingDeadlock>
export type StakingDeadlockReturn = FunctionReturn<typeof functions.stakingDeadlock>

export type StoragePerWorkerInGbParams = FunctionArguments<typeof functions.storagePerWorkerInGb>
export type StoragePerWorkerInGbReturn = FunctionReturn<typeof functions.storagePerWorkerInGb>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TargetCapacityGbParams = FunctionArguments<typeof functions.targetCapacityGb>
export type TargetCapacityGbReturn = FunctionReturn<typeof functions.targetCapacityGb>

export type YearlyRewardCapCoefficientParams = FunctionArguments<typeof functions.yearlyRewardCapCoefficient>
export type YearlyRewardCapCoefficientReturn = FunctionReturn<typeof functions.yearlyRewardCapCoefficient>

