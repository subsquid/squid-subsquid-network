"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.functions = exports.events = void 0;
const p = __importStar(require("@subsquid/evm-codec"));
const evm_abi_1 = require("@subsquid/evm-abi");
exports.events = {
    CapacityUpdated: (0, evm_abi_1.event)("0xbe7f9e13de886daecad6ce97a1f9723e1f5a143d2e447587e282275a819c27ad", "CapacityUpdated(uint256,uint256)", { "oldCapacity": p.uint256, "newCapacity": p.uint256 }),
    Deposited: (0, evm_abi_1.event)("0x73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca", "Deposited(address,uint256,uint256)", { "provider": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256, "newTotal": p.uint256 }),
    DistributionRateChanged: (0, evm_abi_1.event)("0x5dccc0d5e9abea326bbce0419fde03cddafe49f67941e6c5703303375db73272", "DistributionRateChanged(uint256,uint256)", { "oldRate": p.uint256, "newRate": p.uint256 }),
    ExitClaimed: (0, evm_abi_1.event)("0x2125c86840af875089592426ea5b7f6a45ef059fb5ceb8fc63bd10faadfd4aa3", "ExitClaimed(address,uint256)", { "provider": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    ExitRequested: (0, evm_abi_1.event)("0x4cf94291edeab4daefe36ffc570177414768fd63b0ee9d075d82098fe4f44db1", "ExitRequested(address,uint256,uint256)", { "provider": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256, "endPosition": p.uint256 }),
    Initialized: (0, evm_abi_1.event)("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", { "version": p.uint64 }),
    Paused: (0, evm_abi_1.event)("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", { "account": p.address }),
    PoolClosed: (0, evm_abi_1.event)("0x54d833a6369fbb6af4373700bdaf73d7a1ad1be05825bc9475be295d43a5d7bb", "PoolClosed(address,uint256)", { "closedBy": (0, evm_abi_1.indexed)(p.address), "timestamp": p.uint256 }),
    RewardsClaimed: (0, evm_abi_1.event)("0xfc30cddea38e2bf4d6ea7d3f9ed3b6ad7f176419f4963bd81318067a4aee73fe", "RewardsClaimed(address,uint256)", { "provider": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    RewardsRecovered: (0, evm_abi_1.event)("0x19f0b1340f66a05f5449dc6a7ce27ffd75cdf3e8ea8be6bd4818f481a5e53097", "RewardsRecovered(address,uint256)", { "operator": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    RewardsToppedUp: (0, evm_abi_1.event)("0x3beb96d35cbecf0959835cae915575d4bb9e105f530152e5f489e7227e9d124a", "RewardsToppedUp(address,uint256,uint256,uint256,uint256)", { "operator": (0, evm_abi_1.indexed)(p.address), "received": p.uint256, "toProviders": p.uint256, "toWorkerPool": p.uint256, "toBurn": p.uint256 }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    StakeTransferred: (0, evm_abi_1.event)("0x1e07278daf12d879e91ea076cf43032a70d56cb1d6e8bc91534dcd17f61e18f3", "StakeTransferred(address,address,uint256)", { "from": (0, evm_abi_1.indexed)(p.address), "to": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    StateChanged: (0, evm_abi_1.event)("0xe8a97ea87e4388fa22d496b95a8ed5ced6717f49790318de2b928aaf37a021d8", "StateChanged(uint8,uint8)", { "oldState": p.uint8, "newState": p.uint8 }),
    Unpaused: (0, evm_abi_1.event)("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", { "account": p.address }),
    WhitelistEnabledChanged: (0, evm_abi_1.event)("0x398a48620e25b3559c326c0c3768b091c74ada82c20d1c8dbfe11ae96cd1d47e", "WhitelistEnabledChanged(bool)", { "enabled": p.bool }),
    WhitelistUpdated: (0, evm_abi_1.event)("0xf93f9a76c1bf3444d22400a00cb9fe990e6abe9dbb333fda48859cfee864543d", "WhitelistUpdated(address,bool)", { "user": (0, evm_abi_1.indexed)(p.address), "added": p.bool }),
    Withdrawn: (0, evm_abi_1.event)("0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5", "Withdrawn(address,uint256)", { "provider": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
};
exports.functions = {
    ACC: (0, evm_abi_1.viewFun)("0x0ed52473", "ACC()", {}, p.uint256),
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    FACTORY_ROLE: (0, evm_abi_1.viewFun)("0x04a0fb17", "FACTORY_ROLE()", {}, p.bytes32),
    OPERATOR_ROLE: (0, evm_abi_1.viewFun)("0xf5b541a6", "OPERATOR_ROLE()", {}, p.bytes32),
    PRECISION: (0, evm_abi_1.viewFun)("0xaaf5eb68", "PRECISION()", {}, p.uint256),
    RATE_PRECISION: (0, evm_abi_1.viewFun)("0x2b3ba681", "RATE_PRECISION()", {}, p.uint256),
    addToWhitelist: (0, evm_abi_1.fun)("0x7f649783", "addToWhitelist(address[])", { "users": p.array(p.address) }),
    balanceTs: (0, evm_abi_1.viewFun)("0xf04e6353", "balanceTs()", {}, p.uint64),
    burnAddress: (0, evm_abi_1.viewFun)("0x70d5ae05", "burnAddress()", {}, p.address),
    checkAndFailPortal: (0, evm_abi_1.fun)("0xe73aa4b8", "checkAndFailPortal()", {}),
    claimRewards: (0, evm_abi_1.fun)("0x372500ab", "claimRewards()", {}, p.uint256),
    claimRewardsFromClosed: (0, evm_abi_1.fun)("0x8d2bb3cf", "claimRewardsFromClosed()", {}, p.uint256),
    closePool: (0, evm_abi_1.fun)("0x66805de5", "closePool()", {}),
    credit: (0, evm_abi_1.viewFun)("0xa06d083c", "credit()", {}, p.uint256),
    currentBalance: (0, evm_abi_1.viewFun)("0x5ccdd971", "currentBalance(uint256)", { "timestamp": p.uint256 }, p.int256),
    debt: (0, evm_abi_1.viewFun)("0x0dca59c1", "debt()", {}, p.uint256),
    deposit: (0, evm_abi_1.fun)("0xb6b55f25", "deposit(uint256)", { "amount": p.uint256 }),
    emergencyWithdraw: (0, evm_abi_1.fun)("0xdb2e21bc", "emergencyWithdraw()", {}),
    getActiveStake: (0, evm_abi_1.viewFun)("0x17387b58", "getActiveStake()", {}, p.uint256),
    getClaimableRewards: (0, evm_abi_1.viewFun)("0x308e401e", "getClaimableRewards(address)", { "provider": p.address }, p.uint256),
    getComputationUnits: (0, evm_abi_1.viewFun)("0x4a4880aa", "getComputationUnits()", {}, p.uint256),
    getCredit: (0, evm_abi_1.viewFun)("0x59296e7b", "getCredit()", {}, p.uint256),
    getCurrentRewardBalance: (0, evm_abi_1.viewFun)("0x38668b42", "getCurrentRewardBalance()", {}, p.int256),
    getDebt: (0, evm_abi_1.viewFun)("0x14a6bf0f", "getDebt()", {}, p.uint256),
    getExitTicket: (0, evm_abi_1.viewFun)("0x6ea6fc02", "getExitTicket(address,uint256)", { "provider": p.address, "ticketId": p.uint256 }, p.struct({ "endPosition": p.uint256, "amount": p.uint256, "withdrawn": p.bool })),
    getMetadata: (0, evm_abi_1.viewFun)("0x7a5b4f59", "getMetadata()", {}, p.string),
    getMinCapacity: (0, evm_abi_1.viewFun)("0x251a8872", "getMinCapacity()", {}, p.uint256),
    getPoolInfo: (0, evm_abi_1.viewFun)("0x60246c88", "getPoolInfo()", {}, p.struct({ "operator": p.address, "capacity": p.uint256, "totalStaked": p.uint256, "depositDeadline": p.uint64, "activationTime": p.uint64, "state": p.uint8, "paused": p.bool, "firstActivated": p.bool })),
    getPoolStatusWithRewards: (0, evm_abi_1.viewFun)("0x1d7903da", "getPoolStatusWithRewards(address)", { "provider": p.address }, { "poolCredit": p.uint256, "poolDebt": p.uint256, "poolBalance": p.int256, "runway": p.int256, "outOfMoney": p.bool, "providerRewards": p.uint256, "providerStake": p.uint256 }),
    getProviderStake: (0, evm_abi_1.viewFun)("0xbfebc370", "getProviderStake(address)", { "provider": p.address }, p.uint256),
    getQueueStatus: (0, evm_abi_1.viewFun)("0x48ac0a4d", "getQueueStatus(address,uint256)", { "provider": p.address, "ticketId": p.uint256 }, { "processed": p.uint256, "providerEndPos": p.uint256, "secondsRemaining": p.uint256, "ready": p.bool }),
    getQueueStatusWithTimestamp: (0, evm_abi_1.viewFun)("0x07d01078", "getQueueStatusWithTimestamp(address,uint256)", { "provider": p.address, "ticketId": p.uint256 }, { "processed": p.uint256, "providerEndPos": p.uint256, "secondsRemaining": p.uint256, "ready": p.bool, "unlockTimestamp": p.uint256 }),
    getRewardStatus: (0, evm_abi_1.viewFun)("0x2f8dc1ce", "getRewardStatus()", {}, { "balance": p.int256, "currentDebt": p.uint256, "runwayTimestamp": p.int256, "isDry": p.bool }),
    getRewardToken: (0, evm_abi_1.viewFun)("0x69940d79", "getRewardToken()", {}, p.address),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    getRunway: (0, evm_abi_1.viewFun)("0x5b6f9455", "getRunway()", {}, p.int256),
    getState: (0, evm_abi_1.viewFun)("0x1865c57d", "getState()", {}, p.uint8),
    getTicketCount: (0, evm_abi_1.viewFun)("0xcff82e22", "getTicketCount(address)", { "provider": p.address }, p.uint256),
    getTotalDrainRate: (0, evm_abi_1.viewFun)("0x6e0e7fb1", "getTotalDrainRate()", {}, p.uint256),
    getTotalProcessed: (0, evm_abi_1.viewFun)("0x4022a85c", "getTotalProcessed()", {}, p.uint256),
    getWithdrawalWaitingTimestamp: (0, evm_abi_1.viewFun)("0x64a2d939", "getWithdrawalWaitingTimestamp(uint256)", { "amount": p.uint256 }, p.uint256),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    initialize: (0, evm_abi_1.fun)("0x486fe319", "initialize((address,uint256,uint256,string,address,address,address,address,uint256,uint256,string))", { "params": p.struct({ "operator": p.address, "capacity": p.uint256, "depositDeadline": p.uint256, "tokenSuffix": p.string, "sqd": p.address, "rewardToken": p.address, "portalRegistry": p.address, "feeRouter": p.address, "minStakeThreshold": p.uint256, "distributionRatePerSecond": p.uint256, "metadata": p.string }) }),
    initializeCredit: (0, evm_abi_1.fun)("0x836785c8", "initializeCredit(uint256)", { "amount": p.uint256 }),
    isOutOfMoney: (0, evm_abi_1.viewFun)("0x99d3fa44", "isOutOfMoney()", {}, p.bool),
    isWhitelisted: (0, evm_abi_1.viewFun)("0x3af32abf", "isWhitelisted(address)", { "user": p.address }, p.bool),
    lastEffectiveRewardTs: (0, evm_abi_1.viewFun)("0x85dc11eb", "lastEffectiveRewardTs()", {}, p.uint64),
    lptToken: (0, evm_abi_1.viewFun)("0xedf62cf1", "lptToken()", {}, p.address),
    multicall: (0, evm_abi_1.fun)("0xac9650d8", "multicall(bytes[])", { "data": p.array(p.bytes) }, p.array(p.bytes)),
    onLPTTransfer: (0, evm_abi_1.fun)("0xaf49752b", "onLPTTransfer(address,address,uint256)", { "from": p.address, "to": p.address, "amount": p.uint256 }),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    perStakeRateWad: (0, evm_abi_1.viewFun)("0xb5cb3ce8", "perStakeRateWad()", {}, p.uint256),
    providerRatePerSec: (0, evm_abi_1.viewFun)("0x1244212f", "providerRatePerSec()", {}, p.uint256),
    recoverRewardsFromFailed: (0, evm_abi_1.fun)("0x3993a222", "recoverRewardsFromFailed()", {}, p.uint256),
    removeFromWhitelist: (0, evm_abi_1.fun)("0x548db174", "removeFromWhitelist(address[])", { "users": p.array(p.address) }),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    requestExit: (0, evm_abi_1.fun)("0x721c6513", "requestExit(uint256)", { "amount": p.uint256 }, p.uint256),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    rewardPerStakeStored: (0, evm_abi_1.viewFun)("0xa60681f3", "rewardPerStakeStored()", {}, p.uint256),
    setCapacity: (0, evm_abi_1.fun)("0x91915ef8", "setCapacity(uint256)", { "newCapacity": p.uint256 }),
    setDistributionRate: (0, evm_abi_1.fun)("0x19983251", "setDistributionRate(uint256)", { "newRatePerSecond": p.uint256 }),
    setWhitelistEnabled: (0, evm_abi_1.fun)("0x052d9e7e", "setWhitelistEnabled(bool)", { "enabled": p.bool }),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    topUpRewards: (0, evm_abi_1.fun)("0xbc58d795", "topUpRewards(uint256)", { "amount": p.uint256 }),
    totalDistributionRatePerSec: (0, evm_abi_1.viewFun)("0xde35aace", "totalDistributionRatePerSec()", {}, p.uint256),
    treasuryAccumulated: (0, evm_abi_1.viewFun)("0x01aa6655", "treasuryAccumulated()", {}, p.uint256),
    treasuryRatePerSec: (0, evm_abi_1.viewFun)("0x417c3fc6", "treasuryRatePerSec()", {}, p.uint256),
    tryMulticall: (0, evm_abi_1.fun)("0x437b9116", "tryMulticall(bytes[])", { "data": p.array(p.bytes) }, { "successes": p.array(p.bool), "results": p.array(p.bytes) }),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
    whitelist: (0, evm_abi_1.viewFun)("0x9b19251a", "whitelist(address)", { "_0": p.address }, p.bool),
    whitelistEnabled: (0, evm_abi_1.viewFun)("0x51fb012d", "whitelistEnabled()", {}, p.bool),
    withdrawExit: (0, evm_abi_1.fun)("0xdefbac59", "withdrawExit(uint256)", { "ticketId": p.uint256 }),
    withdrawFromFailed: (0, evm_abi_1.fun)("0x743537d6", "withdrawFromFailed()", {}),
    workerPoolAddress: (0, evm_abi_1.viewFun)("0xcbe912df", "workerPoolAddress()", {}, p.address),
};
class Contract extends evm_abi_1.ContractBase {
    ACC() {
        return this.eth_call(exports.functions.ACC, {});
    }
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    FACTORY_ROLE() {
        return this.eth_call(exports.functions.FACTORY_ROLE, {});
    }
    OPERATOR_ROLE() {
        return this.eth_call(exports.functions.OPERATOR_ROLE, {});
    }
    PRECISION() {
        return this.eth_call(exports.functions.PRECISION, {});
    }
    RATE_PRECISION() {
        return this.eth_call(exports.functions.RATE_PRECISION, {});
    }
    balanceTs() {
        return this.eth_call(exports.functions.balanceTs, {});
    }
    burnAddress() {
        return this.eth_call(exports.functions.burnAddress, {});
    }
    credit() {
        return this.eth_call(exports.functions.credit, {});
    }
    currentBalance(timestamp) {
        return this.eth_call(exports.functions.currentBalance, { timestamp });
    }
    debt() {
        return this.eth_call(exports.functions.debt, {});
    }
    getActiveStake() {
        return this.eth_call(exports.functions.getActiveStake, {});
    }
    getClaimableRewards(provider) {
        return this.eth_call(exports.functions.getClaimableRewards, { provider });
    }
    getComputationUnits() {
        return this.eth_call(exports.functions.getComputationUnits, {});
    }
    getCredit() {
        return this.eth_call(exports.functions.getCredit, {});
    }
    getCurrentRewardBalance() {
        return this.eth_call(exports.functions.getCurrentRewardBalance, {});
    }
    getDebt() {
        return this.eth_call(exports.functions.getDebt, {});
    }
    getExitTicket(provider, ticketId) {
        return this.eth_call(exports.functions.getExitTicket, { provider, ticketId });
    }
    getMetadata() {
        return this.eth_call(exports.functions.getMetadata, {});
    }
    getMinCapacity() {
        return this.eth_call(exports.functions.getMinCapacity, {});
    }
    getPoolInfo() {
        return this.eth_call(exports.functions.getPoolInfo, {});
    }
    getPoolStatusWithRewards(provider) {
        return this.eth_call(exports.functions.getPoolStatusWithRewards, { provider });
    }
    getProviderStake(provider) {
        return this.eth_call(exports.functions.getProviderStake, { provider });
    }
    getQueueStatus(provider, ticketId) {
        return this.eth_call(exports.functions.getQueueStatus, { provider, ticketId });
    }
    getQueueStatusWithTimestamp(provider, ticketId) {
        return this.eth_call(exports.functions.getQueueStatusWithTimestamp, { provider, ticketId });
    }
    getRewardStatus() {
        return this.eth_call(exports.functions.getRewardStatus, {});
    }
    getRewardToken() {
        return this.eth_call(exports.functions.getRewardToken, {});
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    getRunway() {
        return this.eth_call(exports.functions.getRunway, {});
    }
    getState() {
        return this.eth_call(exports.functions.getState, {});
    }
    getTicketCount(provider) {
        return this.eth_call(exports.functions.getTicketCount, { provider });
    }
    getTotalDrainRate() {
        return this.eth_call(exports.functions.getTotalDrainRate, {});
    }
    getTotalProcessed() {
        return this.eth_call(exports.functions.getTotalProcessed, {});
    }
    getWithdrawalWaitingTimestamp(amount) {
        return this.eth_call(exports.functions.getWithdrawalWaitingTimestamp, { amount });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    isOutOfMoney() {
        return this.eth_call(exports.functions.isOutOfMoney, {});
    }
    isWhitelisted(user) {
        return this.eth_call(exports.functions.isWhitelisted, { user });
    }
    lastEffectiveRewardTs() {
        return this.eth_call(exports.functions.lastEffectiveRewardTs, {});
    }
    lptToken() {
        return this.eth_call(exports.functions.lptToken, {});
    }
    paused() {
        return this.eth_call(exports.functions.paused, {});
    }
    perStakeRateWad() {
        return this.eth_call(exports.functions.perStakeRateWad, {});
    }
    providerRatePerSec() {
        return this.eth_call(exports.functions.providerRatePerSec, {});
    }
    rewardPerStakeStored() {
        return this.eth_call(exports.functions.rewardPerStakeStored, {});
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
    totalDistributionRatePerSec() {
        return this.eth_call(exports.functions.totalDistributionRatePerSec, {});
    }
    treasuryAccumulated() {
        return this.eth_call(exports.functions.treasuryAccumulated, {});
    }
    treasuryRatePerSec() {
        return this.eth_call(exports.functions.treasuryRatePerSec, {});
    }
    whitelist(_0) {
        return this.eth_call(exports.functions.whitelist, { _0 });
    }
    whitelistEnabled() {
        return this.eth_call(exports.functions.whitelistEnabled, {});
    }
    workerPoolAddress() {
        return this.eth_call(exports.functions.workerPoolAddress, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=PortalPoolImplementation.js.map