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
    Claimed: (0, evm_abi_1.event)("0xf7a40077ff7a04c7e61f6f26fb13774259ddf1b6bce9ecf26a8276cdd3992683", "Claimed(address,address,uint256)", { "by": (0, evm_abi_1.indexed)(p.address), "receiver": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    Paused: (0, evm_abi_1.event)("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", { "account": p.address }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    Unpaused: (0, evm_abi_1.event)("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", { "account": p.address }),
    WhitelistedDistributorSet: (0, evm_abi_1.event)("0x79420e21e204bc31262bc1cf3cde02641e2f25da501557d80f399b32dad50c17", "WhitelistedDistributorSet(address,bool)", { "distributor": (0, evm_abi_1.indexed)(p.address), "isWhitelisted": p.bool }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    PAUSER_ROLE: (0, evm_abi_1.viewFun)("0xe63ab1e9", "PAUSER_ROLE()", {}, p.bytes32),
    claim: (0, evm_abi_1.fun)("0x1e83409a", "claim(address)", { "rewardDistribution": p.address }),
    claimFor: (0, evm_abi_1.fun)("0xb4ba9e11", "claimFor(address,address)", { "rewardDistribution": p.address, "receiver": p.address }),
    claimable: (0, evm_abi_1.viewFun)("0xd4570c1c", "claimable(address,address)", { "rewardDistribution": p.address, "sender": p.address }, p.uint256),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    isWhitelistedDistributor: (0, evm_abi_1.viewFun)("0xcbccc3e0", "isWhitelistedDistributor(address)", { "_0": p.address }, p.bool),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    reclaimFunds: (0, evm_abi_1.fun)("0xcce4bd52", "reclaimFunds()", {}),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    rewardToken: (0, evm_abi_1.viewFun)("0xf7c618c1", "rewardToken()", {}, p.address),
    setWhitelistedDistributor: (0, evm_abi_1.fun)("0xb53c69b6", "setWhitelistedDistributor(address,bool)", { "distributor": p.address, "isWhitelisted": p.bool }),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
};
class Contract extends evm_abi_1.ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    PAUSER_ROLE() {
        return this.eth_call(exports.functions.PAUSER_ROLE, {});
    }
    claimable(rewardDistribution, sender) {
        return this.eth_call(exports.functions.claimable, { rewardDistribution, sender });
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    isWhitelistedDistributor(_0) {
        return this.eth_call(exports.functions.isWhitelistedDistributor, { _0 });
    }
    paused() {
        return this.eth_call(exports.functions.paused, {});
    }
    rewardToken() {
        return this.eth_call(exports.functions.rewardToken, {});
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
}
exports.Contract = Contract;
//# sourceMappingURL=RewardTreasury.js.map