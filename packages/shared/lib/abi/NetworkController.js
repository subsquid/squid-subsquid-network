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
    AllowedVestedTargetUpdated: (0, evm_abi_1.event)("0x13077507c996c414a31510046627495d92322309f93e988a33cedb8108f2747f", "AllowedVestedTargetUpdated(address,bool)", { "target": p.address, "isAllowed": p.bool }),
    BondAmountUpdated: (0, evm_abi_1.event)("0xa15246e54ef77ae7edbf99b267138a83931b938b03e9f853067299eddb4099a7", "BondAmountUpdated(uint256)", { "bondAmount": p.uint256 }),
    EpochLengthUpdated: (0, evm_abi_1.event)("0xbddf13f72535a30b09d184d523d014c36ebb18c3fcbdefca337707cd3a14731d", "EpochLengthUpdated(uint128)", { "epochLength": p.uint128 }),
    LockPeriodUpdated: (0, evm_abi_1.event)("0x8249ec545e68f6f1e1230133ca48c704d831a7f8e635ded80f3dd9e99b09bb2f", "LockPeriodUpdated(uint256)", { "lockPeriod": p.uint256 }),
    RewardCoefficientUpdated: (0, evm_abi_1.event)("0xd5eee2f0795409a39ce32b09109addf49185c076a0a1f860b71eef53f6859a15", "RewardCoefficientUpdated(uint256)", { "coefficient": p.uint256 }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    StakingDeadlockUpdated: (0, evm_abi_1.event)("0x188ac85a2477b360c1360199e1cc6200bc87dc4e640848bb7fb10476d2850761", "StakingDeadlockUpdated(uint256)", { "stakingDeadlock": p.uint256 }),
    StoragePerWorkerInGbUpdated: (0, evm_abi_1.event)("0xf014b48e4917612e4346d196ad58d0a8a1c465b3cf12c32079bad77d0de205fa", "StoragePerWorkerInGbUpdated(uint128)", { "storagePerWorkerInGb": p.uint128 }),
    TargetCapacityUpdated: (0, evm_abi_1.event)("0x9b533265fa62d942c09baea98ca07a219597ec12534a0e0ed84e45f40bdb3b33", "TargetCapacityUpdated(uint256)", { "target": p.uint256 }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    bondAmount: (0, evm_abi_1.viewFun)("0x80f323a7", "bondAmount()", {}, p.uint256),
    epochLength: (0, evm_abi_1.viewFun)("0x57d775f8", "epochLength()", {}, p.uint128),
    epochNumber: (0, evm_abi_1.viewFun)("0xf4145a83", "epochNumber()", {}, p.uint128),
    firstEpochBlock: (0, evm_abi_1.viewFun)("0x578e2a85", "firstEpochBlock()", {}, p.uint128),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    isAllowedVestedTarget: (0, evm_abi_1.viewFun)("0x9425d1f4", "isAllowedVestedTarget(address)", { "_0": p.address }, p.bool),
    lockPeriod: (0, evm_abi_1.viewFun)("0x3fd8b02f", "lockPeriod()", {}, p.uint128),
    nextEpoch: (0, evm_abi_1.viewFun)("0xaea0e78b", "nextEpoch()", {}, p.uint128),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    setAllowedVestedTarget: (0, evm_abi_1.fun)("0x02ac6b6c", "setAllowedVestedTarget(address,bool)", { "target": p.address, "isAllowed": p.bool }),
    setBondAmount: (0, evm_abi_1.fun)("0x28f9f3e6", "setBondAmount(uint256)", { "_bondAmount": p.uint256 }),
    setEpochLength: (0, evm_abi_1.fun)("0x0d8d840b", "setEpochLength(uint128)", { "_epochLength": p.uint128 }),
    setLockPeriod: (0, evm_abi_1.fun)("0x81f433f0", "setLockPeriod(uint128)", { "_lockPeriod": p.uint128 }),
    setStakingDeadlock: (0, evm_abi_1.fun)("0x6214e299", "setStakingDeadlock(uint256)", { "_newDeadlock": p.uint256 }),
    setStoragePerWorkerInGb: (0, evm_abi_1.fun)("0x7e9d6b0a", "setStoragePerWorkerInGb(uint128)", { "_storagePerWorkerInGb": p.uint128 }),
    setTargetCapacity: (0, evm_abi_1.fun)("0xe10e9d60", "setTargetCapacity(uint256)", { "target": p.uint256 }),
    setYearlyRewardCapCoefficient: (0, evm_abi_1.fun)("0xbdf97dc9", "setYearlyRewardCapCoefficient(uint256)", { "coefficient": p.uint256 }),
    stakingDeadlock: (0, evm_abi_1.viewFun)("0x5b446c44", "stakingDeadlock()", {}, p.uint256),
    storagePerWorkerInGb: (0, evm_abi_1.viewFun)("0x2b5d1529", "storagePerWorkerInGb()", {}, p.uint128),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    targetCapacityGb: (0, evm_abi_1.viewFun)("0x17395c74", "targetCapacityGb()", {}, p.uint256),
    workerEpochLength: (0, evm_abi_1.viewFun)("0xeda0e1da", "workerEpochLength()", {}, p.uint128),
    yearlyRewardCapCoefficient: (0, evm_abi_1.viewFun)("0x1cb34cb6", "yearlyRewardCapCoefficient()", {}, p.uint256),
};
class Contract extends evm_abi_1.ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    bondAmount() {
        return this.eth_call(exports.functions.bondAmount, {});
    }
    epochLength() {
        return this.eth_call(exports.functions.epochLength, {});
    }
    epochNumber() {
        return this.eth_call(exports.functions.epochNumber, {});
    }
    firstEpochBlock() {
        return this.eth_call(exports.functions.firstEpochBlock, {});
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    isAllowedVestedTarget(_0) {
        return this.eth_call(exports.functions.isAllowedVestedTarget, { _0 });
    }
    lockPeriod() {
        return this.eth_call(exports.functions.lockPeriod, {});
    }
    nextEpoch() {
        return this.eth_call(exports.functions.nextEpoch, {});
    }
    stakingDeadlock() {
        return this.eth_call(exports.functions.stakingDeadlock, {});
    }
    storagePerWorkerInGb() {
        return this.eth_call(exports.functions.storagePerWorkerInGb, {});
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
    targetCapacityGb() {
        return this.eth_call(exports.functions.targetCapacityGb, {});
    }
    workerEpochLength() {
        return this.eth_call(exports.functions.workerEpochLength, {});
    }
    yearlyRewardCapCoefficient() {
        return this.eth_call(exports.functions.yearlyRewardCapCoefficient, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=NetworkController.js.map