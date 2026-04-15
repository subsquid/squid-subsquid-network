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
    Initialized: (0, evm_abi_1.event)("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", { "version": p.uint64 }),
    NetworkControllerSet: (0, evm_abi_1.event)("0xc933942500e5eabdee8f25e1ce6988211cb77b11019381d0ee10f11ca0a7b76a", "NetworkControllerSet(address)", { "networkController": p.address }),
    RewardCalculationSet: (0, evm_abi_1.event)("0xf0de48adac52cf0a3dedce9122eab2ba78c8418200301785a447bb8c96349c38", "RewardCalculationSet(address)", { "rewardCalculation": p.address }),
    RewardTreasurySet: (0, evm_abi_1.event)("0x52023115ad9f37137d6559cebbde4f5e58fad94c836e496d927ffc3ed958e9d9", "RewardTreasurySet(address)", { "rewardTreasury": p.address }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    StakingSet: (0, evm_abi_1.event)("0xf520447191196b125f76f7110397fdf32b1b9cefb7dec323bd3b998022ac2338", "StakingSet(address)", { "staking": p.address }),
    WorkerRegistrationSet: (0, evm_abi_1.event)("0xdab5f283cc831e81a29a9774fa3c356e72198f0d3ae83adb2ccd0c425a236877", "WorkerRegistrationSet(address)", { "workerRegistration": p.address }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    initialize: (0, evm_abi_1.fun)("0x1459457a", "initialize(address,address,address,address,address)", { "_workerRegistration": p.address, "_staking": p.address, "_rewardTreasury": p.address, "_networkController": p.address, "_rewardCalculation": p.address }),
    networkController: (0, evm_abi_1.viewFun)("0x853b97c2", "networkController()", {}, p.address),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    rewardCalculation: (0, evm_abi_1.viewFun)("0x8f0b335e", "rewardCalculation()", {}, p.address),
    rewardTreasury: (0, evm_abi_1.viewFun)("0xc7c934a1", "rewardTreasury()", {}, p.address),
    setNetworkController: (0, evm_abi_1.fun)("0xb7e11add", "setNetworkController(address)", { "_networkController": p.address }),
    setRewardCalculation: (0, evm_abi_1.fun)("0xb697fc5a", "setRewardCalculation(address)", { "_rewardCalculation": p.address }),
    setRewardTreasury: (0, evm_abi_1.fun)("0xa493415f", "setRewardTreasury(address)", { "_rewardTreasury": p.address }),
    setStaking: (0, evm_abi_1.fun)("0x8ff39099", "setStaking(address)", { "_staking": p.address }),
    setWorkerRegistration: (0, evm_abi_1.fun)("0x7fc49c94", "setWorkerRegistration(address)", { "_workerRegistration": p.address }),
    staking: (0, evm_abi_1.viewFun)("0x4cf088d9", "staking()", {}, p.address),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    workerRegistration: (0, evm_abi_1.viewFun)("0xd9ffb4fc", "workerRegistration()", {}, p.address),
};
class Contract extends evm_abi_1.ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    networkController() {
        return this.eth_call(exports.functions.networkController, {});
    }
    rewardCalculation() {
        return this.eth_call(exports.functions.rewardCalculation, {});
    }
    rewardTreasury() {
        return this.eth_call(exports.functions.rewardTreasury, {});
    }
    staking() {
        return this.eth_call(exports.functions.staking, {});
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
    workerRegistration() {
        return this.eth_call(exports.functions.workerRegistration, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=Router.js.map