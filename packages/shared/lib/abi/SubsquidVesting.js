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
    ERC20Released: (0, evm_abi_1.event)("0xc0e523490dd523c33b1878c9eb14ff46991e3f5b2cd33710918618f2a39cba1b", "ERC20Released(address,uint256)", { "token": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    EtherReleased: (0, evm_abi_1.event)("0xda9d4e5f101b8b9b1c5b76d0c5a9f7923571acfc02376aa076b75a8c080c956b", "EtherReleased(uint256)", { "amount": p.uint256 }),
    OwnershipTransferred: (0, evm_abi_1.event)("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", { "previousOwner": (0, evm_abi_1.indexed)(p.address), "newOwner": (0, evm_abi_1.indexed)(p.address) }),
};
exports.functions = {
    SQD: (0, evm_abi_1.viewFun)("0x6aa54679", "SQD()", {}, p.address),
    balanceOf: (0, evm_abi_1.viewFun)("0x70a08231", "balanceOf(address)", { "token": p.address }, p.uint256),
    depositedIntoProtocol: (0, evm_abi_1.viewFun)("0x23144c82", "depositedIntoProtocol()", {}, p.uint256),
    duration: (0, evm_abi_1.viewFun)("0x0fb5a6b4", "duration()", {}, p.uint256),
    end: (0, evm_abi_1.viewFun)("0xefbe1c1c", "end()", {}, p.uint256),
    'execute(address,bytes)': (0, evm_abi_1.fun)("0x1cff79cd", "execute(address,bytes)", { "to": p.address, "data": p.bytes }),
    'execute(address,bytes,uint256)': (0, evm_abi_1.fun)("0xa04a0908", "execute(address,bytes,uint256)", { "to": p.address, "data": p.bytes, "requiredApprove": p.uint256 }, p.bytes),
    expectedTotalAmount: (0, evm_abi_1.viewFun)("0xa7190da5", "expectedTotalAmount()", {}, p.uint256),
    immediateReleaseBIP: (0, evm_abi_1.viewFun)("0xd13d0f2c", "immediateReleaseBIP()", {}, p.uint256),
    owner: (0, evm_abi_1.viewFun)("0x8da5cb5b", "owner()", {}, p.address),
    'releasable(address)': (0, evm_abi_1.viewFun)("0xa3f8eace", "releasable(address)", { "token": p.address }, p.uint256),
    'releasable()': (0, evm_abi_1.viewFun)("0xfbccedae", "releasable()", {}, p.uint256),
    'release(address)': (0, evm_abi_1.fun)("0x19165587", "release(address)", { "token": p.address }),
    'release()': (0, evm_abi_1.fun)("0x86d1a69f", "release()", {}),
    'released()': (0, evm_abi_1.viewFun)("0x96132521", "released()", {}, p.uint256),
    'released(address)': (0, evm_abi_1.viewFun)("0x9852595c", "released(address)", { "token": p.address }, p.uint256),
    renounceOwnership: (0, evm_abi_1.fun)("0x715018a6", "renounceOwnership()", {}),
    router: (0, evm_abi_1.viewFun)("0xf887ea40", "router()", {}, p.address),
    start: (0, evm_abi_1.viewFun)("0xbe9a6555", "start()", {}, p.uint256),
    transferOwnership: (0, evm_abi_1.fun)("0xf2fde38b", "transferOwnership(address)", { "newOwner": p.address }),
    'vestedAmount(uint64)': (0, evm_abi_1.viewFun)("0x0a17b06b", "vestedAmount(uint64)", { "timestamp": p.uint64 }, p.uint256),
    'vestedAmount(address,uint64)': (0, evm_abi_1.viewFun)("0x810ec23b", "vestedAmount(address,uint64)", { "token": p.address, "timestamp": p.uint64 }, p.uint256),
};
class Contract extends evm_abi_1.ContractBase {
    SQD() {
        return this.eth_call(exports.functions.SQD, {});
    }
    balanceOf(token) {
        return this.eth_call(exports.functions.balanceOf, { token });
    }
    depositedIntoProtocol() {
        return this.eth_call(exports.functions.depositedIntoProtocol, {});
    }
    duration() {
        return this.eth_call(exports.functions.duration, {});
    }
    end() {
        return this.eth_call(exports.functions.end, {});
    }
    expectedTotalAmount() {
        return this.eth_call(exports.functions.expectedTotalAmount, {});
    }
    immediateReleaseBIP() {
        return this.eth_call(exports.functions.immediateReleaseBIP, {});
    }
    owner() {
        return this.eth_call(exports.functions.owner, {});
    }
    'releasable(address)'(token) {
        return this.eth_call(exports.functions['releasable(address)'], { token });
    }
    'releasable()'() {
        return this.eth_call(exports.functions['releasable()'], {});
    }
    'released()'() {
        return this.eth_call(exports.functions['released()'], {});
    }
    'released(address)'(token) {
        return this.eth_call(exports.functions['released(address)'], { token });
    }
    router() {
        return this.eth_call(exports.functions.router, {});
    }
    start() {
        return this.eth_call(exports.functions.start, {});
    }
    'vestedAmount(uint64)'(timestamp) {
        return this.eth_call(exports.functions['vestedAmount(uint64)'], { timestamp });
    }
    'vestedAmount(address,uint64)'(token, timestamp) {
        return this.eth_call(exports.functions['vestedAmount(address,uint64)'], { token, timestamp });
    }
}
exports.Contract = Contract;
//# sourceMappingURL=SubsquidVesting.js.map