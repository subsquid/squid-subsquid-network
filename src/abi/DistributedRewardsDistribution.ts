import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approved: event("0x1718a64c060e83f86c815c1c1c305b016fd419f5d150962d0d6405761e74c5e4", {"who": indexed(p.address), "fromBlock": p.uint256, "toBlock": p.uint256, "commitment": p.bytes32}),
    ApprovesRequiredChanged: event("0x82128e565cfc8353e79f542d7a277dfa675daed9c90a8b5321cc0363ff8a7370", {"newApprovesRequired": p.uint256}),
    Claimed: event("0x987d620f307ff6b94d58743cb7a7509f24071586a77759b77c2d4e29f75a2f9a", {"by": indexed(p.address), "worker": indexed(p.uint256), "amount": p.uint256}),
    Distributed: event("0xa4a6b2187ef1354bf92bcc14dc28e999e5ecb37642caa1a28205659068a104fa", {"fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "stakerRewards": p.array(p.uint256)}),
    DistributorAdded: event("0xddbf200aa634dc3fb81cfd68583dd1040d1c751d335e1d86b631bde3e977fea8", {"distributor": indexed(p.address)}),
    DistributorRemoved: event("0x126174f6cf49c81cdb4a9214c6b8f037bef55b4ec31e4fc776cea2a1c8a88d59", {"distributor": indexed(p.address)}),
    NewCommitment: event("0x3d0e20f31408b190e11fe8ac40c73e8aca970b3f47c98f626c110d9fe0199707", {"who": indexed(p.address), "fromBlock": p.uint256, "toBlock": p.uint256, "commitment": p.bytes32}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", {"account": p.address}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoundRobinBlocksChanged: event("0xe3af6ab99586802d1ac3592654adaba57091ee99ae93a64a092c813552591aab", {"newRoundRobinBlocks": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", {"account": p.address}),
    WindowSizeChanged: event("0xea307e5ee57372fa76a40fce652eb46a4f9fb1d64e42c3af1128a56729d30f65", {"newWindowSize": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", {}, p.bytes32),
    PAUSER_ROLE: viewFun("0xe63ab1e9", {}, p.bytes32),
    REWARDS_DISTRIBUTOR_ROLE: viewFun("0xc34c2289", {}, p.bytes32),
    REWARDS_TREASURY_ROLE: viewFun("0xb5b06781", {}, p.bytes32),
    addDistributor: fun("0x7250e224", {"distributor": p.address}, ),
    alreadyApproved: viewFun("0x406e3090", {"commitment": p.bytes32, "distributor": p.address}, p.bool),
    approve: fun("0x565b756a", {"fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "_stakerRewards": p.array(p.uint256)}, ),
    approves: viewFun("0x773b68c9", {"fromBlock": p.uint256, "toBlock": p.uint256}, p.uint8),
    canApprove: viewFun("0x42bef350", {"who": p.address, "fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "_stakerRewards": p.array(p.uint256)}, p.bool),
    canCommit: viewFun("0xb278e358", {"who": p.address}, p.bool),
    claim: fun("0x1e83409a", {"who": p.address}, p.uint256),
    claimable: viewFun("0x402914f5", {"who": p.address}, p.uint256),
    commit: fun("0x6957bc60", {"fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "_stakerRewards": p.array(p.uint256)}, ),
    commitments: viewFun("0xd13e2e60", {"fromBlock": p.uint256, "toBlock": p.uint256}, p.bytes32),
    getRoleAdmin: viewFun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    lastBlockRewarded: viewFun("0xeadf1f39", {}, p.uint256),
    pause: fun("0x8456cb59", {}, ),
    paused: viewFun("0x5c975abb", {}, p.bool),
    removeDistributor: fun("0x57c1f9e2", {"distributor": p.address}, ),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    requiredApproves: viewFun("0x75ddfa41", {}, p.uint256),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    roundRobinBlocks: viewFun("0x75a32da6", {}, p.uint256),
    router: viewFun("0xf887ea40", {}, p.address),
    setApprovesRequired: fun("0x6a0bb81c", {"_approvesRequired": p.uint256}, ),
    setRoundRobinBlocks: fun("0x0d6cf7b0", {"_roundRobinBlocks": p.uint256}, ),
    setWindowSize: fun("0xaaabc315", {"_windowSize": p.uint256}, ),
    supportsInterface: viewFun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    unpause: fun("0x3f4ba83a", {}, ),
    windowSize: viewFun("0x8a14117a", {}, p.uint256),
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

    REWARDS_TREASURY_ROLE() {
        return this.eth_call(functions.REWARDS_TREASURY_ROLE, {})
    }

    alreadyApproved(commitment: AlreadyApprovedParams["commitment"], distributor: AlreadyApprovedParams["distributor"]) {
        return this.eth_call(functions.alreadyApproved, {commitment, distributor})
    }

    approves(fromBlock: ApprovesParams["fromBlock"], toBlock: ApprovesParams["toBlock"]) {
        return this.eth_call(functions.approves, {fromBlock, toBlock})
    }

    canApprove(who: CanApproveParams["who"], fromBlock: CanApproveParams["fromBlock"], toBlock: CanApproveParams["toBlock"], recipients: CanApproveParams["recipients"], workerRewards: CanApproveParams["workerRewards"], _stakerRewards: CanApproveParams["_stakerRewards"]) {
        return this.eth_call(functions.canApprove, {who, fromBlock, toBlock, recipients, workerRewards, _stakerRewards})
    }

    canCommit(who: CanCommitParams["who"]) {
        return this.eth_call(functions.canCommit, {who})
    }

    claimable(who: ClaimableParams["who"]) {
        return this.eth_call(functions.claimable, {who})
    }

    commitments(fromBlock: CommitmentsParams["fromBlock"], toBlock: CommitmentsParams["toBlock"]) {
        return this.eth_call(functions.commitments, {fromBlock, toBlock})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    lastBlockRewarded() {
        return this.eth_call(functions.lastBlockRewarded, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    requiredApproves() {
        return this.eth_call(functions.requiredApproves, {})
    }

    roundRobinBlocks() {
        return this.eth_call(functions.roundRobinBlocks, {})
    }

    router() {
        return this.eth_call(functions.router, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    windowSize() {
        return this.eth_call(functions.windowSize, {})
    }
}

/// Event types
export type ApprovedEventArgs = EParams<typeof events.Approved>
export type ApprovesRequiredChangedEventArgs = EParams<typeof events.ApprovesRequiredChanged>
export type ClaimedEventArgs = EParams<typeof events.Claimed>
export type DistributedEventArgs = EParams<typeof events.Distributed>
export type DistributorAddedEventArgs = EParams<typeof events.DistributorAdded>
export type DistributorRemovedEventArgs = EParams<typeof events.DistributorRemoved>
export type NewCommitmentEventArgs = EParams<typeof events.NewCommitment>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type RoundRobinBlocksChangedEventArgs = EParams<typeof events.RoundRobinBlocksChanged>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WindowSizeChangedEventArgs = EParams<typeof events.WindowSizeChanged>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>

export type REWARDS_DISTRIBUTOR_ROLEParams = FunctionArguments<typeof functions.REWARDS_DISTRIBUTOR_ROLE>
export type REWARDS_DISTRIBUTOR_ROLEReturn = FunctionReturn<typeof functions.REWARDS_DISTRIBUTOR_ROLE>

export type REWARDS_TREASURY_ROLEParams = FunctionArguments<typeof functions.REWARDS_TREASURY_ROLE>
export type REWARDS_TREASURY_ROLEReturn = FunctionReturn<typeof functions.REWARDS_TREASURY_ROLE>

export type AddDistributorParams = FunctionArguments<typeof functions.addDistributor>
export type AddDistributorReturn = FunctionReturn<typeof functions.addDistributor>

export type AlreadyApprovedParams = FunctionArguments<typeof functions.alreadyApproved>
export type AlreadyApprovedReturn = FunctionReturn<typeof functions.alreadyApproved>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type ApprovesParams = FunctionArguments<typeof functions.approves>
export type ApprovesReturn = FunctionReturn<typeof functions.approves>

export type CanApproveParams = FunctionArguments<typeof functions.canApprove>
export type CanApproveReturn = FunctionReturn<typeof functions.canApprove>

export type CanCommitParams = FunctionArguments<typeof functions.canCommit>
export type CanCommitReturn = FunctionReturn<typeof functions.canCommit>

export type ClaimParams = FunctionArguments<typeof functions.claim>
export type ClaimReturn = FunctionReturn<typeof functions.claim>

export type ClaimableParams = FunctionArguments<typeof functions.claimable>
export type ClaimableReturn = FunctionReturn<typeof functions.claimable>

export type CommitParams = FunctionArguments<typeof functions.commit>
export type CommitReturn = FunctionReturn<typeof functions.commit>

export type CommitmentsParams = FunctionArguments<typeof functions.commitments>
export type CommitmentsReturn = FunctionReturn<typeof functions.commitments>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type LastBlockRewardedParams = FunctionArguments<typeof functions.lastBlockRewarded>
export type LastBlockRewardedReturn = FunctionReturn<typeof functions.lastBlockRewarded>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RemoveDistributorParams = FunctionArguments<typeof functions.removeDistributor>
export type RemoveDistributorReturn = FunctionReturn<typeof functions.removeDistributor>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RequiredApprovesParams = FunctionArguments<typeof functions.requiredApproves>
export type RequiredApprovesReturn = FunctionReturn<typeof functions.requiredApproves>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RoundRobinBlocksParams = FunctionArguments<typeof functions.roundRobinBlocks>
export type RoundRobinBlocksReturn = FunctionReturn<typeof functions.roundRobinBlocks>

export type RouterParams = FunctionArguments<typeof functions.router>
export type RouterReturn = FunctionReturn<typeof functions.router>

export type SetApprovesRequiredParams = FunctionArguments<typeof functions.setApprovesRequired>
export type SetApprovesRequiredReturn = FunctionReturn<typeof functions.setApprovesRequired>

export type SetRoundRobinBlocksParams = FunctionArguments<typeof functions.setRoundRobinBlocks>
export type SetRoundRobinBlocksReturn = FunctionReturn<typeof functions.setRoundRobinBlocks>

export type SetWindowSizeParams = FunctionArguments<typeof functions.setWindowSize>
export type SetWindowSizeReturn = FunctionReturn<typeof functions.setWindowSize>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type WindowSizeParams = FunctionArguments<typeof functions.windowSize>
export type WindowSizeReturn = FunctionReturn<typeof functions.windowSize>

