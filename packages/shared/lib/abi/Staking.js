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
    Claimed: (0, evm_abi_1.event)("0xa6836ed9f6b0bfa430c6b744cac7cc781c2a5b5be98f6e7ca42d32fd16bc6af3", "Claimed(address,uint256,uint256[])", { "staker": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256, "workerIds": p.array(p.uint256) }),
    Deposited: (0, evm_abi_1.event)("0x1599c0fcf897af5babc2bfcf707f5dc050f841b044d97c3251ecec35b9abf80b", "Deposited(uint256,address,uint256)", { "worker": (0, evm_abi_1.indexed)(p.uint256), "staker": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    Distributed: (0, evm_abi_1.event)("0xddc9c30275a04c48091f24199f9c405765de34d979d6847f5b9798a57232d2e5", "Distributed(uint256)", { "epoch": p.uint256 }),
    EpochsLockChanged: (0, evm_abi_1.event)("0x6d1a1e80fd96834b1293514ebab21ebac9637f9ad7ab1a533a05e4c6929bdd0a", "EpochsLockChanged(uint128)", { "epochsLock": p.uint128 }),
    MaxDelegationsChanged: (0, evm_abi_1.event)("0x8c59f6213d7200a03c81eac511632ea48656d94e2bc3b07730bab2e04f5f5286", "MaxDelegationsChanged(uint256)", { "maxDelegations": p.uint256 }),
    Paused: (0, evm_abi_1.event)("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", { "account": p.address }),
    Rewarded: (0, evm_abi_1.event)("0x6d46424d7308d93179bbc5c8c01e098e8353dad13aff9809fd8a881a69feaa3a", "Rewarded(uint256,address,uint256)", { "workerId": (0, evm_abi_1.indexed)(p.uint256), "staker": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    Unpaused: (0, evm_abi_1.event)("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", { "account": p.address }),
    Withdrawn: (0, evm_abi_1.event)("0xcf7d23a3cbe4e8b36ff82fd1b05b1b17373dc7804b4ebbd6e2356716ef202372", "Withdrawn(uint256,address,uint256)", { "worker": (0, evm_abi_1.indexed)(p.uint256), "staker": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    PAUSER_ROLE: (0, evm_abi_1.viewFun)("0xe63ab1e9", "PAUSER_ROLE()", {}, p.bytes32),
    REWARDS_DISTRIBUTOR_ROLE: (0, evm_abi_1.viewFun)("0xc34c2289", "REWARDS_DISTRIBUTOR_ROLE()", {}, p.bytes32),
    claim: (0, evm_abi_1.fun)("0x1e83409a", "claim(address)", { "staker": p.address }, p.uint256),
    claimable: (0, evm_abi_1.viewFun)("0x402914f5", "claimable(address)", { "staker": p.address }, p.uint256),
    delegated: (0, evm_abi_1.viewFun)("0x18e44a49", "delegated(uint256)", { "worker": p.uint256 }, p.uint256),
    delegates: (0, evm_abi_1.viewFun)("0x587cde1e", "delegates(address)", { "staker": p.address }, p.array(p.uint256)),
    deposit: (0, evm_abi_1.fun)("0xe2bbb158", "deposit(uint256,uint256)", { "worker": p.uint256, "amount": p.uint256 }),
    distribute: (0, evm_abi_1.fun)("0x8e1b57c5", "distribute(uint256[],uint256[])", { "workers": p.array(p.uint256), "amounts": p.array(p.uint256) }),
    epochsLockedAfterStake: (0, evm_abi_1.viewFun)("0x31603b62", "epochsLockedAfterStake()", {}, p.uint128),
    getDeposit: (0, evm_abi_1.viewFun)("0x2726b506", "getDeposit(address,uint256)", { "staker": p.address, "worker": p.uint256 }, { "depositAmount": p.uint256, "withdrawAllowed": p.uint256 }),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    lastEpochRewarded: (0, evm_abi_1.viewFun)("0xd760cdd8", "lastEpochRewarded()", {}, p.uint256),
    lockLengthBlocks: (0, evm_abi_1.viewFun)("0xc7ad6dd9", "lockLengthBlocks()", {}, p.uint128),
    maxDelegations: (0, evm_abi_1.viewFun)("0x5612a838", "maxDelegations()", {}, p.uint256),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    router: (0, evm_abi_1.viewFun)("0xf887ea40", "router()", {}, p.address),
    setEpochsLock: (0, evm_abi_1.fun)("0xe03f56e4", "setEpochsLock(uint128)", { "_epochsLock": p.uint128 }),
    setMaxDelegations: (0, evm_abi_1.fun)("0xe2ef0024", "setMaxDelegations(uint256)", { "_maxDelegations": p.uint256 }),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    token: (0, evm_abi_1.viewFun)("0xfc0c546a", "token()", {}, p.address),
    totalStakedPerWorker: (0, evm_abi_1.viewFun)("0x5f2c3ffe", "totalStakedPerWorker(uint256[])", { "workers": p.array(p.uint256) }, p.array(p.uint256)),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
    withdraw: (0, evm_abi_1.fun)("0x441a3e70", "withdraw(uint256,uint256)", { "worker": p.uint256, "amount": p.uint256 }),
};
class Contract extends evm_abi_1.ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    PAUSER_ROLE() {
        return this.eth_call(exports.functions.PAUSER_ROLE, {});
    }
    REWARDS_DISTRIBUTOR_ROLE() {
        return this.eth_call(exports.functions.REWARDS_DISTRIBUTOR_ROLE, {});
    }
    claimable(staker) {
        return this.eth_call(exports.functions.claimable, { staker });
    }
    delegated(worker) {
        return this.eth_call(exports.functions.delegated, { worker });
    }
    delegates(staker) {
        return this.eth_call(exports.functions.delegates, { staker });
    }
    epochsLockedAfterStake() {
        return this.eth_call(exports.functions.epochsLockedAfterStake, {});
    }
    getDeposit(staker, worker) {
        return this.eth_call(exports.functions.getDeposit, { staker, worker });
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    lastEpochRewarded() {
        return this.eth_call(exports.functions.lastEpochRewarded, {});
    }
    lockLengthBlocks() {
        return this.eth_call(exports.functions.lockLengthBlocks, {});
    }
    maxDelegations() {
        return this.eth_call(exports.functions.maxDelegations, {});
    }
    paused() {
        return this.eth_call(exports.functions.paused, {});
    }
    router() {
        return this.eth_call(exports.functions.router, {});
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
    token() {
        return this.eth_call(exports.functions.token, {});
    }
    totalStakedPerWorker(workers) {
        return this.eth_call(exports.functions.totalStakedPerWorker, { workers });
    }
}
exports.Contract = Contract;
//# sourceMappingURL=Staking.js.map