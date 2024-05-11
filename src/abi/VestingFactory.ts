import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", {"account": p.address}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", {"account": p.address}),
    VestingCreated: event("0xba477ae50ac3a59d5a6eadd2b0775d90074a7d6bc7a737f2ae874e66dab607f1", {"vesting": indexed(p.address), "beneficiary": indexed(p.address), "startTimestamp": p.uint64, "durationSeconds": p.uint64, "expectedTotalAmount": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: fun("0xa217fddf", {}, p.bytes32),
    PAUSER_ROLE: fun("0xe63ab1e9", {}, p.bytes32),
    VESTING_CREATOR_ROLE: fun("0xe9a7fb54", {}, p.bytes32),
    createVesting: fun("0xc623c479", {"beneficiaryAddress": p.address, "startTimestamp": p.uint64, "durationSeconds": p.uint64, "immediateReleaseBIP": p.uint256, "expectedTotalAmount": p.uint256}, p.address),
    getRoleAdmin: fun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: fun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    pause: fun("0x8456cb59", {}, ),
    paused: fun("0x5c975abb", {}, p.bool),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    router: fun("0xf887ea40", {}, p.address),
    supportsInterface: fun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    token: fun("0xfc0c546a", {}, p.address),
    unpause: fun("0x3f4ba83a", {}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    PAUSER_ROLE() {
        return this.eth_call(functions.PAUSER_ROLE, {})
    }

    VESTING_CREATOR_ROLE() {
        return this.eth_call(functions.VESTING_CREATOR_ROLE, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
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
}

/// Event types
export type PausedEventArgs = EParams<typeof events.Paused>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type VestingCreatedEventArgs = EParams<typeof events.VestingCreated>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>

export type VESTING_CREATOR_ROLEParams = FunctionArguments<typeof functions.VESTING_CREATOR_ROLE>
export type VESTING_CREATOR_ROLEReturn = FunctionReturn<typeof functions.VESTING_CREATOR_ROLE>

export type CreateVestingParams = FunctionArguments<typeof functions.createVesting>
export type CreateVestingReturn = FunctionReturn<typeof functions.createVesting>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

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

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

