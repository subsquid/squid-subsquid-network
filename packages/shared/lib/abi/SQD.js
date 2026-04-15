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
    Approval: (0, evm_abi_1.event)("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", { "owner": (0, evm_abi_1.indexed)(p.address), "spender": (0, evm_abi_1.indexed)(p.address), "value": p.uint256 }),
    Transfer: (0, evm_abi_1.event)("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", { "from": (0, evm_abi_1.indexed)(p.address), "to": (0, evm_abi_1.indexed)(p.address), "value": p.uint256 }),
};
exports.functions = {
    allowance: (0, evm_abi_1.viewFun)("0xdd62ed3e", "allowance(address,address)", { "owner": p.address, "spender": p.address }, p.uint256),
    approve: (0, evm_abi_1.fun)("0x095ea7b3", "approve(address,uint256)", { "spender": p.address, "value": p.uint256 }, p.bool),
    balanceOf: (0, evm_abi_1.viewFun)("0x70a08231", "balanceOf(address)", { "account": p.address }, p.uint256),
    decimals: (0, evm_abi_1.viewFun)("0x313ce567", "decimals()", {}, p.uint8),
    isArbitrumEnabled: (0, evm_abi_1.viewFun)("0x8e5f5ad1", "isArbitrumEnabled()", {}, p.uint8),
    name: (0, evm_abi_1.viewFun)("0x06fdde03", "name()", {}, p.string),
    registerTokenOnL2: (0, evm_abi_1.fun)("0xfc792d8e", "registerTokenOnL2(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)", { "l2CustomTokenAddress": p.address, "maxSubmissionCostForCustomGateway": p.uint256, "maxSubmissionCostForRouter": p.uint256, "maxGasForCustomGateway": p.uint256, "maxGasForRouter": p.uint256, "gasPriceBid": p.uint256, "valueForGateway": p.uint256, "valueForRouter": p.uint256, "creditBackAddress": p.address }),
    symbol: (0, evm_abi_1.viewFun)("0x95d89b41", "symbol()", {}, p.string),
    totalSupply: (0, evm_abi_1.viewFun)("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: (0, evm_abi_1.fun)("0xa9059cbb", "transfer(address,uint256)", { "to": p.address, "value": p.uint256 }, p.bool),
    transferFrom: (0, evm_abi_1.fun)("0x23b872dd", "transferFrom(address,address,uint256)", { "from": p.address, "to": p.address, "value": p.uint256 }, p.bool),
};
class Contract extends evm_abi_1.ContractBase {
    allowance(owner, spender) {
        return this.eth_call(exports.functions.allowance, { owner, spender });
    }
    balanceOf(account) {
        return this.eth_call(exports.functions.balanceOf, { account });
    }
    decimals() {
        return this.eth_call(exports.functions.decimals, {});
    }
    isArbitrumEnabled() {
        return this.eth_call(exports.functions.isArbitrumEnabled, {});
    }
    name() {
        return this.eth_call(exports.functions.name, {});
    }
    symbol() {
        return this.eth_call(exports.functions.symbol, {});
    }
    totalSupply() {
        return this.eth_call(exports.functions.totalSupply, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=SQD.js.map