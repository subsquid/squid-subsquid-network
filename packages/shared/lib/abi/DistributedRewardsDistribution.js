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
    Approved: (0, evm_abi_1.event)("0x1718a64c060e83f86c815c1c1c305b016fd419f5d150962d0d6405761e74c5e4", "Approved(address,uint256,uint256,bytes32)", { "who": (0, evm_abi_1.indexed)(p.address), "fromBlock": p.uint256, "toBlock": p.uint256, "commitment": p.bytes32 }),
    ApprovesRequiredChanged: (0, evm_abi_1.event)("0x82128e565cfc8353e79f542d7a277dfa675daed9c90a8b5321cc0363ff8a7370", "ApprovesRequiredChanged(uint256)", { "newApprovesRequired": p.uint256 }),
    Claimed: (0, evm_abi_1.event)("0x987d620f307ff6b94d58743cb7a7509f24071586a77759b77c2d4e29f75a2f9a", "Claimed(address,uint256,uint256)", { "by": (0, evm_abi_1.indexed)(p.address), "worker": (0, evm_abi_1.indexed)(p.uint256), "amount": p.uint256 }),
    Distributed: (0, evm_abi_1.event)("0xa4a6b2187ef1354bf92bcc14dc28e999e5ecb37642caa1a28205659068a104fa", "Distributed(uint256,uint256,uint256[],uint256[],uint256[])", { "fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "stakerRewards": p.array(p.uint256) }),
    DistributorAdded: (0, evm_abi_1.event)("0xddbf200aa634dc3fb81cfd68583dd1040d1c751d335e1d86b631bde3e977fea8", "DistributorAdded(address)", { "distributor": (0, evm_abi_1.indexed)(p.address) }),
    DistributorRemoved: (0, evm_abi_1.event)("0x126174f6cf49c81cdb4a9214c6b8f037bef55b4ec31e4fc776cea2a1c8a88d59", "DistributorRemoved(address)", { "distributor": (0, evm_abi_1.indexed)(p.address) }),
    NewCommitment: (0, evm_abi_1.event)("0x3d0e20f31408b190e11fe8ac40c73e8aca970b3f47c98f626c110d9fe0199707", "NewCommitment(address,uint256,uint256,bytes32)", { "who": (0, evm_abi_1.indexed)(p.address), "fromBlock": p.uint256, "toBlock": p.uint256, "commitment": p.bytes32 }),
    Paused: (0, evm_abi_1.event)("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", { "account": p.address }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoundRobinBlocksChanged: (0, evm_abi_1.event)("0xe3af6ab99586802d1ac3592654adaba57091ee99ae93a64a092c813552591aab", "RoundRobinBlocksChanged(uint256)", { "newRoundRobinBlocks": p.uint256 }),
    Unpaused: (0, evm_abi_1.event)("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", { "account": p.address }),
    WindowSizeChanged: (0, evm_abi_1.event)("0xea307e5ee57372fa76a40fce652eb46a4f9fb1d64e42c3af1128a56729d30f65", "WindowSizeChanged(uint256)", { "newWindowSize": p.uint256 }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    PAUSER_ROLE: (0, evm_abi_1.viewFun)("0xe63ab1e9", "PAUSER_ROLE()", {}, p.bytes32),
    REWARDS_DISTRIBUTOR_ROLE: (0, evm_abi_1.viewFun)("0xc34c2289", "REWARDS_DISTRIBUTOR_ROLE()", {}, p.bytes32),
    REWARDS_TREASURY_ROLE: (0, evm_abi_1.viewFun)("0xb5b06781", "REWARDS_TREASURY_ROLE()", {}, p.bytes32),
    addDistributor: (0, evm_abi_1.fun)("0x7250e224", "addDistributor(address)", { "distributor": p.address }),
    alreadyApproved: (0, evm_abi_1.viewFun)("0x406e3090", "alreadyApproved(bytes32,address)", { "commitment": p.bytes32, "distributor": p.address }, p.bool),
    approve: (0, evm_abi_1.fun)("0x565b756a", "approve(uint256,uint256,uint256[],uint256[],uint256[])", { "fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "_stakerRewards": p.array(p.uint256) }),
    approves: (0, evm_abi_1.viewFun)("0x773b68c9", "approves(uint256,uint256)", { "fromBlock": p.uint256, "toBlock": p.uint256 }, p.uint8),
    canApprove: (0, evm_abi_1.viewFun)("0x42bef350", "canApprove(address,uint256,uint256,uint256[],uint256[],uint256[])", { "who": p.address, "fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "_stakerRewards": p.array(p.uint256) }, p.bool),
    canCommit: (0, evm_abi_1.viewFun)("0xb278e358", "canCommit(address)", { "who": p.address }, p.bool),
    claim: (0, evm_abi_1.fun)("0x1e83409a", "claim(address)", { "who": p.address }, p.uint256),
    claimable: (0, evm_abi_1.viewFun)("0x402914f5", "claimable(address)", { "who": p.address }, p.uint256),
    commit: (0, evm_abi_1.fun)("0x6957bc60", "commit(uint256,uint256,uint256[],uint256[],uint256[])", { "fromBlock": p.uint256, "toBlock": p.uint256, "recipients": p.array(p.uint256), "workerRewards": p.array(p.uint256), "_stakerRewards": p.array(p.uint256) }),
    commitments: (0, evm_abi_1.viewFun)("0xd13e2e60", "commitments(uint256,uint256)", { "fromBlock": p.uint256, "toBlock": p.uint256 }, p.bytes32),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    lastBlockRewarded: (0, evm_abi_1.viewFun)("0xeadf1f39", "lastBlockRewarded()", {}, p.uint256),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    removeDistributor: (0, evm_abi_1.fun)("0x57c1f9e2", "removeDistributor(address)", { "distributor": p.address }),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    requiredApproves: (0, evm_abi_1.viewFun)("0x75ddfa41", "requiredApproves()", {}, p.uint256),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    roundRobinBlocks: (0, evm_abi_1.viewFun)("0x75a32da6", "roundRobinBlocks()", {}, p.uint256),
    router: (0, evm_abi_1.viewFun)("0xf887ea40", "router()", {}, p.address),
    setApprovesRequired: (0, evm_abi_1.fun)("0x6a0bb81c", "setApprovesRequired(uint256)", { "_approvesRequired": p.uint256 }),
    setRoundRobinBlocks: (0, evm_abi_1.fun)("0x0d6cf7b0", "setRoundRobinBlocks(uint256)", { "_roundRobinBlocks": p.uint256 }),
    setWindowSize: (0, evm_abi_1.fun)("0xaaabc315", "setWindowSize(uint256)", { "_windowSize": p.uint256 }),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
    windowSize: (0, evm_abi_1.viewFun)("0x8a14117a", "windowSize()", {}, p.uint256),
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
    REWARDS_TREASURY_ROLE() {
        return this.eth_call(exports.functions.REWARDS_TREASURY_ROLE, {});
    }
    alreadyApproved(commitment, distributor) {
        return this.eth_call(exports.functions.alreadyApproved, { commitment, distributor });
    }
    approves(fromBlock, toBlock) {
        return this.eth_call(exports.functions.approves, { fromBlock, toBlock });
    }
    canApprove(who, fromBlock, toBlock, recipients, workerRewards, _stakerRewards) {
        return this.eth_call(exports.functions.canApprove, { who, fromBlock, toBlock, recipients, workerRewards, _stakerRewards });
    }
    canCommit(who) {
        return this.eth_call(exports.functions.canCommit, { who });
    }
    claimable(who) {
        return this.eth_call(exports.functions.claimable, { who });
    }
    commitments(fromBlock, toBlock) {
        return this.eth_call(exports.functions.commitments, { fromBlock, toBlock });
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    lastBlockRewarded() {
        return this.eth_call(exports.functions.lastBlockRewarded, {});
    }
    paused() {
        return this.eth_call(exports.functions.paused, {});
    }
    requiredApproves() {
        return this.eth_call(exports.functions.requiredApproves, {});
    }
    roundRobinBlocks() {
        return this.eth_call(exports.functions.roundRobinBlocks, {});
    }
    router() {
        return this.eth_call(exports.functions.router, {});
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
    windowSize() {
        return this.eth_call(exports.functions.windowSize, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=DistributedRewardsDistribution.js.map