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
exports.Contract = exports.functions = void 0;
const p = __importStar(require("@subsquid/evm-codec"));
const evm_abi_1 = require("@subsquid/evm-abi");
exports.functions = {
    cap: (0, evm_abi_1.viewFun)("0xff2ad8e4", "cap(uint256)", { "x": p.uint256 }, p.uint256),
    capedStake: (0, evm_abi_1.viewFun)("0xebe88e2e", "capedStake(uint256)", { "workerId": p.uint256 }, p.uint256),
    capedStakeAfterDelegation: (0, evm_abi_1.viewFun)("0x7385ddcb", "capedStakeAfterDelegation(uint256,int256)", { "workerId": p.uint256, "delegationAmount": p.int256 }, p.uint256),
    router: (0, evm_abi_1.viewFun)("0xf887ea40", "router()", {}, p.address),
};
class Contract extends evm_abi_1.ContractBase {
    cap(x) {
        return this.eth_call(exports.functions.cap, { x });
    }
    capedStake(workerId) {
        return this.eth_call(exports.functions.capedStake, { workerId });
    }
    capedStakeAfterDelegation(workerId, delegationAmount) {
        return this.eth_call(exports.functions.capedStakeAfterDelegation, { workerId, delegationAmount });
    }
    router() {
        return this.eth_call(exports.functions.router, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=SoftCap.js.map