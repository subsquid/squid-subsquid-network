import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    BeaconUpgraded: event("0x1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e", "BeaconUpgraded(address)", {"newImplementation": indexed(p.address)}),
    CollectionDeadlineUpdated: event("0x0824372e750819cc0e9469afd2eeffcece0c4f1b39f0b8b92251805a2b449d32", "CollectionDeadlineUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
    DefaultMaxStakePerWalletUpdated: event("0xb73f377d26a5d2dd8344a7828c130c1a8e744b05690f815ab72123ed14517ec6", "DefaultMaxStakePerWalletUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
    DefaultWhitelistEnabledUpdated: event("0x3dd24987507ed36daa0d5e341ad21f02c7cb8562f5ed6a6626da98b28555c660", "DefaultWhitelistEnabledUpdated(bool,bool)", {"oldValue": p.bool, "newValue": p.bool}),
    ExitUnlockRateUpdated: event("0x8959d2383612a197e98a1932fdf3cbb89ad929a71b4739f21a68a5a13f0eb5fd", "ExitUnlockRateUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
    FeeRouterUpdated: event("0xa0aa418b867f9da28af69396786b801223a196e1416b517c7b664ac786c53802", "FeeRouterUpdated(address,address)", {"oldValue": indexed(p.address), "newValue": indexed(p.address)}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    MaxDistributionRateUpdated: event("0x3ff7c01609342b4b1a78877d4be37138638a8360db921608fd792fbfb92dcf10", "MaxDistributionRateUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
    MaxPaymentTokensUpdated: event("0xaa54eeae994b91da823ee876ef7ad4cf3e6ea1e16667fb40a2db90944029f006", "MaxPaymentTokensUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
    MinDistributionRateUpdated: event("0x4a728050304bd7e6d87f1d17b2399319cf2eb99e34674feaeaf4afbc96b30af8", "MinDistributionRateUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
    MinStakeThresholdUpdated: event("0xb4de73a0b1a2bbf62f494bbfa217548f4f5fb0d64c4d6c66b052676673c04e5f", "MinStakeThresholdUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    PaymentTokenAdded: event("0xa317c10673baf4f03b3c1041bd5ddbb537d0333a86fec3607c75f9dbb630f48f", "PaymentTokenAdded(address)", {"token": indexed(p.address)}),
    PaymentTokenRemoved: event("0x85a3e72f8dd6db3794f93109c3c5f5b79d6112f6979431c45f98b26134b42af2", "PaymentTokenRemoved(address)", {"token": indexed(p.address)}),
    PoolCreated: event("0xe04951d3bb0100a05879a87c78e3a8d18066ab99d775011cdf29dfda490ead7f", "PoolCreated(address,address,address,uint256,uint256,uint256,string,string)", {"portal": indexed(p.address), "operator": indexed(p.address), "rewardToken": indexed(p.address), "capacity": p.uint256, "distributionRatePerSecond": p.uint256, "initialDeposit": p.uint256, "tokenSuffix": p.string, "metadata": p.string}),
    PoolDeploymentOpenUpdated: event("0xb9d0a37563459c5dc7771b668f938687f738db00fe99d3264682ff16cb2a38aa", "PoolDeploymentOpenUpdated(bool,bool)", {"oldValue": p.bool, "newValue": p.bool}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    WhitelistFeatureEnabledUpdated: event("0x2fb6a0473f4b0e5567e64e905ca3a870c5c59d0eae6db64471dfa38f6f1af6b8", "WhitelistFeatureEnabledUpdated(bool,bool)", {"oldValue": p.bool, "newValue": p.bool}),
    WorkerEpochLengthUpdated: event("0xeac32090862141438b78292583009c893b5caac810a1edd52674d74852f909b6", "WorkerEpochLengthUpdated(uint256,uint256)", {"oldValue": p.uint256, "newValue": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    PAUSER_ROLE: viewFun("0xe63ab1e9", "PAUSER_ROLE()", {}, p.bytes32),
    POOL_DEPLOYER_ROLE: viewFun("0x41c8025d", "POOL_DEPLOYER_ROLE()", {}, p.bytes32),
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    addPaymentToken: fun("0x4a7dc8e0", "addPaymentToken(address)", {"token": p.address}, ),
    allPortals: viewFun("0x34d363c5", "allPortals(uint256)", {"_0": p.uint256}, p.address),
    beacon: viewFun("0x59659e90", "beacon()", {}, p.address),
    collectionDeadlineSeconds: viewFun("0xcd40983d", "collectionDeadlineSeconds()", {}, p.uint256),
    createPortalPool: fun("0x3177d2c1", "createPortalPool((address,uint256,string,uint256,uint256,string,address))", {"params": p.struct({"operator": p.address, "capacity": p.uint256, "tokenSuffix": p.string, "distributionRatePerSecond": p.uint256, "initialDeposit": p.uint256, "metadata": p.string, "rewardToken": p.address})}, p.address),
    defaultMaxStakePerWallet: viewFun("0xbd659db8", "defaultMaxStakePerWallet()", {}, p.uint256),
    defaultWhitelistEnabled: viewFun("0xa016e4d8", "defaultWhitelistEnabled()", {}, p.bool),
    exitUnlockRatePerSecond: viewFun("0xa40c3bf8", "exitUnlockRatePerSecond()", {}, p.uint256),
    feeRouter: viewFun("0xf29ebf61", "feeRouter()", {}, p.address),
    getAllowedPaymentTokens: viewFun("0x8959c23c", "getAllowedPaymentTokens()", {}, p.array(p.address)),
    getMinCapacity: viewFun("0x251a8872", "getMinCapacity()", {}, p.uint256),
    getOperatorPortals: viewFun("0x4ef9ec21", "getOperatorPortals(address)", {"operator": p.address}, p.array(p.address)),
    getOperatorPortalsPaginated: viewFun("0x7c6ccbf6", "getOperatorPortalsPaginated(address,uint256,uint256)", {"operator": p.address, "offset": p.uint256, "limit": p.uint256}, p.array(p.address)),
    getPortalCount: viewFun("0x29b35516", "getPortalCount()", {}, p.uint256),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    initialize: fun("0xe77fc7a4", "initialize(address,address,address,address,uint256,uint256,uint256)", {"_implementation": p.address, "_portalRegistry": p.address, "_feeRouter": p.address, "_sqd": p.address, "_defaultMaxStakePerWallet": p.uint256, "_minStakeThreshold": p.uint256, "_workerEpochLength": p.uint256}, ),
    isAllowedPaymentToken: viewFun("0xa7bfaadd", "isAllowedPaymentToken(address)", {"_0": p.address}, p.bool),
    isPortal: viewFun("0x13eb4671", "isPortal(address)", {"_0": p.address}, p.bool),
    maxDistributionRatePerSecond: viewFun("0x8c4d4765", "maxDistributionRatePerSecond()", {}, p.uint256),
    maxPaymentTokens: viewFun("0xfaf91d3a", "maxPaymentTokens()", {}, p.uint256),
    minDistributionRatePerSecond: viewFun("0x090fdb46", "minDistributionRatePerSecond()", {}, p.uint256),
    minStakeThreshold: viewFun("0xab17a7c0", "minStakeThreshold()", {}, p.uint256),
    operatorPortalCount: viewFun("0x4243b6f1", "operatorPortalCount(address)", {"_0": p.address}, p.uint256),
    operatorPortalPools: viewFun("0x77a65f15", "operatorPortalPools(address,uint256)", {"_0": p.address, "_1": p.uint256}, p.address),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    paymentTokensList: viewFun("0xd5b130d1", "paymentTokensList(uint256)", {"_0": p.uint256}, p.address),
    poolDeploymentOpen: viewFun("0x6d3d6554", "poolDeploymentOpen()", {}, p.bool),
    portalCount: viewFun("0xe85864ad", "portalCount()", {}, p.uint256),
    portalRegistry: viewFun("0xb6664934", "portalRegistry()", {}, p.address),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    removePaymentToken: fun("0xa5125421", "removePaymentToken(address)", {"token": p.address}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setCollectionDeadline: fun("0x635c8b65", "setCollectionDeadline(uint256)", {"seconds_": p.uint256}, ),
    setDefaultMaxStakePerWallet: fun("0x2c36918a", "setDefaultMaxStakePerWallet(uint256)", {"_maxStake": p.uint256}, ),
    setDefaultWhitelistEnabled: fun("0xba0cb72e", "setDefaultWhitelistEnabled(bool)", {"enabled": p.bool}, ),
    setExitUnlockRate: fun("0x358c4cda", "setExitUnlockRate(uint256)", {"ratePerSecond": p.uint256}, ),
    setFeeRouter: fun("0xc267ada4", "setFeeRouter(address)", {"_feeRouter": p.address}, ),
    setMaxDistributionRate: fun("0xd1f52947", "setMaxDistributionRate(uint256)", {"ratePerSecond": p.uint256}, ),
    setMaxPaymentTokens: fun("0x8b1a331b", "setMaxPaymentTokens(uint256)", {"value": p.uint256}, ),
    setMinDistributionRate: fun("0x240b8b32", "setMinDistributionRate(uint256)", {"ratePerSecond": p.uint256}, ),
    setMinStakeThreshold: fun("0xe702f65d", "setMinStakeThreshold(uint256)", {"_minStakeThreshold": p.uint256}, ),
    setPoolDeploymentOpen: fun("0xe56efd55", "setPoolDeploymentOpen(bool)", {"open": p.bool}, ),
    setWhitelistFeatureEnabled: fun("0x5d4bb0dc", "setWhitelistFeatureEnabled(bool)", {"enabled": p.bool}, ),
    setWorkerEpochLength: fun("0xb4422768", "setWorkerEpochLength(uint256)", {"_workerEpochLength": p.uint256}, ),
    sqd: viewFun("0xebce3c5d", "sqd()", {}, p.address),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    upgradeBeacon: fun("0x1bce4583", "upgradeBeacon(address)", {"newImplementation": p.address}, ),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
    whitelistFeatureEnabled: viewFun("0xbb643b55", "whitelistFeatureEnabled()", {}, p.bool),
    workerEpochLength: viewFun("0xeda0e1da", "workerEpochLength()", {}, p.uint256),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    PAUSER_ROLE() {
        return this.eth_call(functions.PAUSER_ROLE, {})
    }

    POOL_DEPLOYER_ROLE() {
        return this.eth_call(functions.POOL_DEPLOYER_ROLE, {})
    }

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    allPortals(_0: AllPortalsParams["_0"]) {
        return this.eth_call(functions.allPortals, {_0})
    }

    beacon() {
        return this.eth_call(functions.beacon, {})
    }

    collectionDeadlineSeconds() {
        return this.eth_call(functions.collectionDeadlineSeconds, {})
    }

    defaultMaxStakePerWallet() {
        return this.eth_call(functions.defaultMaxStakePerWallet, {})
    }

    defaultWhitelistEnabled() {
        return this.eth_call(functions.defaultWhitelistEnabled, {})
    }

    exitUnlockRatePerSecond() {
        return this.eth_call(functions.exitUnlockRatePerSecond, {})
    }

    feeRouter() {
        return this.eth_call(functions.feeRouter, {})
    }

    getAllowedPaymentTokens() {
        return this.eth_call(functions.getAllowedPaymentTokens, {})
    }

    getMinCapacity() {
        return this.eth_call(functions.getMinCapacity, {})
    }

    getOperatorPortals(operator: GetOperatorPortalsParams["operator"]) {
        return this.eth_call(functions.getOperatorPortals, {operator})
    }

    getOperatorPortalsPaginated(operator: GetOperatorPortalsPaginatedParams["operator"], offset: GetOperatorPortalsPaginatedParams["offset"], limit: GetOperatorPortalsPaginatedParams["limit"]) {
        return this.eth_call(functions.getOperatorPortalsPaginated, {operator, offset, limit})
    }

    getPortalCount() {
        return this.eth_call(functions.getPortalCount, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isAllowedPaymentToken(_0: IsAllowedPaymentTokenParams["_0"]) {
        return this.eth_call(functions.isAllowedPaymentToken, {_0})
    }

    isPortal(_0: IsPortalParams["_0"]) {
        return this.eth_call(functions.isPortal, {_0})
    }

    maxDistributionRatePerSecond() {
        return this.eth_call(functions.maxDistributionRatePerSecond, {})
    }

    maxPaymentTokens() {
        return this.eth_call(functions.maxPaymentTokens, {})
    }

    minDistributionRatePerSecond() {
        return this.eth_call(functions.minDistributionRatePerSecond, {})
    }

    minStakeThreshold() {
        return this.eth_call(functions.minStakeThreshold, {})
    }

    operatorPortalCount(_0: OperatorPortalCountParams["_0"]) {
        return this.eth_call(functions.operatorPortalCount, {_0})
    }

    operatorPortalPools(_0: OperatorPortalPoolsParams["_0"], _1: OperatorPortalPoolsParams["_1"]) {
        return this.eth_call(functions.operatorPortalPools, {_0, _1})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    paymentTokensList(_0: PaymentTokensListParams["_0"]) {
        return this.eth_call(functions.paymentTokensList, {_0})
    }

    poolDeploymentOpen() {
        return this.eth_call(functions.poolDeploymentOpen, {})
    }

    portalCount() {
        return this.eth_call(functions.portalCount, {})
    }

    portalRegistry() {
        return this.eth_call(functions.portalRegistry, {})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }

    sqd() {
        return this.eth_call(functions.sqd, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    whitelistFeatureEnabled() {
        return this.eth_call(functions.whitelistFeatureEnabled, {})
    }

    workerEpochLength() {
        return this.eth_call(functions.workerEpochLength, {})
    }
}

/// Event types
export type BeaconUpgradedEventArgs = EParams<typeof events.BeaconUpgraded>
export type CollectionDeadlineUpdatedEventArgs = EParams<typeof events.CollectionDeadlineUpdated>
export type DefaultMaxStakePerWalletUpdatedEventArgs = EParams<typeof events.DefaultMaxStakePerWalletUpdated>
export type DefaultWhitelistEnabledUpdatedEventArgs = EParams<typeof events.DefaultWhitelistEnabledUpdated>
export type ExitUnlockRateUpdatedEventArgs = EParams<typeof events.ExitUnlockRateUpdated>
export type FeeRouterUpdatedEventArgs = EParams<typeof events.FeeRouterUpdated>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type MaxDistributionRateUpdatedEventArgs = EParams<typeof events.MaxDistributionRateUpdated>
export type MaxPaymentTokensUpdatedEventArgs = EParams<typeof events.MaxPaymentTokensUpdated>
export type MinDistributionRateUpdatedEventArgs = EParams<typeof events.MinDistributionRateUpdated>
export type MinStakeThresholdUpdatedEventArgs = EParams<typeof events.MinStakeThresholdUpdated>
export type PausedEventArgs = EParams<typeof events.Paused>
export type PaymentTokenAddedEventArgs = EParams<typeof events.PaymentTokenAdded>
export type PaymentTokenRemovedEventArgs = EParams<typeof events.PaymentTokenRemoved>
export type PoolCreatedEventArgs = EParams<typeof events.PoolCreated>
export type PoolDeploymentOpenUpdatedEventArgs = EParams<typeof events.PoolDeploymentOpenUpdated>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WhitelistFeatureEnabledUpdatedEventArgs = EParams<typeof events.WhitelistFeatureEnabledUpdated>
export type WorkerEpochLengthUpdatedEventArgs = EParams<typeof events.WorkerEpochLengthUpdated>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>

export type POOL_DEPLOYER_ROLEParams = FunctionArguments<typeof functions.POOL_DEPLOYER_ROLE>
export type POOL_DEPLOYER_ROLEReturn = FunctionReturn<typeof functions.POOL_DEPLOYER_ROLE>

export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type AddPaymentTokenParams = FunctionArguments<typeof functions.addPaymentToken>
export type AddPaymentTokenReturn = FunctionReturn<typeof functions.addPaymentToken>

export type AllPortalsParams = FunctionArguments<typeof functions.allPortals>
export type AllPortalsReturn = FunctionReturn<typeof functions.allPortals>

export type BeaconParams = FunctionArguments<typeof functions.beacon>
export type BeaconReturn = FunctionReturn<typeof functions.beacon>

export type CollectionDeadlineSecondsParams = FunctionArguments<typeof functions.collectionDeadlineSeconds>
export type CollectionDeadlineSecondsReturn = FunctionReturn<typeof functions.collectionDeadlineSeconds>

export type CreatePortalPoolParams = FunctionArguments<typeof functions.createPortalPool>
export type CreatePortalPoolReturn = FunctionReturn<typeof functions.createPortalPool>

export type DefaultMaxStakePerWalletParams = FunctionArguments<typeof functions.defaultMaxStakePerWallet>
export type DefaultMaxStakePerWalletReturn = FunctionReturn<typeof functions.defaultMaxStakePerWallet>

export type DefaultWhitelistEnabledParams = FunctionArguments<typeof functions.defaultWhitelistEnabled>
export type DefaultWhitelistEnabledReturn = FunctionReturn<typeof functions.defaultWhitelistEnabled>

export type ExitUnlockRatePerSecondParams = FunctionArguments<typeof functions.exitUnlockRatePerSecond>
export type ExitUnlockRatePerSecondReturn = FunctionReturn<typeof functions.exitUnlockRatePerSecond>

export type FeeRouterParams = FunctionArguments<typeof functions.feeRouter>
export type FeeRouterReturn = FunctionReturn<typeof functions.feeRouter>

export type GetAllowedPaymentTokensParams = FunctionArguments<typeof functions.getAllowedPaymentTokens>
export type GetAllowedPaymentTokensReturn = FunctionReturn<typeof functions.getAllowedPaymentTokens>

export type GetMinCapacityParams = FunctionArguments<typeof functions.getMinCapacity>
export type GetMinCapacityReturn = FunctionReturn<typeof functions.getMinCapacity>

export type GetOperatorPortalsParams = FunctionArguments<typeof functions.getOperatorPortals>
export type GetOperatorPortalsReturn = FunctionReturn<typeof functions.getOperatorPortals>

export type GetOperatorPortalsPaginatedParams = FunctionArguments<typeof functions.getOperatorPortalsPaginated>
export type GetOperatorPortalsPaginatedReturn = FunctionReturn<typeof functions.getOperatorPortalsPaginated>

export type GetPortalCountParams = FunctionArguments<typeof functions.getPortalCount>
export type GetPortalCountReturn = FunctionReturn<typeof functions.getPortalCount>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsAllowedPaymentTokenParams = FunctionArguments<typeof functions.isAllowedPaymentToken>
export type IsAllowedPaymentTokenReturn = FunctionReturn<typeof functions.isAllowedPaymentToken>

export type IsPortalParams = FunctionArguments<typeof functions.isPortal>
export type IsPortalReturn = FunctionReturn<typeof functions.isPortal>

export type MaxDistributionRatePerSecondParams = FunctionArguments<typeof functions.maxDistributionRatePerSecond>
export type MaxDistributionRatePerSecondReturn = FunctionReturn<typeof functions.maxDistributionRatePerSecond>

export type MaxPaymentTokensParams = FunctionArguments<typeof functions.maxPaymentTokens>
export type MaxPaymentTokensReturn = FunctionReturn<typeof functions.maxPaymentTokens>

export type MinDistributionRatePerSecondParams = FunctionArguments<typeof functions.minDistributionRatePerSecond>
export type MinDistributionRatePerSecondReturn = FunctionReturn<typeof functions.minDistributionRatePerSecond>

export type MinStakeThresholdParams = FunctionArguments<typeof functions.minStakeThreshold>
export type MinStakeThresholdReturn = FunctionReturn<typeof functions.minStakeThreshold>

export type OperatorPortalCountParams = FunctionArguments<typeof functions.operatorPortalCount>
export type OperatorPortalCountReturn = FunctionReturn<typeof functions.operatorPortalCount>

export type OperatorPortalPoolsParams = FunctionArguments<typeof functions.operatorPortalPools>
export type OperatorPortalPoolsReturn = FunctionReturn<typeof functions.operatorPortalPools>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PaymentTokensListParams = FunctionArguments<typeof functions.paymentTokensList>
export type PaymentTokensListReturn = FunctionReturn<typeof functions.paymentTokensList>

export type PoolDeploymentOpenParams = FunctionArguments<typeof functions.poolDeploymentOpen>
export type PoolDeploymentOpenReturn = FunctionReturn<typeof functions.poolDeploymentOpen>

export type PortalCountParams = FunctionArguments<typeof functions.portalCount>
export type PortalCountReturn = FunctionReturn<typeof functions.portalCount>

export type PortalRegistryParams = FunctionArguments<typeof functions.portalRegistry>
export type PortalRegistryReturn = FunctionReturn<typeof functions.portalRegistry>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type RemovePaymentTokenParams = FunctionArguments<typeof functions.removePaymentToken>
export type RemovePaymentTokenReturn = FunctionReturn<typeof functions.removePaymentToken>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetCollectionDeadlineParams = FunctionArguments<typeof functions.setCollectionDeadline>
export type SetCollectionDeadlineReturn = FunctionReturn<typeof functions.setCollectionDeadline>

export type SetDefaultMaxStakePerWalletParams = FunctionArguments<typeof functions.setDefaultMaxStakePerWallet>
export type SetDefaultMaxStakePerWalletReturn = FunctionReturn<typeof functions.setDefaultMaxStakePerWallet>

export type SetDefaultWhitelistEnabledParams = FunctionArguments<typeof functions.setDefaultWhitelistEnabled>
export type SetDefaultWhitelistEnabledReturn = FunctionReturn<typeof functions.setDefaultWhitelistEnabled>

export type SetExitUnlockRateParams = FunctionArguments<typeof functions.setExitUnlockRate>
export type SetExitUnlockRateReturn = FunctionReturn<typeof functions.setExitUnlockRate>

export type SetFeeRouterParams = FunctionArguments<typeof functions.setFeeRouter>
export type SetFeeRouterReturn = FunctionReturn<typeof functions.setFeeRouter>

export type SetMaxDistributionRateParams = FunctionArguments<typeof functions.setMaxDistributionRate>
export type SetMaxDistributionRateReturn = FunctionReturn<typeof functions.setMaxDistributionRate>

export type SetMaxPaymentTokensParams = FunctionArguments<typeof functions.setMaxPaymentTokens>
export type SetMaxPaymentTokensReturn = FunctionReturn<typeof functions.setMaxPaymentTokens>

export type SetMinDistributionRateParams = FunctionArguments<typeof functions.setMinDistributionRate>
export type SetMinDistributionRateReturn = FunctionReturn<typeof functions.setMinDistributionRate>

export type SetMinStakeThresholdParams = FunctionArguments<typeof functions.setMinStakeThreshold>
export type SetMinStakeThresholdReturn = FunctionReturn<typeof functions.setMinStakeThreshold>

export type SetPoolDeploymentOpenParams = FunctionArguments<typeof functions.setPoolDeploymentOpen>
export type SetPoolDeploymentOpenReturn = FunctionReturn<typeof functions.setPoolDeploymentOpen>

export type SetWhitelistFeatureEnabledParams = FunctionArguments<typeof functions.setWhitelistFeatureEnabled>
export type SetWhitelistFeatureEnabledReturn = FunctionReturn<typeof functions.setWhitelistFeatureEnabled>

export type SetWorkerEpochLengthParams = FunctionArguments<typeof functions.setWorkerEpochLength>
export type SetWorkerEpochLengthReturn = FunctionReturn<typeof functions.setWorkerEpochLength>

export type SqdParams = FunctionArguments<typeof functions.sqd>
export type SqdReturn = FunctionReturn<typeof functions.sqd>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpgradeBeaconParams = FunctionArguments<typeof functions.upgradeBeacon>
export type UpgradeBeaconReturn = FunctionReturn<typeof functions.upgradeBeacon>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

export type WhitelistFeatureEnabledParams = FunctionArguments<typeof functions.whitelistFeatureEnabled>
export type WhitelistFeatureEnabledReturn = FunctionReturn<typeof functions.whitelistFeatureEnabled>

export type WorkerEpochLengthParams = FunctionArguments<typeof functions.workerEpochLength>
export type WorkerEpochLengthReturn = FunctionReturn<typeof functions.workerEpochLength>

