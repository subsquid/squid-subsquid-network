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
    ExcessiveBondReturned: (0, evm_abi_1.event)("0x54ebfb2891f338e31ae38698df33da34d539ea1aa57fa0a1900a3b9d845d4f54", "ExcessiveBondReturned(uint256,uint256)", { "workerId": (0, evm_abi_1.indexed)(p.uint256), "amount": p.uint256 }),
    MetadataUpdated: (0, evm_abi_1.event)("0x459157ba24c7ab9878b165ef465fa6ae2ab42bcd8445f576be378768b0c47309", "MetadataUpdated(uint256,string)", { "workerId": (0, evm_abi_1.indexed)(p.uint256), "metadata": p.string }),
    Paused: (0, evm_abi_1.event)("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", { "account": p.address }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    Unpaused: (0, evm_abi_1.event)("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", { "account": p.address }),
    WorkerDeregistered: (0, evm_abi_1.event)("0x4a7ca6c9178181481ac5c6e9ed0965213ae489c4aaf53323bd5e1f318a9d77c3", "WorkerDeregistered(uint256,address,uint256)", { "workerId": (0, evm_abi_1.indexed)(p.uint256), "account": (0, evm_abi_1.indexed)(p.address), "deregistedAt": p.uint256 }),
    WorkerRegistered: (0, evm_abi_1.event)("0xa7a0c37f13c7accf7ec7771a2531c06e0183a37162a8e036039b241eab784156", "WorkerRegistered(uint256,bytes,address,uint256,string)", { "workerId": (0, evm_abi_1.indexed)(p.uint256), "peerId": p.bytes, "registrar": (0, evm_abi_1.indexed)(p.address), "registeredAt": p.uint256, "metadata": p.string }),
    WorkerWithdrawn: (0, evm_abi_1.event)("0xb6ee3a0ef8982f0f296a13a075fe56e5fd8c1bc2282a3c5b54f12d514ed7a956", "WorkerWithdrawn(uint256,address)", { "workerId": (0, evm_abi_1.indexed)(p.uint256), "account": (0, evm_abi_1.indexed)(p.address) }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    PAUSER_ROLE: (0, evm_abi_1.viewFun)("0xe63ab1e9", "PAUSER_ROLE()", {}, p.bytes32),
    SQD: (0, evm_abi_1.viewFun)("0x6aa54679", "SQD()", {}, p.address),
    bondAmount: (0, evm_abi_1.viewFun)("0x80f323a7", "bondAmount()", {}, p.uint256),
    deregister: (0, evm_abi_1.fun)("0xb4d0a564", "deregister(bytes)", { "peerId": p.bytes }),
    epochLength: (0, evm_abi_1.viewFun)("0x57d775f8", "epochLength()", {}, p.uint128),
    getActiveWorkerCount: (0, evm_abi_1.viewFun)("0x3e556827", "getActiveWorkerCount()", {}, p.uint256),
    getActiveWorkerIds: (0, evm_abi_1.viewFun)("0xc0a0d6cf", "getActiveWorkerIds()", {}, p.array(p.uint256)),
    getActiveWorkers: (0, evm_abi_1.viewFun)("0x393bc3d9", "getActiveWorkers()", {}, p.array(p.struct({ "creator": p.address, "peerId": p.bytes, "bond": p.uint256, "registeredAt": p.uint128, "deregisteredAt": p.uint128, "metadata": p.string }))),
    getAllWorkersCount: (0, evm_abi_1.viewFun)("0xf905aaf6", "getAllWorkersCount()", {}, p.uint256),
    getMetadata: (0, evm_abi_1.viewFun)("0x75734be8", "getMetadata(bytes)", { "peerId": p.bytes }, p.string),
    getOwnedWorkers: (0, evm_abi_1.viewFun)("0x75b80f11", "getOwnedWorkers(address)", { "owner": p.address }, p.array(p.uint256)),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    getWorker: (0, evm_abi_1.viewFun)("0xa39dbdb9", "getWorker(uint256)", { "workerId": p.uint256 }, p.struct({ "creator": p.address, "peerId": p.bytes, "bond": p.uint256, "registeredAt": p.uint128, "deregisteredAt": p.uint128, "metadata": p.string })),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    isWorkerActive: (0, evm_abi_1.viewFun)("0xb036482f", "isWorkerActive(uint256)", { "workerId": p.uint256 }, p.bool),
    lockPeriod: (0, evm_abi_1.viewFun)("0x3fd8b02f", "lockPeriod()", {}, p.uint128),
    nextEpoch: (0, evm_abi_1.viewFun)("0xaea0e78b", "nextEpoch()", {}, p.uint128),
    nextWorkerId: (0, evm_abi_1.viewFun)("0xc84a4922", "nextWorkerId()", {}, p.uint256),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    'register(bytes)': (0, evm_abi_1.fun)("0x82fbdc9c", "register(bytes)", { "peerId": p.bytes }),
    'register(bytes,string)': (0, evm_abi_1.fun)("0x92255fbf", "register(bytes,string)", { "peerId": p.bytes, "metadata": p.string }),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    returnExcessiveBond: (0, evm_abi_1.fun)("0xe4e33692", "returnExcessiveBond(bytes)", { "peerId": p.bytes }),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    router: (0, evm_abi_1.viewFun)("0xf887ea40", "router()", {}, p.address),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
    updateMetadata: (0, evm_abi_1.fun)("0xddc651c3", "updateMetadata(bytes,string)", { "peerId": p.bytes, "metadata": p.string }),
    withdraw: (0, evm_abi_1.fun)("0x0968f264", "withdraw(bytes)", { "peerId": p.bytes }),
    workerIds: (0, evm_abi_1.viewFun)("0x7a39cb2b", "workerIds(bytes)", { "peerId": p.bytes }, p.uint256),
    workers: (0, evm_abi_1.viewFun)("0xf1a22dc2", "workers(uint256)", { "_0": p.uint256 }, { "creator": p.address, "peerId": p.bytes, "bond": p.uint256, "registeredAt": p.uint128, "deregisteredAt": p.uint128, "metadata": p.string }),
};
class Contract extends evm_abi_1.ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    PAUSER_ROLE() {
        return this.eth_call(exports.functions.PAUSER_ROLE, {});
    }
    SQD() {
        return this.eth_call(exports.functions.SQD, {});
    }
    bondAmount() {
        return this.eth_call(exports.functions.bondAmount, {});
    }
    epochLength() {
        return this.eth_call(exports.functions.epochLength, {});
    }
    getActiveWorkerCount() {
        return this.eth_call(exports.functions.getActiveWorkerCount, {});
    }
    getActiveWorkerIds() {
        return this.eth_call(exports.functions.getActiveWorkerIds, {});
    }
    getActiveWorkers() {
        return this.eth_call(exports.functions.getActiveWorkers, {});
    }
    getAllWorkersCount() {
        return this.eth_call(exports.functions.getAllWorkersCount, {});
    }
    getMetadata(peerId) {
        return this.eth_call(exports.functions.getMetadata, { peerId });
    }
    getOwnedWorkers(owner) {
        return this.eth_call(exports.functions.getOwnedWorkers, { owner });
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    getWorker(workerId) {
        return this.eth_call(exports.functions.getWorker, { workerId });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    isWorkerActive(workerId) {
        return this.eth_call(exports.functions.isWorkerActive, { workerId });
    }
    lockPeriod() {
        return this.eth_call(exports.functions.lockPeriod, {});
    }
    nextEpoch() {
        return this.eth_call(exports.functions.nextEpoch, {});
    }
    nextWorkerId() {
        return this.eth_call(exports.functions.nextWorkerId, {});
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
    workerIds(peerId) {
        return this.eth_call(exports.functions.workerIds, { peerId });
    }
    workers(_0) {
        return this.eth_call(exports.functions.workers, { _0 });
    }
}
exports.Contract = Contract;
//# sourceMappingURL=WorkerRegistration.js.map