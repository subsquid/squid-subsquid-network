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
    BeaconUpgraded: (0, evm_abi_1.event)("0x1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e", "BeaconUpgraded(address)", { "newImplementation": (0, evm_abi_1.indexed)(p.address) }),
    CollectionDeadlineUpdated: (0, evm_abi_1.event)("0x0824372e750819cc0e9469afd2eeffcece0c4f1b39f0b8b92251805a2b449d32", "CollectionDeadlineUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
    DefaultMaxStakePerWalletUpdated: (0, evm_abi_1.event)("0xb73f377d26a5d2dd8344a7828c130c1a8e744b05690f815ab72123ed14517ec6", "DefaultMaxStakePerWalletUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
    DefaultWhitelistEnabledUpdated: (0, evm_abi_1.event)("0x3dd24987507ed36daa0d5e341ad21f02c7cb8562f5ed6a6626da98b28555c660", "DefaultWhitelistEnabledUpdated(bool,bool)", { "oldValue": p.bool, "newValue": p.bool }),
    ExitUnlockRateUpdated: (0, evm_abi_1.event)("0x8959d2383612a197e98a1932fdf3cbb89ad929a71b4739f21a68a5a13f0eb5fd", "ExitUnlockRateUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
    FeeRouterUpdated: (0, evm_abi_1.event)("0xa0aa418b867f9da28af69396786b801223a196e1416b517c7b664ac786c53802", "FeeRouterUpdated(address,address)", { "oldValue": (0, evm_abi_1.indexed)(p.address), "newValue": (0, evm_abi_1.indexed)(p.address) }),
    Initialized: (0, evm_abi_1.event)("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", { "version": p.uint64 }),
    MaxDistributionRateUpdated: (0, evm_abi_1.event)("0x3ff7c01609342b4b1a78877d4be37138638a8360db921608fd792fbfb92dcf10", "MaxDistributionRateUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
    MaxPaymentTokensUpdated: (0, evm_abi_1.event)("0xaa54eeae994b91da823ee876ef7ad4cf3e6ea1e16667fb40a2db90944029f006", "MaxPaymentTokensUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
    MinDistributionRateUpdated: (0, evm_abi_1.event)("0x4a728050304bd7e6d87f1d17b2399319cf2eb99e34674feaeaf4afbc96b30af8", "MinDistributionRateUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
    MinStakeThresholdUpdated: (0, evm_abi_1.event)("0xb4de73a0b1a2bbf62f494bbfa217548f4f5fb0d64c4d6c66b052676673c04e5f", "MinStakeThresholdUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
    Paused: (0, evm_abi_1.event)("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", { "account": p.address }),
    PaymentTokenAdded: (0, evm_abi_1.event)("0xa317c10673baf4f03b3c1041bd5ddbb537d0333a86fec3607c75f9dbb630f48f", "PaymentTokenAdded(address)", { "token": (0, evm_abi_1.indexed)(p.address) }),
    PaymentTokenRemoved: (0, evm_abi_1.event)("0x85a3e72f8dd6db3794f93109c3c5f5b79d6112f6979431c45f98b26134b42af2", "PaymentTokenRemoved(address)", { "token": (0, evm_abi_1.indexed)(p.address) }),
    PoolCreated: (0, evm_abi_1.event)("0xe04951d3bb0100a05879a87c78e3a8d18066ab99d775011cdf29dfda490ead7f", "PoolCreated(address,address,address,uint256,uint256,uint256,string,string)", { "portal": (0, evm_abi_1.indexed)(p.address), "operator": (0, evm_abi_1.indexed)(p.address), "rewardToken": (0, evm_abi_1.indexed)(p.address), "capacity": p.uint256, "distributionRatePerSecond": p.uint256, "initialDeposit": p.uint256, "tokenSuffix": p.string, "metadata": p.string }),
    PoolDeploymentOpenUpdated: (0, evm_abi_1.event)("0xb9d0a37563459c5dc7771b668f938687f738db00fe99d3264682ff16cb2a38aa", "PoolDeploymentOpenUpdated(bool,bool)", { "oldValue": p.bool, "newValue": p.bool }),
    RoleAdminChanged: (0, evm_abi_1.event)("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "previousAdminRole": (0, evm_abi_1.indexed)(p.bytes32), "newAdminRole": (0, evm_abi_1.indexed)(p.bytes32) }),
    RoleGranted: (0, evm_abi_1.event)("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    RoleRevoked: (0, evm_abi_1.event)("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", { "role": (0, evm_abi_1.indexed)(p.bytes32), "account": (0, evm_abi_1.indexed)(p.address), "sender": (0, evm_abi_1.indexed)(p.address) }),
    Unpaused: (0, evm_abi_1.event)("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", { "account": p.address }),
    Upgraded: (0, evm_abi_1.event)("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", { "implementation": (0, evm_abi_1.indexed)(p.address) }),
    WhitelistFeatureEnabledUpdated: (0, evm_abi_1.event)("0x2fb6a0473f4b0e5567e64e905ca3a870c5c59d0eae6db64471dfa38f6f1af6b8", "WhitelistFeatureEnabledUpdated(bool,bool)", { "oldValue": p.bool, "newValue": p.bool }),
    WorkerEpochLengthUpdated: (0, evm_abi_1.event)("0xeac32090862141438b78292583009c893b5caac810a1edd52674d74852f909b6", "WorkerEpochLengthUpdated(uint256,uint256)", { "oldValue": p.uint256, "newValue": p.uint256 }),
};
exports.functions = {
    DEFAULT_ADMIN_ROLE: (0, evm_abi_1.viewFun)("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    PAUSER_ROLE: (0, evm_abi_1.viewFun)("0xe63ab1e9", "PAUSER_ROLE()", {}, p.bytes32),
    POOL_DEPLOYER_ROLE: (0, evm_abi_1.viewFun)("0x41c8025d", "POOL_DEPLOYER_ROLE()", {}, p.bytes32),
    UPGRADE_INTERFACE_VERSION: (0, evm_abi_1.viewFun)("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    addPaymentToken: (0, evm_abi_1.fun)("0x4a7dc8e0", "addPaymentToken(address)", { "token": p.address }),
    allPortals: (0, evm_abi_1.viewFun)("0x34d363c5", "allPortals(uint256)", { "_0": p.uint256 }, p.address),
    beacon: (0, evm_abi_1.viewFun)("0x59659e90", "beacon()", {}, p.address),
    collectionDeadlineSeconds: (0, evm_abi_1.viewFun)("0xcd40983d", "collectionDeadlineSeconds()", {}, p.uint256),
    createPortalPool: (0, evm_abi_1.fun)("0x3177d2c1", "createPortalPool((address,uint256,string,uint256,uint256,string,address))", { "params": p.struct({ "operator": p.address, "capacity": p.uint256, "tokenSuffix": p.string, "distributionRatePerSecond": p.uint256, "initialDeposit": p.uint256, "metadata": p.string, "rewardToken": p.address }) }, p.address),
    defaultMaxStakePerWallet: (0, evm_abi_1.viewFun)("0xbd659db8", "defaultMaxStakePerWallet()", {}, p.uint256),
    defaultWhitelistEnabled: (0, evm_abi_1.viewFun)("0xa016e4d8", "defaultWhitelistEnabled()", {}, p.bool),
    exitUnlockRatePerSecond: (0, evm_abi_1.viewFun)("0xa40c3bf8", "exitUnlockRatePerSecond()", {}, p.uint256),
    feeRouter: (0, evm_abi_1.viewFun)("0xf29ebf61", "feeRouter()", {}, p.address),
    getAllowedPaymentTokens: (0, evm_abi_1.viewFun)("0x8959c23c", "getAllowedPaymentTokens()", {}, p.array(p.address)),
    getMinCapacity: (0, evm_abi_1.viewFun)("0x251a8872", "getMinCapacity()", {}, p.uint256),
    getOperatorPortals: (0, evm_abi_1.viewFun)("0x4ef9ec21", "getOperatorPortals(address)", { "operator": p.address }, p.array(p.address)),
    getOperatorPortalsPaginated: (0, evm_abi_1.viewFun)("0x7c6ccbf6", "getOperatorPortalsPaginated(address,uint256,uint256)", { "operator": p.address, "offset": p.uint256, "limit": p.uint256 }, p.array(p.address)),
    getPortalCount: (0, evm_abi_1.viewFun)("0x29b35516", "getPortalCount()", {}, p.uint256),
    getRoleAdmin: (0, evm_abi_1.viewFun)("0x248a9ca3", "getRoleAdmin(bytes32)", { "role": p.bytes32 }, p.bytes32),
    grantRole: (0, evm_abi_1.fun)("0x2f2ff15d", "grantRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    hasRole: (0, evm_abi_1.viewFun)("0x91d14854", "hasRole(bytes32,address)", { "role": p.bytes32, "account": p.address }, p.bool),
    initialize: (0, evm_abi_1.fun)("0xe77fc7a4", "initialize(address,address,address,address,uint256,uint256,uint256)", { "_implementation": p.address, "_portalRegistry": p.address, "_feeRouter": p.address, "_sqd": p.address, "_defaultMaxStakePerWallet": p.uint256, "_minStakeThreshold": p.uint256, "_workerEpochLength": p.uint256 }),
    isAllowedPaymentToken: (0, evm_abi_1.viewFun)("0xa7bfaadd", "isAllowedPaymentToken(address)", { "_0": p.address }, p.bool),
    isPortal: (0, evm_abi_1.viewFun)("0x13eb4671", "isPortal(address)", { "_0": p.address }, p.bool),
    maxDistributionRatePerSecond: (0, evm_abi_1.viewFun)("0x8c4d4765", "maxDistributionRatePerSecond()", {}, p.uint256),
    maxPaymentTokens: (0, evm_abi_1.viewFun)("0xfaf91d3a", "maxPaymentTokens()", {}, p.uint256),
    minDistributionRatePerSecond: (0, evm_abi_1.viewFun)("0x090fdb46", "minDistributionRatePerSecond()", {}, p.uint256),
    minStakeThreshold: (0, evm_abi_1.viewFun)("0xab17a7c0", "minStakeThreshold()", {}, p.uint256),
    operatorPortalCount: (0, evm_abi_1.viewFun)("0x4243b6f1", "operatorPortalCount(address)", { "_0": p.address }, p.uint256),
    operatorPortalPools: (0, evm_abi_1.viewFun)("0x77a65f15", "operatorPortalPools(address,uint256)", { "_0": p.address, "_1": p.uint256 }, p.address),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    paymentTokensList: (0, evm_abi_1.viewFun)("0xd5b130d1", "paymentTokensList(uint256)", { "_0": p.uint256 }, p.address),
    poolDeploymentOpen: (0, evm_abi_1.viewFun)("0x6d3d6554", "poolDeploymentOpen()", {}, p.bool),
    portalCount: (0, evm_abi_1.viewFun)("0xe85864ad", "portalCount()", {}, p.uint256),
    portalRegistry: (0, evm_abi_1.viewFun)("0xb6664934", "portalRegistry()", {}, p.address),
    proxiableUUID: (0, evm_abi_1.viewFun)("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    removePaymentToken: (0, evm_abi_1.fun)("0xa5125421", "removePaymentToken(address)", { "token": p.address }),
    renounceRole: (0, evm_abi_1.fun)("0x36568abe", "renounceRole(bytes32,address)", { "role": p.bytes32, "callerConfirmation": p.address }),
    revokeRole: (0, evm_abi_1.fun)("0xd547741f", "revokeRole(bytes32,address)", { "role": p.bytes32, "account": p.address }),
    setCollectionDeadline: (0, evm_abi_1.fun)("0x635c8b65", "setCollectionDeadline(uint256)", { "seconds_": p.uint256 }),
    setDefaultMaxStakePerWallet: (0, evm_abi_1.fun)("0x2c36918a", "setDefaultMaxStakePerWallet(uint256)", { "_maxStake": p.uint256 }),
    setDefaultWhitelistEnabled: (0, evm_abi_1.fun)("0xba0cb72e", "setDefaultWhitelistEnabled(bool)", { "enabled": p.bool }),
    setExitUnlockRate: (0, evm_abi_1.fun)("0x358c4cda", "setExitUnlockRate(uint256)", { "ratePerSecond": p.uint256 }),
    setFeeRouter: (0, evm_abi_1.fun)("0xc267ada4", "setFeeRouter(address)", { "_feeRouter": p.address }),
    setMaxDistributionRate: (0, evm_abi_1.fun)("0xd1f52947", "setMaxDistributionRate(uint256)", { "ratePerSecond": p.uint256 }),
    setMaxPaymentTokens: (0, evm_abi_1.fun)("0x8b1a331b", "setMaxPaymentTokens(uint256)", { "value": p.uint256 }),
    setMinDistributionRate: (0, evm_abi_1.fun)("0x240b8b32", "setMinDistributionRate(uint256)", { "ratePerSecond": p.uint256 }),
    setMinStakeThreshold: (0, evm_abi_1.fun)("0xe702f65d", "setMinStakeThreshold(uint256)", { "_minStakeThreshold": p.uint256 }),
    setPoolDeploymentOpen: (0, evm_abi_1.fun)("0xe56efd55", "setPoolDeploymentOpen(bool)", { "open": p.bool }),
    setWhitelistFeatureEnabled: (0, evm_abi_1.fun)("0x5d4bb0dc", "setWhitelistFeatureEnabled(bool)", { "enabled": p.bool }),
    setWorkerEpochLength: (0, evm_abi_1.fun)("0xb4422768", "setWorkerEpochLength(uint256)", { "_workerEpochLength": p.uint256 }),
    sqd: (0, evm_abi_1.viewFun)("0xebce3c5d", "sqd()", {}, p.address),
    supportsInterface: (0, evm_abi_1.viewFun)("0x01ffc9a7", "supportsInterface(bytes4)", { "interfaceId": p.bytes4 }, p.bool),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
    upgradeBeacon: (0, evm_abi_1.fun)("0x1bce4583", "upgradeBeacon(address)", { "newImplementation": p.address }),
    upgradeToAndCall: (0, evm_abi_1.fun)("0x4f1ef286", "upgradeToAndCall(address,bytes)", { "newImplementation": p.address, "data": p.bytes }),
    whitelistFeatureEnabled: (0, evm_abi_1.viewFun)("0xbb643b55", "whitelistFeatureEnabled()", {}, p.bool),
    workerEpochLength: (0, evm_abi_1.viewFun)("0xeda0e1da", "workerEpochLength()", {}, p.uint256),
};
class Contract extends evm_abi_1.ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(exports.functions.DEFAULT_ADMIN_ROLE, {});
    }
    PAUSER_ROLE() {
        return this.eth_call(exports.functions.PAUSER_ROLE, {});
    }
    POOL_DEPLOYER_ROLE() {
        return this.eth_call(exports.functions.POOL_DEPLOYER_ROLE, {});
    }
    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(exports.functions.UPGRADE_INTERFACE_VERSION, {});
    }
    allPortals(_0) {
        return this.eth_call(exports.functions.allPortals, { _0 });
    }
    beacon() {
        return this.eth_call(exports.functions.beacon, {});
    }
    collectionDeadlineSeconds() {
        return this.eth_call(exports.functions.collectionDeadlineSeconds, {});
    }
    defaultMaxStakePerWallet() {
        return this.eth_call(exports.functions.defaultMaxStakePerWallet, {});
    }
    defaultWhitelistEnabled() {
        return this.eth_call(exports.functions.defaultWhitelistEnabled, {});
    }
    exitUnlockRatePerSecond() {
        return this.eth_call(exports.functions.exitUnlockRatePerSecond, {});
    }
    feeRouter() {
        return this.eth_call(exports.functions.feeRouter, {});
    }
    getAllowedPaymentTokens() {
        return this.eth_call(exports.functions.getAllowedPaymentTokens, {});
    }
    getMinCapacity() {
        return this.eth_call(exports.functions.getMinCapacity, {});
    }
    getOperatorPortals(operator) {
        return this.eth_call(exports.functions.getOperatorPortals, { operator });
    }
    getOperatorPortalsPaginated(operator, offset, limit) {
        return this.eth_call(exports.functions.getOperatorPortalsPaginated, { operator, offset, limit });
    }
    getPortalCount() {
        return this.eth_call(exports.functions.getPortalCount, {});
    }
    getRoleAdmin(role) {
        return this.eth_call(exports.functions.getRoleAdmin, { role });
    }
    hasRole(role, account) {
        return this.eth_call(exports.functions.hasRole, { role, account });
    }
    isAllowedPaymentToken(_0) {
        return this.eth_call(exports.functions.isAllowedPaymentToken, { _0 });
    }
    isPortal(_0) {
        return this.eth_call(exports.functions.isPortal, { _0 });
    }
    maxDistributionRatePerSecond() {
        return this.eth_call(exports.functions.maxDistributionRatePerSecond, {});
    }
    maxPaymentTokens() {
        return this.eth_call(exports.functions.maxPaymentTokens, {});
    }
    minDistributionRatePerSecond() {
        return this.eth_call(exports.functions.minDistributionRatePerSecond, {});
    }
    minStakeThreshold() {
        return this.eth_call(exports.functions.minStakeThreshold, {});
    }
    operatorPortalCount(_0) {
        return this.eth_call(exports.functions.operatorPortalCount, { _0 });
    }
    operatorPortalPools(_0, _1) {
        return this.eth_call(exports.functions.operatorPortalPools, { _0, _1 });
    }
    paused() {
        return this.eth_call(exports.functions.paused, {});
    }
    paymentTokensList(_0) {
        return this.eth_call(exports.functions.paymentTokensList, { _0 });
    }
    poolDeploymentOpen() {
        return this.eth_call(exports.functions.poolDeploymentOpen, {});
    }
    portalCount() {
        return this.eth_call(exports.functions.portalCount, {});
    }
    portalRegistry() {
        return this.eth_call(exports.functions.portalRegistry, {});
    }
    proxiableUUID() {
        return this.eth_call(exports.functions.proxiableUUID, {});
    }
    sqd() {
        return this.eth_call(exports.functions.sqd, {});
    }
    supportsInterface(interfaceId) {
        return this.eth_call(exports.functions.supportsInterface, { interfaceId });
    }
    whitelistFeatureEnabled() {
        return this.eth_call(exports.functions.whitelistFeatureEnabled, {});
    }
    workerEpochLength() {
        return this.eth_call(exports.functions.workerEpochLength, {});
    }
}
exports.Contract = Contract;
//# sourceMappingURL=PortalPoolFactory.js.map