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
    AllocatedCUs: (0, evm_abi_1.event)("0xa27699da150f8443c51cda13c28a1cbfb78ee3b4055de58197e770999fc23fbd", "AllocatedCUs(address,bytes,uint256[],uint256[])", { "gateway": (0, evm_abi_1.indexed)(p.address), "peerId": p.bytes, "workerIds": p.array(p.uint256), "shares": p.array(p.uint256) }),
    AutoextensionDisabled: (0, evm_abi_1.event)("0x17679fc77cdf7f6b7d2af4cb30497f3e81088fde6fdb20ca48d31372bc2af006", "AutoextensionDisabled(address,uint128)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "lockEnd": p.uint128 }),
    AutoextensionEnabled: (0, evm_abi_1.event)("0xeff5f78e20f1cd92a537c3cdbaeaea11ad293aace5d7262ed93f2f33b42a828f", "AutoextensionEnabled(address)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address) }),
    AverageBlockTimeChanged: (0, evm_abi_1.event)("0x46a9c997a4d81c1f992b7ec20e34dfc97c0c67a86dc24f9ff1525718690bead3", "AverageBlockTimeChanged(uint256)", { "newBlockTime": p.uint256 }),
    DefaultStrategyChanged: (0, evm_abi_1.event)("0x84e184ce3e506721b995db9e77ad7527e97c83dd04bf98f5830508602bf837ad", "DefaultStrategyChanged(address)", { "strategy": (0, evm_abi_1.indexed)(p.address) }),
    GatewayAddressChanged: (0, evm_abi_1.event)("0x39cabfa8731da74e931aee9746250190051269d4d0c37ec9fb8276a32b1f6601", "GatewayAddressChanged(address,bytes,address)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "peerId": p.bytes, "newAddress": p.address }),
    Initialized: (0, evm_abi_1.event)("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", { "version": p.uint64 }),
    ManaChanged: (0, evm_abi_1.event)("0xd48c454cdec818a86733db9fd6353a7b80d423e6a189ecac47703f9b5fa0801b", "ManaChanged(uint256)", { "newCuPerSQD": p.uint256 }),
    MaxGatewaysPerClusterChanged: (0, evm_abi_1.event)("0xf092d674fd06aab53c483be96eb202422ad493b452660e05adfe7f02aca08c1f", "MaxGatewaysPerClusterChanged(uint256)", { "newAmount": p.uint256 }),
    MetadataChanged: (0, evm_abi_1.event)("0x512a85d60acb1212e9e49cec8fc20daed3ed43977be6a8db77faf2c859e79e7f", "MetadataChanged(address,bytes,string)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "peerId": p.bytes, "metadata": p.string }),
    MinStakeChanged: (0, evm_abi_1.event)("0x4d36185d86b6e1aefe7e3c72bbcf2329ea433a9dc2655a34739abe83a7ce74a0", "MinStakeChanged(uint256)", { "newAmount": p.uint256 }),
    Paused: (0, evm_abi_1.event)("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", { "account": p.address }),
    Registered: (0, evm_abi_1.event)("0xb9c7babb56df9f2da4a30811a6c778e4e68af88b72712d56cf62c5516e20e199", "Registered(address,bytes32,bytes)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "id": (0, evm_abi_1.indexed)(p.bytes32), "peerId": p.bytes }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    Staked: (0, evm_abi_1.event)("0x85362f63fb0e3050a216decb3a7297e2aaff6cbf5b22583c073118d7efc8a47b", "Staked(address,uint256,uint128,uint128,uint256)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256, "lockStart": p.uint128, "lockEnd": p.uint128, "computationUnits": p.uint256 }),
    StrategyAllowed: (0, evm_abi_1.event)("0x4e8e4980b101f6a8ebe870c7cf3767fb92422ef0c95a65b5cd750f9fce3c26e0", "StrategyAllowed(address,bool)", { "strategy": (0, evm_abi_1.indexed)(p.address), "isAllowed": p.bool }),
    Unpaused: (0, evm_abi_1.event)("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", { "account": p.address }),
    Unregistered: (0, evm_abi_1.event)("0xa133cd95a0c9cb4f8272f86cd3bb48ba2bf54f982e60bba1618e1286925eddec", "Unregistered(address,bytes)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "peerId": p.bytes }),
    Unstaked: (0, evm_abi_1.event)("0x0f5bb82176feb1b5e747e28471aa92156a04d9f3ab9f45f28e2d704232b93f75", "Unstaked(address,uint256)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    UsedStrategyChanged: (0, evm_abi_1.event)("0xe31c0bedb29ec4df4a7c3d8d8c0e4ad6bf3648906837d5400d61a94410c5e5bb", "UsedStrategyChanged(address,address)", { "gatewayOperator": (0, evm_abi_1.indexed)(p.address), "strategy": p.address }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    PAUSER_ROLE: (0, evm_abi_1.viewFun)("0xe63ab1e9", "PAUSER_ROLE()", {}, p.bytes32),
    addStake: (0, evm_abi_1.fun)("0xeb4f16b5", "addStake(uint256)", { "amount": p.uint256 }),
    allocateComputationUnits: (0, evm_abi_1.fun)("0xb785a2e6", "allocateComputationUnits(uint256[],uint256[])", { "workerIds": p.array(p.uint256), "cus": p.array(p.uint256) }),
    averageBlockTime: (0, evm_abi_1.viewFun)("0x233dedf1", "averageBlockTime()", {}, p.uint256),
    canUnstake: (0, evm_abi_1.viewFun)("0x85f4498b", "canUnstake(address)", { "operator": p.address }, p.bool),
    computationUnitsAmount: (0, evm_abi_1.viewFun)("0x1c0fa1c8", "computationUnitsAmount(uint256,uint256)", { "amount": p.uint256, "durationBlocks": p.uint256 }, p.uint256),
    computationUnitsAvailable: (0, evm_abi_1.viewFun)("0x44d4bea8", "computationUnitsAvailable(bytes)", { "peerId": p.bytes }, p.uint256),
    defaultStrategy: (0, evm_abi_1.viewFun)("0xfac5bb9b", "defaultStrategy()", {}, p.address),
    disableAutoExtension: (0, evm_abi_1.fun)("0xe6c7f21b", "disableAutoExtension()", {}),
    enableAutoExtension: (0, evm_abi_1.fun)("0x13f117f2", "enableAutoExtension()", {}),
    gatewayByAddress: (0, evm_abi_1.viewFun)("0x429773fb", "gatewayByAddress(address)", { "_0": p.address }, p.bytes32),
    getActiveGateways: (0, evm_abi_1.viewFun)("0x01a99356", "getActiveGateways(uint256,uint256)", { "pageNumber": p.uint256, "perPage": p.uint256 }, p.array(p.bytes)),
    getActiveGatewaysCount: (0, evm_abi_1.viewFun)("0xd87113e5", "getActiveGatewaysCount()", {}, p.uint256),
    getCluster: (0, evm_abi_1.viewFun)("0x585a6a6d", "getCluster(bytes)", { "peerId": p.bytes }, p.array(p.bytes)),
    getGateway: (0, evm_abi_1.viewFun)("0xdcefedaf", "getGateway(bytes)", { "peerId": p.bytes }, p.struct({ "operator": p.address, "ownAddress": p.address, "peerId": p.bytes, "metadata": p.string })),
    getMetadata: (0, evm_abi_1.viewFun)("0x75734be8", "getMetadata(bytes)", { "peerId": p.bytes }, p.string),
    getMyGateways: (0, evm_abi_1.viewFun)("0x2c17a07f", "getMyGateways(address)", { "operator": p.address }, p.array(p.bytes)),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    getStake: (0, evm_abi_1.viewFun)("0x7a766460", "getStake(address)", { "operator": p.address }, p.struct({ "amount": p.uint256, "lockStart": p.uint128, "lockEnd": p.uint128, "duration": p.uint128, "autoExtension": p.bool, "oldCUs": p.uint256 })),
    getUsedStrategy: (0, evm_abi_1.viewFun)("0x94f3c725", "getUsedStrategy(bytes)", { "peerId": p.bytes }, p.address),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    initialize: (0, evm_abi_1.fun)("0x485cc955", "initialize(address,address)", { "_token": p.address, "_router": p.address }),
    isStrategyAllowed: (0, evm_abi_1.viewFun)("0x67c1def9", "isStrategyAllowed(address)", { "strategy": p.address }, p.bool),
    mana: (0, evm_abi_1.viewFun)("0xbdb001a7", "mana()", {}, p.uint256),
    maxGatewaysPerCluster: (0, evm_abi_1.viewFun)("0xbc9c0e62", "maxGatewaysPerCluster()", {}, p.uint256),
    minStake: (0, evm_abi_1.viewFun)("0x375b3c0a", "minStake()", {}, p.uint256),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    'register(bytes)': (0, evm_abi_1.fun)("0x82fbdc9c", "register(bytes)", { "peerId": p.bytes }),
    'register(bytes,string,address)': (0, evm_abi_1.fun)("0x876ab349", "register(bytes,string,address)", { "peerId": p.bytes, "metadata": p.string, "gatewayAddress": p.address }),
    'register(bytes,string)': (0, evm_abi_1.fun)("0x92255fbf", "register(bytes,string)", { "peerId": p.bytes, "metadata": p.string }),
    'register(bytes[],string[],address[])': (0, evm_abi_1.fun)("0xb1a7e279", "register(bytes[],string[],address[])", { "peerId": p.array(p.bytes), "metadata": p.array(p.string), "gatewayAddress": p.array(p.address) }),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    router: (0, evm_abi_1.viewFun)("0xf887ea40", "router()", {}, p.address),
    setAverageBlockTime: (0, evm_abi_1.fun)("0x3736d853", "setAverageBlockTime(uint256)", { "_newAverageBlockTime": p.uint256 }),
    setGatewayAddress: (0, evm_abi_1.fun)("0xdacfab0d", "setGatewayAddress(bytes,address)", { "peerId": p.bytes, "newAddress": p.address }),
    setIsStrategyAllowed: (0, evm_abi_1.fun)("0x017a02c3", "setIsStrategyAllowed(address,bool,bool)", { "strategy": p.address, "isAllowed": p.bool, "isDefault": p.bool }),
    setMana: (0, evm_abi_1.fun)("0x0def8b8a", "setMana(uint256)", { "_newMana": p.uint256 }),
    setMaxGatewaysPerCluster: (0, evm_abi_1.fun)("0x3abcf38c", "setMaxGatewaysPerCluster(uint256)", { "_maxGatewaysPerCluster": p.uint256 }),
    setMetadata: (0, evm_abi_1.fun)("0x0fe9fb66", "setMetadata(bytes,string)", { "peerId": p.bytes, "metadata": p.string }),
    setMinStake: (0, evm_abi_1.fun)("0x8c80fd90", "setMinStake(uint256)", { "_minStake": p.uint256 }),
    'stake(uint256,uint128)': (0, evm_abi_1.fun)("0x7acfc9e2", "stake(uint256,uint128)", { "amount": p.uint256, "durationBlocks": p.uint128 }),
    'stake(uint256,uint128,bool)': (0, evm_abi_1.fun)("0xe3fa31ed", "stake(uint256,uint128,bool)", { "amount": p.uint256, "durationBlocks": p.uint128, "withAutoExtension": p.bool }),
    staked: (0, evm_abi_1.viewFun)("0x98807d84", "staked(address)", { "operator": p.address }, p.uint256),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    token: (0, evm_abi_1.viewFun)("0xfc0c546a", "token()", {}, p.address),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
    'unregister(bytes)': (0, evm_abi_1.fun)("0x27d6c032", "unregister(bytes)", { "peerId": p.bytes }),
    'unregister(bytes[])': (0, evm_abi_1.fun)("0xf586857a", "unregister(bytes[])", { "peerId": p.array(p.bytes) }),
    unstake: (0, evm_abi_1.fun)("0x2def6620", "unstake()", {}),
    useStrategy: (0, evm_abi_1.fun)("0xb8050a5d", "useStrategy(address)", { "strategy": p.address }),
};
class Contract extends evm_abi_1.ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    PAUSER_ROLE() {
        return this.eth_call(exports.functions.PAUSER_ROLE, {});
    }
    averageBlockTime() {
        return this.eth_call(exports.functions.averageBlockTime, {});
    }
    canUnstake(operator) {
        return this.eth_call(exports.functions.canUnstake, { operator });
    }
    computationUnitsAmount(amount, durationBlocks) {
        return this.eth_call(exports.functions.computationUnitsAmount, { amount, durationBlocks });
    }
    computationUnitsAvailable(peerId) {
        return this.eth_call(exports.functions.computationUnitsAvailable, { peerId });
    }
    defaultStrategy() {
        return this.eth_call(exports.functions.defaultStrategy, {});
    }
    gatewayByAddress(_0) {
        return this.eth_call(exports.functions.gatewayByAddress, { _0 });
    }
    getActiveGateways(pageNumber, perPage) {
        return this.eth_call(exports.functions.getActiveGateways, { pageNumber, perPage });
    }
    getActiveGatewaysCount() {
        return this.eth_call(exports.functions.getActiveGatewaysCount, {});
    }
    getCluster(peerId) {
        return this.eth_call(exports.functions.getCluster, { peerId });
    }
    getGateway(peerId) {
        return this.eth_call(exports.functions.getGateway, { peerId });
    }
    getMetadata(peerId) {
        return this.eth_call(exports.functions.getMetadata, { peerId });
    }
    getMyGateways(operator) {
        return this.eth_call(exports.functions.getMyGateways, { operator });
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    getStake(operator) {
        return this.eth_call(exports.functions.getStake, { operator });
    }
    getUsedStrategy(peerId) {
        return this.eth_call(exports.functions.getUsedStrategy, { peerId });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    isStrategyAllowed(strategy) {
        return this.eth_call(exports.functions.isStrategyAllowed, { strategy });
    }
    mana() {
        return this.eth_call(exports.functions.mana, {});
    }
    maxGatewaysPerCluster() {
        return this.eth_call(exports.functions.maxGatewaysPerCluster, {});
    }
    minStake() {
        return this.eth_call(exports.functions.minStake, {});
    }
    paused() {
        return this.eth_call(exports.functions.paused, {});
    }
    router() {
        return this.eth_call(exports.functions.router, {});
    }
    staked(operator) {
        return this.eth_call(exports.functions.staked, { operator });
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
    token() {
        return this.eth_call(exports.functions.token, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=GatewayRegistry.js.map