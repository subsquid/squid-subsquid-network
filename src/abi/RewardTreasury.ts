import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Claimed: event("0xf7a40077ff7a04c7e61f6f26fb13774259ddf1b6bce9ecf26a8276cdd3992683", {"by": indexed(p.address), "receiver": indexed(p.address), "amount": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", {"account": p.address}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", {"account": p.address}),
    WhitelistedDistributorSet: event("0x79420e21e204bc31262bc1cf3cde02641e2f25da501557d80f399b32dad50c17", {"distributor": indexed(p.address), "isWhitelisted": p.bool}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", {}, p.bytes32),
    PAUSER_ROLE: viewFun("0xe63ab1e9", {}, p.bytes32),
    claim: fun("0x1e83409a", {"rewardDistribution": p.address}, ),
    claimFor: fun("0xb4ba9e11", {"rewardDistribution": p.address, "receiver": p.address}, ),
    claimable: viewFun("0xd4570c1c", {"rewardDistribution": p.address, "sender": p.address}, p.uint256),
    getRoleAdmin: viewFun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    isWhitelistedDistributor: viewFun("0xcbccc3e0", {"_0": p.address}, p.bool),
    pause: fun("0x8456cb59", {}, ),
    paused: viewFun("0x5c975abb", {}, p.bool),
    reclaimFunds: fun("0xcce4bd52", {}, ),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    rewardToken: viewFun("0xf7c618c1", {}, p.address),
    setWhitelistedDistributor: fun("0xb53c69b6", {"distributor": p.address, "isWhitelisted": p.bool}, ),
    supportsInterface: viewFun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    unpause: fun("0x3f4ba83a", {}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    PAUSER_ROLE() {
        return this.eth_call(functions.PAUSER_ROLE, {})
    }

    claimable(rewardDistribution: ClaimableParams["rewardDistribution"], sender: ClaimableParams["sender"]) {
        return this.eth_call(functions.claimable, {rewardDistribution, sender})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isWhitelistedDistributor(_0: IsWhitelistedDistributorParams["_0"]) {
        return this.eth_call(functions.isWhitelistedDistributor, {_0})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    rewardToken() {
        return this.eth_call(functions.rewardToken, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }
}

/// Event types
export type ClaimedEventArgs = EParams<typeof events.Claimed>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WhitelistedDistributorSetEventArgs = EParams<typeof events.WhitelistedDistributorSet>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>

export type ClaimParams = FunctionArguments<typeof functions.claim>
export type ClaimReturn = FunctionReturn<typeof functions.claim>

export type ClaimForParams = FunctionArguments<typeof functions.claimFor>
export type ClaimForReturn = FunctionReturn<typeof functions.claimFor>

export type ClaimableParams = FunctionArguments<typeof functions.claimable>
export type ClaimableReturn = FunctionReturn<typeof functions.claimable>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type IsWhitelistedDistributorParams = FunctionArguments<typeof functions.isWhitelistedDistributor>
export type IsWhitelistedDistributorReturn = FunctionReturn<typeof functions.isWhitelistedDistributor>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type ReclaimFundsParams = FunctionArguments<typeof functions.reclaimFunds>
export type ReclaimFundsReturn = FunctionReturn<typeof functions.reclaimFunds>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>

export type SetWhitelistedDistributorParams = FunctionArguments<typeof functions.setWhitelistedDistributor>
export type SetWhitelistedDistributorReturn = FunctionReturn<typeof functions.setWhitelistedDistributor>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

