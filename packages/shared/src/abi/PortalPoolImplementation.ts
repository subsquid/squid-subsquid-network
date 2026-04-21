import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    CapacityUpdated: event("0xbe7f9e13de886daecad6ce97a1f9723e1f5a143d2e447587e282275a819c27ad", "CapacityUpdated(uint256,uint256)", {"oldCapacity": p.uint256, "newCapacity": p.uint256}),
    Deposited: event("0x73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca", "Deposited(address,uint256,uint256)", {"provider": indexed(p.address), "amount": p.uint256, "newTotal": p.uint256}),
    DistributionRateChanged: event("0x5dccc0d5e9abea326bbce0419fde03cddafe49f67941e6c5703303375db73272", "DistributionRateChanged(uint256,uint256)", {"oldRate": p.uint256, "newRate": p.uint256}),
    ExitClaimed: event("0x2125c86840af875089592426ea5b7f6a45ef059fb5ceb8fc63bd10faadfd4aa3", "ExitClaimed(address,uint256)", {"provider": indexed(p.address), "amount": p.uint256}),
    ExitRequested: event("0x4cf94291edeab4daefe36ffc570177414768fd63b0ee9d075d82098fe4f44db1", "ExitRequested(address,uint256,uint256)", {"provider": indexed(p.address), "amount": p.uint256, "endPosition": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    PoolClosed: event("0x54d833a6369fbb6af4373700bdaf73d7a1ad1be05825bc9475be295d43a5d7bb", "PoolClosed(address,uint256)", {"closedBy": indexed(p.address), "timestamp": p.uint256}),
    RewardsClaimed: event("0xfc30cddea38e2bf4d6ea7d3f9ed3b6ad7f176419f4963bd81318067a4aee73fe", "RewardsClaimed(address,uint256)", {"provider": indexed(p.address), "amount": p.uint256}),
    RewardsRecovered: event("0x19f0b1340f66a05f5449dc6a7ce27ffd75cdf3e8ea8be6bd4818f481a5e53097", "RewardsRecovered(address,uint256)", {"operator": indexed(p.address), "amount": p.uint256}),
    RewardsToppedUp: event("0x3beb96d35cbecf0959835cae915575d4bb9e105f530152e5f489e7227e9d124a", "RewardsToppedUp(address,uint256,uint256,uint256,uint256)", {"operator": indexed(p.address), "received": p.uint256, "toProviders": p.uint256, "toWorkerPool": p.uint256, "toBurn": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    StakeTransferred: event("0x1e07278daf12d879e91ea076cf43032a70d56cb1d6e8bc91534dcd17f61e18f3", "StakeTransferred(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "amount": p.uint256}),
    StateChanged: event("0xe8a97ea87e4388fa22d496b95a8ed5ced6717f49790318de2b928aaf37a021d8", "StateChanged(uint8,uint8)", {"oldState": p.uint8, "newState": p.uint8}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    WhitelistEnabledChanged: event("0x398a48620e25b3559c326c0c3768b091c74ada82c20d1c8dbfe11ae96cd1d47e", "WhitelistEnabledChanged(bool)", {"enabled": p.bool}),
    WhitelistUpdated: event("0xf93f9a76c1bf3444d22400a00cb9fe990e6abe9dbb333fda48859cfee864543d", "WhitelistUpdated(address,bool)", {"user": indexed(p.address), "added": p.bool}),
    Withdrawn: event("0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5", "Withdrawn(address,uint256)", {"provider": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    ACC: viewFun("0x0ed52473", "ACC()", {}, p.uint256),
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    FACTORY_ROLE: viewFun("0x04a0fb17", "FACTORY_ROLE()", {}, p.bytes32),
    OPERATOR_ROLE: viewFun("0xf5b541a6", "OPERATOR_ROLE()", {}, p.bytes32),
    PRECISION: viewFun("0xaaf5eb68", "PRECISION()", {}, p.uint256),
    RATE_PRECISION: viewFun("0x2b3ba681", "RATE_PRECISION()", {}, p.uint256),
    addToWhitelist: fun("0x7f649783", "addToWhitelist(address[])", {"users": p.array(p.address)}, ),
    balanceTs: viewFun("0xf04e6353", "balanceTs()", {}, p.uint64),
    burnAddress: viewFun("0x70d5ae05", "burnAddress()", {}, p.address),
    checkAndFailPortal: fun("0xe73aa4b8", "checkAndFailPortal()", {}, ),
    claimRewards: fun("0x372500ab", "claimRewards()", {}, p.uint256),
    claimRewardsFromClosed: fun("0x8d2bb3cf", "claimRewardsFromClosed()", {}, p.uint256),
    closePool: fun("0x66805de5", "closePool()", {}, ),
    credit: viewFun("0xa06d083c", "credit()", {}, p.uint256),
    currentBalance: viewFun("0x5ccdd971", "currentBalance(uint256)", {"timestamp": p.uint256}, p.int256),
    debt: viewFun("0x0dca59c1", "debt()", {}, p.uint256),
    deposit: fun("0xb6b55f25", "deposit(uint256)", {"amount": p.uint256}, ),
    emergencyWithdraw: fun("0xdb2e21bc", "emergencyWithdraw()", {}, ),
    getActiveStake: viewFun("0x17387b58", "getActiveStake()", {}, p.uint256),
    getClaimableRewards: viewFun("0x308e401e", "getClaimableRewards(address)", {"provider": p.address}, p.uint256),
    getComputationUnits: viewFun("0x4a4880aa", "getComputationUnits()", {}, p.uint256),
    getCredit: viewFun("0x59296e7b", "getCredit()", {}, p.uint256),
    getCurrentRewardBalance: viewFun("0x38668b42", "getCurrentRewardBalance()", {}, p.int256),
    getDebt: viewFun("0x14a6bf0f", "getDebt()", {}, p.uint256),
    getExitTicket: viewFun("0x6ea6fc02", "getExitTicket(address,uint256)", {"provider": p.address, "ticketId": p.uint256}, p.struct({"endPosition": p.uint256, "amount": p.uint256, "withdrawn": p.bool})),
    getMetadata: viewFun("0x7a5b4f59", "getMetadata()", {}, p.string),
    getMinCapacity: viewFun("0x251a8872", "getMinCapacity()", {}, p.uint256),
    getPoolInfo: viewFun("0x60246c88", "getPoolInfo()", {}, p.struct({"operator": p.address, "capacity": p.uint256, "totalStaked": p.uint256, "depositDeadline": p.uint64, "activationTime": p.uint64, "state": p.uint8, "paused": p.bool, "firstActivated": p.bool})),
    getPoolStatusWithRewards: viewFun("0x1d7903da", "getPoolStatusWithRewards(address)", {"provider": p.address}, {"poolCredit": p.uint256, "poolDebt": p.uint256, "poolBalance": p.int256, "runway": p.int256, "outOfMoney": p.bool, "providerRewards": p.uint256, "providerStake": p.uint256}),
    getProviderStake: viewFun("0xbfebc370", "getProviderStake(address)", {"provider": p.address}, p.uint256),
    getQueueStatus: viewFun("0x48ac0a4d", "getQueueStatus(address,uint256)", {"provider": p.address, "ticketId": p.uint256}, {"processed": p.uint256, "providerEndPos": p.uint256, "secondsRemaining": p.uint256, "ready": p.bool}),
    getQueueStatusWithTimestamp: viewFun("0x07d01078", "getQueueStatusWithTimestamp(address,uint256)", {"provider": p.address, "ticketId": p.uint256}, {"processed": p.uint256, "providerEndPos": p.uint256, "secondsRemaining": p.uint256, "ready": p.bool, "unlockTimestamp": p.uint256}),
    getRewardStatus: viewFun("0x2f8dc1ce", "getRewardStatus()", {}, {"balance": p.int256, "currentDebt": p.uint256, "runwayTimestamp": p.int256, "isDry": p.bool}),
    getRewardToken: viewFun("0x69940d79", "getRewardToken()", {}, p.address),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    getRunway: viewFun("0x5b6f9455", "getRunway()", {}, p.int256),
    getState: viewFun("0x1865c57d", "getState()", {}, p.uint8),
    getTicketCount: viewFun("0xcff82e22", "getTicketCount(address)", {"provider": p.address}, p.uint256),
    getTotalDrainRate: viewFun("0x6e0e7fb1", "getTotalDrainRate()", {}, p.uint256),
    getTotalProcessed: viewFun("0x4022a85c", "getTotalProcessed()", {}, p.uint256),
    getWithdrawalWaitingTimestamp: viewFun("0x64a2d939", "getWithdrawalWaitingTimestamp(uint256)", {"amount": p.uint256}, p.uint256),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    initialize: fun("0x486fe319", "initialize((address,uint256,uint256,string,address,address,address,address,uint256,uint256,string))", {"params": p.struct({"operator": p.address, "capacity": p.uint256, "depositDeadline": p.uint256, "tokenSuffix": p.string, "sqd": p.address, "rewardToken": p.address, "portalRegistry": p.address, "feeRouter": p.address, "minStakeThreshold": p.uint256, "distributionRatePerSecond": p.uint256, "metadata": p.string})}, ),
    initializeCredit: fun("0x836785c8", "initializeCredit(uint256)", {"amount": p.uint256}, ),
    isOutOfMoney: viewFun("0x99d3fa44", "isOutOfMoney()", {}, p.bool),
    isWhitelisted: viewFun("0x3af32abf", "isWhitelisted(address)", {"user": p.address}, p.bool),
    lastEffectiveRewardTs: viewFun("0x85dc11eb", "lastEffectiveRewardTs()", {}, p.uint64),
    lptToken: viewFun("0xedf62cf1", "lptToken()", {}, p.address),
    multicall: fun("0xac9650d8", "multicall(bytes[])", {"data": p.array(p.bytes)}, p.array(p.bytes)),
    onLPTTransfer: fun("0xaf49752b", "onLPTTransfer(address,address,uint256)", {"from": p.address, "to": p.address, "amount": p.uint256}, ),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    perStakeRateWad: viewFun("0xb5cb3ce8", "perStakeRateWad()", {}, p.uint256),
    providerRatePerSec: viewFun("0x1244212f", "providerRatePerSec()", {}, p.uint256),
    recoverRewardsFromFailed: fun("0x3993a222", "recoverRewardsFromFailed()", {}, p.uint256),
    removeFromWhitelist: fun("0x548db174", "removeFromWhitelist(address[])", {"users": p.array(p.address)}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    requestExit: fun("0x721c6513", "requestExit(uint256)", {"amount": p.uint256}, p.uint256),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    rewardPerStakeStored: viewFun("0xa60681f3", "rewardPerStakeStored()", {}, p.uint256),
    setCapacity: fun("0x91915ef8", "setCapacity(uint256)", {"newCapacity": p.uint256}, ),
    setDistributionRate: fun("0x19983251", "setDistributionRate(uint256)", {"newRatePerSecond": p.uint256}, ),
    setWhitelistEnabled: fun("0x052d9e7e", "setWhitelistEnabled(bool)", {"enabled": p.bool}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    topUpRewards: fun("0xbc58d795", "topUpRewards(uint256)", {"amount": p.uint256}, ),
    totalDistributionRatePerSec: viewFun("0xde35aace", "totalDistributionRatePerSec()", {}, p.uint256),
    treasuryAccumulated: viewFun("0x01aa6655", "treasuryAccumulated()", {}, p.uint256),
    treasuryRatePerSec: viewFun("0x417c3fc6", "treasuryRatePerSec()", {}, p.uint256),
    tryMulticall: fun("0x437b9116", "tryMulticall(bytes[])", {"data": p.array(p.bytes)}, {"successes": p.array(p.bool), "results": p.array(p.bytes)}),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    whitelist: viewFun("0x9b19251a", "whitelist(address)", {"_0": p.address}, p.bool),
    whitelistEnabled: viewFun("0x51fb012d", "whitelistEnabled()", {}, p.bool),
    withdrawExit: fun("0xdefbac59", "withdrawExit(uint256)", {"ticketId": p.uint256}, ),
    withdrawFromFailed: fun("0x743537d6", "withdrawFromFailed()", {}, ),
    workerPoolAddress: viewFun("0xcbe912df", "workerPoolAddress()", {}, p.address),
}

export class Contract extends ContractBase {

    ACC() {
        return this.eth_call(functions.ACC, {})
    }

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    FACTORY_ROLE() {
        return this.eth_call(functions.FACTORY_ROLE, {})
    }

    OPERATOR_ROLE() {
        return this.eth_call(functions.OPERATOR_ROLE, {})
    }

    PRECISION() {
        return this.eth_call(functions.PRECISION, {})
    }

    RATE_PRECISION() {
        return this.eth_call(functions.RATE_PRECISION, {})
    }

    balanceTs() {
        return this.eth_call(functions.balanceTs, {})
    }

    burnAddress() {
        return this.eth_call(functions.burnAddress, {})
    }

    credit() {
        return this.eth_call(functions.credit, {})
    }

    currentBalance(timestamp: CurrentBalanceParams["timestamp"]) {
        return this.eth_call(functions.currentBalance, {timestamp})
    }

    debt() {
        return this.eth_call(functions.debt, {})
    }

    getActiveStake() {
        return this.eth_call(functions.getActiveStake, {})
    }

    getClaimableRewards(provider: GetClaimableRewardsParams["provider"]) {
        return this.eth_call(functions.getClaimableRewards, {provider})
    }

    getComputationUnits() {
        return this.eth_call(functions.getComputationUnits, {})
    }

    getCredit() {
        return this.eth_call(functions.getCredit, {})
    }

    getCurrentRewardBalance() {
        return this.eth_call(functions.getCurrentRewardBalance, {})
    }

    getDebt() {
        return this.eth_call(functions.getDebt, {})
    }

    getExitTicket(provider: GetExitTicketParams["provider"], ticketId: GetExitTicketParams["ticketId"]) {
        return this.eth_call(functions.getExitTicket, {provider, ticketId})
    }

    getMetadata() {
        return this.eth_call(functions.getMetadata, {})
    }

    getMinCapacity() {
        return this.eth_call(functions.getMinCapacity, {})
    }

    getPoolInfo() {
        return this.eth_call(functions.getPoolInfo, {})
    }

    getPoolStatusWithRewards(provider: GetPoolStatusWithRewardsParams["provider"]) {
        return this.eth_call(functions.getPoolStatusWithRewards, {provider})
    }

    getProviderStake(provider: GetProviderStakeParams["provider"]) {
        return this.eth_call(functions.getProviderStake, {provider})
    }

    getQueueStatus(provider: GetQueueStatusParams["provider"], ticketId: GetQueueStatusParams["ticketId"]) {
        return this.eth_call(functions.getQueueStatus, {provider, ticketId})
    }

    getQueueStatusWithTimestamp(provider: GetQueueStatusWithTimestampParams["provider"], ticketId: GetQueueStatusWithTimestampParams["ticketId"]) {
        return this.eth_call(functions.getQueueStatusWithTimestamp, {provider, ticketId})
    }

    getRewardStatus() {
        return this.eth_call(functions.getRewardStatus, {})
    }

    getRewardToken() {
        return this.eth_call(functions.getRewardToken, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    getRunway() {
        return this.eth_call(functions.getRunway, {})
    }

    getState() {
        return this.eth_call(functions.getState, {})
    }

    getTicketCount(provider: GetTicketCountParams["provider"]) {
        return this.eth_call(functions.getTicketCount, {provider})
    }

    getTotalDrainRate() {
        return this.eth_call(functions.getTotalDrainRate, {})
    }

    getTotalProcessed() {
        return this.eth_call(functions.getTotalProcessed, {})
    }

    getWithdrawalWaitingTimestamp(amount: GetWithdrawalWaitingTimestampParams["amount"]) {
        return this.eth_call(functions.getWithdrawalWaitingTimestamp, {amount})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isOutOfMoney() {
        return this.eth_call(functions.isOutOfMoney, {})
    }

    isWhitelisted(user: IsWhitelistedParams["user"]) {
        return this.eth_call(functions.isWhitelisted, {user})
    }

    lastEffectiveRewardTs() {
        return this.eth_call(functions.lastEffectiveRewardTs, {})
    }

    lptToken() {
        return this.eth_call(functions.lptToken, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    perStakeRateWad() {
        return this.eth_call(functions.perStakeRateWad, {})
    }

    providerRatePerSec() {
        return this.eth_call(functions.providerRatePerSec, {})
    }

    rewardPerStakeStored() {
        return this.eth_call(functions.rewardPerStakeStored, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    totalDistributionRatePerSec() {
        return this.eth_call(functions.totalDistributionRatePerSec, {})
    }

    treasuryAccumulated() {
        return this.eth_call(functions.treasuryAccumulated, {})
    }

    treasuryRatePerSec() {
        return this.eth_call(functions.treasuryRatePerSec, {})
    }

    whitelist(_0: WhitelistParams["_0"]) {
        return this.eth_call(functions.whitelist, {_0})
    }

    whitelistEnabled() {
        return this.eth_call(functions.whitelistEnabled, {})
    }

    workerPoolAddress() {
        return this.eth_call(functions.workerPoolAddress, {})
    }
}

/// Event types
export type CapacityUpdatedEventArgs = EParams<typeof events.CapacityUpdated>
export type DepositedEventArgs = EParams<typeof events.Deposited>
export type DistributionRateChangedEventArgs = EParams<typeof events.DistributionRateChanged>
export type ExitClaimedEventArgs = EParams<typeof events.ExitClaimed>
export type ExitRequestedEventArgs = EParams<typeof events.ExitRequested>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type PausedEventArgs = EParams<typeof events.Paused>
export type PoolClosedEventArgs = EParams<typeof events.PoolClosed>
export type RewardsClaimedEventArgs = EParams<typeof events.RewardsClaimed>
export type RewardsRecoveredEventArgs = EParams<typeof events.RewardsRecovered>
export type RewardsToppedUpEventArgs = EParams<typeof events.RewardsToppedUp>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type StakeTransferredEventArgs = EParams<typeof events.StakeTransferred>
export type StateChangedEventArgs = EParams<typeof events.StateChanged>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WhitelistEnabledChangedEventArgs = EParams<typeof events.WhitelistEnabledChanged>
export type WhitelistUpdatedEventArgs = EParams<typeof events.WhitelistUpdated>
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>

/// Function types
export type ACCParams = FunctionArguments<typeof functions.ACC>
export type ACCReturn = FunctionReturn<typeof functions.ACC>

export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type FACTORY_ROLEParams = FunctionArguments<typeof functions.FACTORY_ROLE>
export type FACTORY_ROLEReturn = FunctionReturn<typeof functions.FACTORY_ROLE>

export type OPERATOR_ROLEParams = FunctionArguments<typeof functions.OPERATOR_ROLE>
export type OPERATOR_ROLEReturn = FunctionReturn<typeof functions.OPERATOR_ROLE>

export type PRECISIONParams = FunctionArguments<typeof functions.PRECISION>
export type PRECISIONReturn = FunctionReturn<typeof functions.PRECISION>

export type RATE_PRECISIONParams = FunctionArguments<typeof functions.RATE_PRECISION>
export type RATE_PRECISIONReturn = FunctionReturn<typeof functions.RATE_PRECISION>

export type AddToWhitelistParams = FunctionArguments<typeof functions.addToWhitelist>
export type AddToWhitelistReturn = FunctionReturn<typeof functions.addToWhitelist>

export type BalanceTsParams = FunctionArguments<typeof functions.balanceTs>
export type BalanceTsReturn = FunctionReturn<typeof functions.balanceTs>

export type BurnAddressParams = FunctionArguments<typeof functions.burnAddress>
export type BurnAddressReturn = FunctionReturn<typeof functions.burnAddress>

export type CheckAndFailPortalParams = FunctionArguments<typeof functions.checkAndFailPortal>
export type CheckAndFailPortalReturn = FunctionReturn<typeof functions.checkAndFailPortal>

export type ClaimRewardsParams = FunctionArguments<typeof functions.claimRewards>
export type ClaimRewardsReturn = FunctionReturn<typeof functions.claimRewards>

export type ClaimRewardsFromClosedParams = FunctionArguments<typeof functions.claimRewardsFromClosed>
export type ClaimRewardsFromClosedReturn = FunctionReturn<typeof functions.claimRewardsFromClosed>

export type ClosePoolParams = FunctionArguments<typeof functions.closePool>
export type ClosePoolReturn = FunctionReturn<typeof functions.closePool>

export type CreditParams = FunctionArguments<typeof functions.credit>
export type CreditReturn = FunctionReturn<typeof functions.credit>

export type CurrentBalanceParams = FunctionArguments<typeof functions.currentBalance>
export type CurrentBalanceReturn = FunctionReturn<typeof functions.currentBalance>

export type DebtParams = FunctionArguments<typeof functions.debt>
export type DebtReturn = FunctionReturn<typeof functions.debt>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type EmergencyWithdrawParams = FunctionArguments<typeof functions.emergencyWithdraw>
export type EmergencyWithdrawReturn = FunctionReturn<typeof functions.emergencyWithdraw>

export type GetActiveStakeParams = FunctionArguments<typeof functions.getActiveStake>
export type GetActiveStakeReturn = FunctionReturn<typeof functions.getActiveStake>

export type GetClaimableRewardsParams = FunctionArguments<typeof functions.getClaimableRewards>
export type GetClaimableRewardsReturn = FunctionReturn<typeof functions.getClaimableRewards>

export type GetComputationUnitsParams = FunctionArguments<typeof functions.getComputationUnits>
export type GetComputationUnitsReturn = FunctionReturn<typeof functions.getComputationUnits>

export type GetCreditParams = FunctionArguments<typeof functions.getCredit>
export type GetCreditReturn = FunctionReturn<typeof functions.getCredit>

export type GetCurrentRewardBalanceParams = FunctionArguments<typeof functions.getCurrentRewardBalance>
export type GetCurrentRewardBalanceReturn = FunctionReturn<typeof functions.getCurrentRewardBalance>

export type GetDebtParams = FunctionArguments<typeof functions.getDebt>
export type GetDebtReturn = FunctionReturn<typeof functions.getDebt>

export type GetExitTicketParams = FunctionArguments<typeof functions.getExitTicket>
export type GetExitTicketReturn = FunctionReturn<typeof functions.getExitTicket>

export type GetMetadataParams = FunctionArguments<typeof functions.getMetadata>
export type GetMetadataReturn = FunctionReturn<typeof functions.getMetadata>

export type GetMinCapacityParams = FunctionArguments<typeof functions.getMinCapacity>
export type GetMinCapacityReturn = FunctionReturn<typeof functions.getMinCapacity>

export type GetPoolInfoParams = FunctionArguments<typeof functions.getPoolInfo>
export type GetPoolInfoReturn = FunctionReturn<typeof functions.getPoolInfo>

export type GetPoolStatusWithRewardsParams = FunctionArguments<typeof functions.getPoolStatusWithRewards>
export type GetPoolStatusWithRewardsReturn = FunctionReturn<typeof functions.getPoolStatusWithRewards>

export type GetProviderStakeParams = FunctionArguments<typeof functions.getProviderStake>
export type GetProviderStakeReturn = FunctionReturn<typeof functions.getProviderStake>

export type GetQueueStatusParams = FunctionArguments<typeof functions.getQueueStatus>
export type GetQueueStatusReturn = FunctionReturn<typeof functions.getQueueStatus>

export type GetQueueStatusWithTimestampParams = FunctionArguments<typeof functions.getQueueStatusWithTimestamp>
export type GetQueueStatusWithTimestampReturn = FunctionReturn<typeof functions.getQueueStatusWithTimestamp>

export type GetRewardStatusParams = FunctionArguments<typeof functions.getRewardStatus>
export type GetRewardStatusReturn = FunctionReturn<typeof functions.getRewardStatus>

export type GetRewardTokenParams = FunctionArguments<typeof functions.getRewardToken>
export type GetRewardTokenReturn = FunctionReturn<typeof functions.getRewardToken>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GetRunwayParams = FunctionArguments<typeof functions.getRunway>
export type GetRunwayReturn = FunctionReturn<typeof functions.getRunway>

export type GetStateParams = FunctionArguments<typeof functions.getState>
export type GetStateReturn = FunctionReturn<typeof functions.getState>

export type GetTicketCountParams = FunctionArguments<typeof functions.getTicketCount>
export type GetTicketCountReturn = FunctionReturn<typeof functions.getTicketCount>

export type GetTotalDrainRateParams = FunctionArguments<typeof functions.getTotalDrainRate>
export type GetTotalDrainRateReturn = FunctionReturn<typeof functions.getTotalDrainRate>

export type GetTotalProcessedParams = FunctionArguments<typeof functions.getTotalProcessed>
export type GetTotalProcessedReturn = FunctionReturn<typeof functions.getTotalProcessed>

export type GetWithdrawalWaitingTimestampParams = FunctionArguments<typeof functions.getWithdrawalWaitingTimestamp>
export type GetWithdrawalWaitingTimestampReturn = FunctionReturn<typeof functions.getWithdrawalWaitingTimestamp>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type InitializeCreditParams = FunctionArguments<typeof functions.initializeCredit>
export type InitializeCreditReturn = FunctionReturn<typeof functions.initializeCredit>

export type IsOutOfMoneyParams = FunctionArguments<typeof functions.isOutOfMoney>
export type IsOutOfMoneyReturn = FunctionReturn<typeof functions.isOutOfMoney>

export type IsWhitelistedParams = FunctionArguments<typeof functions.isWhitelisted>
export type IsWhitelistedReturn = FunctionReturn<typeof functions.isWhitelisted>

export type LastEffectiveRewardTsParams = FunctionArguments<typeof functions.lastEffectiveRewardTs>
export type LastEffectiveRewardTsReturn = FunctionReturn<typeof functions.lastEffectiveRewardTs>

export type LptTokenParams = FunctionArguments<typeof functions.lptToken>
export type LptTokenReturn = FunctionReturn<typeof functions.lptToken>

export type MulticallParams = FunctionArguments<typeof functions.multicall>
export type MulticallReturn = FunctionReturn<typeof functions.multicall>

export type OnLPTTransferParams = FunctionArguments<typeof functions.onLPTTransfer>
export type OnLPTTransferReturn = FunctionReturn<typeof functions.onLPTTransfer>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PerStakeRateWadParams = FunctionArguments<typeof functions.perStakeRateWad>
export type PerStakeRateWadReturn = FunctionReturn<typeof functions.perStakeRateWad>

export type ProviderRatePerSecParams = FunctionArguments<typeof functions.providerRatePerSec>
export type ProviderRatePerSecReturn = FunctionReturn<typeof functions.providerRatePerSec>

export type RecoverRewardsFromFailedParams = FunctionArguments<typeof functions.recoverRewardsFromFailed>
export type RecoverRewardsFromFailedReturn = FunctionReturn<typeof functions.recoverRewardsFromFailed>

export type RemoveFromWhitelistParams = FunctionArguments<typeof functions.removeFromWhitelist>
export type RemoveFromWhitelistReturn = FunctionReturn<typeof functions.removeFromWhitelist>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RequestExitParams = FunctionArguments<typeof functions.requestExit>
export type RequestExitReturn = FunctionReturn<typeof functions.requestExit>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RewardPerStakeStoredParams = FunctionArguments<typeof functions.rewardPerStakeStored>
export type RewardPerStakeStoredReturn = FunctionReturn<typeof functions.rewardPerStakeStored>

export type SetCapacityParams = FunctionArguments<typeof functions.setCapacity>
export type SetCapacityReturn = FunctionReturn<typeof functions.setCapacity>

export type SetDistributionRateParams = FunctionArguments<typeof functions.setDistributionRate>
export type SetDistributionRateReturn = FunctionReturn<typeof functions.setDistributionRate>

export type SetWhitelistEnabledParams = FunctionArguments<typeof functions.setWhitelistEnabled>
export type SetWhitelistEnabledReturn = FunctionReturn<typeof functions.setWhitelistEnabled>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TopUpRewardsParams = FunctionArguments<typeof functions.topUpRewards>
export type TopUpRewardsReturn = FunctionReturn<typeof functions.topUpRewards>

export type TotalDistributionRatePerSecParams = FunctionArguments<typeof functions.totalDistributionRatePerSec>
export type TotalDistributionRatePerSecReturn = FunctionReturn<typeof functions.totalDistributionRatePerSec>

export type TreasuryAccumulatedParams = FunctionArguments<typeof functions.treasuryAccumulated>
export type TreasuryAccumulatedReturn = FunctionReturn<typeof functions.treasuryAccumulated>

export type TreasuryRatePerSecParams = FunctionArguments<typeof functions.treasuryRatePerSec>
export type TreasuryRatePerSecReturn = FunctionReturn<typeof functions.treasuryRatePerSec>

export type TryMulticallParams = FunctionArguments<typeof functions.tryMulticall>
export type TryMulticallReturn = FunctionReturn<typeof functions.tryMulticall>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type WhitelistParams = FunctionArguments<typeof functions.whitelist>
export type WhitelistReturn = FunctionReturn<typeof functions.whitelist>

export type WhitelistEnabledParams = FunctionArguments<typeof functions.whitelistEnabled>
export type WhitelistEnabledReturn = FunctionReturn<typeof functions.whitelistEnabled>

export type WithdrawExitParams = FunctionArguments<typeof functions.withdrawExit>
export type WithdrawExitReturn = FunctionReturn<typeof functions.withdrawExit>

export type WithdrawFromFailedParams = FunctionArguments<typeof functions.withdrawFromFailed>
export type WithdrawFromFailedReturn = FunctionReturn<typeof functions.withdrawFromFailed>

export type WorkerPoolAddressParams = FunctionArguments<typeof functions.workerPoolAddress>
export type WorkerPoolAddressReturn = FunctionReturn<typeof functions.workerPoolAddress>

