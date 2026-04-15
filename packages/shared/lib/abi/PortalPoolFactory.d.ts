import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    BeaconUpgraded: import("@subsquid/evm-abi").AbiEvent<{
        readonly newImplementation: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    CollectionDeadlineUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
    DefaultMaxStakePerWalletUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
    DefaultWhitelistEnabledUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<boolean, boolean>;
        readonly newValue: p.Codec<boolean, boolean>;
    }>;
    ExitUnlockRateUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
    FeeRouterUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly newValue: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    Initialized: import("@subsquid/evm-abi").AbiEvent<{
        readonly version: p.Codec<number | bigint, bigint>;
    }>;
    MaxDistributionRateUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
    MaxPaymentTokensUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
    MinDistributionRateUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
    MinStakeThresholdUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
    Paused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    PaymentTokenAdded: import("@subsquid/evm-abi").AbiEvent<{
        readonly token: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    PaymentTokenRemoved: import("@subsquid/evm-abi").AbiEvent<{
        readonly token: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    PoolCreated: import("@subsquid/evm-abi").AbiEvent<{
        readonly portal: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly operator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly rewardToken: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly capacity: p.Codec<number | bigint, bigint>;
        readonly distributionRatePerSecond: p.Codec<number | bigint, bigint>;
        readonly initialDeposit: p.Codec<number | bigint, bigint>;
        readonly tokenSuffix: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>;
    PoolDeploymentOpenUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<boolean, boolean>;
        readonly newValue: p.Codec<boolean, boolean>;
    }>;
    RoleAdminChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly role: {
            encode: (sink: p.Sink, val: string | Uint8Array) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly previousAdminRole: {
            encode: (sink: p.Sink, val: string | Uint8Array) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly newAdminRole: {
            encode: (sink: p.Sink, val: string | Uint8Array) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    RoleGranted: import("@subsquid/evm-abi").AbiEvent<{
        readonly role: {
            encode: (sink: p.Sink, val: string | Uint8Array) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly account: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly sender: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    RoleRevoked: import("@subsquid/evm-abi").AbiEvent<{
        readonly role: {
            encode: (sink: p.Sink, val: string | Uint8Array) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly account: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly sender: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    Unpaused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    Upgraded: import("@subsquid/evm-abi").AbiEvent<{
        readonly implementation: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    WhitelistFeatureEnabledUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<boolean, boolean>;
        readonly newValue: p.Codec<boolean, boolean>;
    }>;
    WorkerEpochLengthUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldValue: p.Codec<number | bigint, bigint>;
        readonly newValue: p.Codec<number | bigint, bigint>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PAUSER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    POOL_DEPLOYER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    UPGRADE_INTERFACE_VERSION: import("@subsquid/evm-abi").AbiFunction<{}, {
        readonly encode: (sink: p.Sink, val: string) => void;
        readonly decode: (src: p.Src) => string;
        readonly isDynamic: true;
        readonly baseType: "string";
    }>;
    addPaymentToken: import("@subsquid/evm-abi").AbiFunction<{
        readonly token: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    allPortals: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<number | bigint, bigint>;
    }, p.Codec<string, string>>;
    beacon: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    collectionDeadlineSeconds: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    createPortalPool: import("@subsquid/evm-abi").AbiFunction<{
        readonly params: import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
            readonly operator: p.Codec<string, string>;
            readonly capacity: p.Codec<number | bigint, bigint>;
            readonly tokenSuffix: {
                readonly encode: (sink: p.Sink, val: string) => void;
                readonly decode: (src: p.Src) => string;
                readonly isDynamic: true;
                readonly baseType: "string";
            };
            readonly distributionRatePerSecond: p.Codec<number | bigint, bigint>;
            readonly initialDeposit: p.Codec<number | bigint, bigint>;
            readonly metadata: {
                readonly encode: (sink: p.Sink, val: string) => void;
                readonly decode: (src: p.Src) => string;
                readonly isDynamic: true;
                readonly baseType: "string";
            };
            readonly rewardToken: p.Codec<string, string>;
        }>;
    }, p.Codec<string, string>>;
    defaultMaxStakePerWallet: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    defaultWhitelistEnabled: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    exitUnlockRatePerSecond: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    feeRouter: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    getAllowedPaymentTokens: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string[], string[]>>;
    getMinCapacity: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getOperatorPortals: import("@subsquid/evm-abi").AbiFunction<{
        readonly operator: p.Codec<string, string>;
    }, p.Codec<string[], string[]>>;
    getOperatorPortalsPaginated: import("@subsquid/evm-abi").AbiFunction<{
        readonly operator: p.Codec<string, string>;
        readonly offset: p.Codec<number | bigint, bigint>;
        readonly limit: p.Codec<number | bigint, bigint>;
    }, p.Codec<string[], string[]>>;
    getPortalCount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getRoleAdmin: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
    }, p.Codec<string | Uint8Array, string>>;
    grantRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    hasRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    initialize: import("@subsquid/evm-abi").AbiFunction<{
        readonly _implementation: p.Codec<string, string>;
        readonly _portalRegistry: p.Codec<string, string>;
        readonly _feeRouter: p.Codec<string, string>;
        readonly _sqd: p.Codec<string, string>;
        readonly _defaultMaxStakePerWallet: p.Codec<number | bigint, bigint>;
        readonly _minStakeThreshold: p.Codec<number | bigint, bigint>;
        readonly _workerEpochLength: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    isAllowedPaymentToken: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    isPortal: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    maxDistributionRatePerSecond: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    maxPaymentTokens: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    minDistributionRatePerSecond: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    minStakeThreshold: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    operatorPortalCount: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    operatorPortalPools: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
        readonly _1: p.Codec<number | bigint, bigint>;
    }, p.Codec<string, string>>;
    pause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    paused: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    paymentTokensList: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<number | bigint, bigint>;
    }, p.Codec<string, string>>;
    poolDeploymentOpen: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    portalCount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    portalRegistry: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    proxiableUUID: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    removePaymentToken: import("@subsquid/evm-abi").AbiFunction<{
        readonly token: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setCollectionDeadline: import("@subsquid/evm-abi").AbiFunction<{
        readonly seconds_: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setDefaultMaxStakePerWallet: import("@subsquid/evm-abi").AbiFunction<{
        readonly _maxStake: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setDefaultWhitelistEnabled: import("@subsquid/evm-abi").AbiFunction<{
        readonly enabled: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setExitUnlockRate: import("@subsquid/evm-abi").AbiFunction<{
        readonly ratePerSecond: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setFeeRouter: import("@subsquid/evm-abi").AbiFunction<{
        readonly _feeRouter: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMaxDistributionRate: import("@subsquid/evm-abi").AbiFunction<{
        readonly ratePerSecond: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMaxPaymentTokens: import("@subsquid/evm-abi").AbiFunction<{
        readonly value: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMinDistributionRate: import("@subsquid/evm-abi").AbiFunction<{
        readonly ratePerSecond: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMinStakeThreshold: import("@subsquid/evm-abi").AbiFunction<{
        readonly _minStakeThreshold: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setPoolDeploymentOpen: import("@subsquid/evm-abi").AbiFunction<{
        readonly open: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setWhitelistFeatureEnabled: import("@subsquid/evm-abi").AbiFunction<{
        readonly enabled: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setWorkerEpochLength: import("@subsquid/evm-abi").AbiFunction<{
        readonly _workerEpochLength: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    sqd: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    upgradeBeacon: import("@subsquid/evm-abi").AbiFunction<{
        readonly newImplementation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    upgradeToAndCall: import("@subsquid/evm-abi").AbiFunction<{
        readonly newImplementation: p.Codec<string, string>;
        readonly data: p.Codec<string | Uint8Array, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    whitelistFeatureEnabled: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    workerEpochLength: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    PAUSER_ROLE(): Promise<string>;
    POOL_DEPLOYER_ROLE(): Promise<string>;
    UPGRADE_INTERFACE_VERSION(): Promise<string>;
    allPortals(_0: AllPortalsParams["_0"]): Promise<string>;
    beacon(): Promise<string>;
    collectionDeadlineSeconds(): Promise<bigint>;
    defaultMaxStakePerWallet(): Promise<bigint>;
    defaultWhitelistEnabled(): Promise<boolean>;
    exitUnlockRatePerSecond(): Promise<bigint>;
    feeRouter(): Promise<string>;
    getAllowedPaymentTokens(): Promise<string[]>;
    getMinCapacity(): Promise<bigint>;
    getOperatorPortals(operator: GetOperatorPortalsParams["operator"]): Promise<string[]>;
    getOperatorPortalsPaginated(operator: GetOperatorPortalsPaginatedParams["operator"], offset: GetOperatorPortalsPaginatedParams["offset"], limit: GetOperatorPortalsPaginatedParams["limit"]): Promise<string[]>;
    getPortalCount(): Promise<bigint>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    isAllowedPaymentToken(_0: IsAllowedPaymentTokenParams["_0"]): Promise<boolean>;
    isPortal(_0: IsPortalParams["_0"]): Promise<boolean>;
    maxDistributionRatePerSecond(): Promise<bigint>;
    maxPaymentTokens(): Promise<bigint>;
    minDistributionRatePerSecond(): Promise<bigint>;
    minStakeThreshold(): Promise<bigint>;
    operatorPortalCount(_0: OperatorPortalCountParams["_0"]): Promise<bigint>;
    operatorPortalPools(_0: OperatorPortalPoolsParams["_0"], _1: OperatorPortalPoolsParams["_1"]): Promise<string>;
    paused(): Promise<boolean>;
    paymentTokensList(_0: PaymentTokensListParams["_0"]): Promise<string>;
    poolDeploymentOpen(): Promise<boolean>;
    portalCount(): Promise<bigint>;
    portalRegistry(): Promise<string>;
    proxiableUUID(): Promise<string>;
    sqd(): Promise<string>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    whitelistFeatureEnabled(): Promise<boolean>;
    workerEpochLength(): Promise<bigint>;
}
export type BeaconUpgradedEventArgs = EParams<typeof events.BeaconUpgraded>;
export type CollectionDeadlineUpdatedEventArgs = EParams<typeof events.CollectionDeadlineUpdated>;
export type DefaultMaxStakePerWalletUpdatedEventArgs = EParams<typeof events.DefaultMaxStakePerWalletUpdated>;
export type DefaultWhitelistEnabledUpdatedEventArgs = EParams<typeof events.DefaultWhitelistEnabledUpdated>;
export type ExitUnlockRateUpdatedEventArgs = EParams<typeof events.ExitUnlockRateUpdated>;
export type FeeRouterUpdatedEventArgs = EParams<typeof events.FeeRouterUpdated>;
export type InitializedEventArgs = EParams<typeof events.Initialized>;
export type MaxDistributionRateUpdatedEventArgs = EParams<typeof events.MaxDistributionRateUpdated>;
export type MaxPaymentTokensUpdatedEventArgs = EParams<typeof events.MaxPaymentTokensUpdated>;
export type MinDistributionRateUpdatedEventArgs = EParams<typeof events.MinDistributionRateUpdated>;
export type MinStakeThresholdUpdatedEventArgs = EParams<typeof events.MinStakeThresholdUpdated>;
export type PausedEventArgs = EParams<typeof events.Paused>;
export type PaymentTokenAddedEventArgs = EParams<typeof events.PaymentTokenAdded>;
export type PaymentTokenRemovedEventArgs = EParams<typeof events.PaymentTokenRemoved>;
export type PoolCreatedEventArgs = EParams<typeof events.PoolCreated>;
export type PoolDeploymentOpenUpdatedEventArgs = EParams<typeof events.PoolDeploymentOpenUpdated>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type UpgradedEventArgs = EParams<typeof events.Upgraded>;
export type WhitelistFeatureEnabledUpdatedEventArgs = EParams<typeof events.WhitelistFeatureEnabledUpdated>;
export type WorkerEpochLengthUpdatedEventArgs = EParams<typeof events.WorkerEpochLengthUpdated>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>;
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>;
export type POOL_DEPLOYER_ROLEParams = FunctionArguments<typeof functions.POOL_DEPLOYER_ROLE>;
export type POOL_DEPLOYER_ROLEReturn = FunctionReturn<typeof functions.POOL_DEPLOYER_ROLE>;
export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>;
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>;
export type AddPaymentTokenParams = FunctionArguments<typeof functions.addPaymentToken>;
export type AddPaymentTokenReturn = FunctionReturn<typeof functions.addPaymentToken>;
export type AllPortalsParams = FunctionArguments<typeof functions.allPortals>;
export type AllPortalsReturn = FunctionReturn<typeof functions.allPortals>;
export type BeaconParams = FunctionArguments<typeof functions.beacon>;
export type BeaconReturn = FunctionReturn<typeof functions.beacon>;
export type CollectionDeadlineSecondsParams = FunctionArguments<typeof functions.collectionDeadlineSeconds>;
export type CollectionDeadlineSecondsReturn = FunctionReturn<typeof functions.collectionDeadlineSeconds>;
export type CreatePortalPoolParams = FunctionArguments<typeof functions.createPortalPool>;
export type CreatePortalPoolReturn = FunctionReturn<typeof functions.createPortalPool>;
export type DefaultMaxStakePerWalletParams = FunctionArguments<typeof functions.defaultMaxStakePerWallet>;
export type DefaultMaxStakePerWalletReturn = FunctionReturn<typeof functions.defaultMaxStakePerWallet>;
export type DefaultWhitelistEnabledParams = FunctionArguments<typeof functions.defaultWhitelistEnabled>;
export type DefaultWhitelistEnabledReturn = FunctionReturn<typeof functions.defaultWhitelistEnabled>;
export type ExitUnlockRatePerSecondParams = FunctionArguments<typeof functions.exitUnlockRatePerSecond>;
export type ExitUnlockRatePerSecondReturn = FunctionReturn<typeof functions.exitUnlockRatePerSecond>;
export type FeeRouterParams = FunctionArguments<typeof functions.feeRouter>;
export type FeeRouterReturn = FunctionReturn<typeof functions.feeRouter>;
export type GetAllowedPaymentTokensParams = FunctionArguments<typeof functions.getAllowedPaymentTokens>;
export type GetAllowedPaymentTokensReturn = FunctionReturn<typeof functions.getAllowedPaymentTokens>;
export type GetMinCapacityParams = FunctionArguments<typeof functions.getMinCapacity>;
export type GetMinCapacityReturn = FunctionReturn<typeof functions.getMinCapacity>;
export type GetOperatorPortalsParams = FunctionArguments<typeof functions.getOperatorPortals>;
export type GetOperatorPortalsReturn = FunctionReturn<typeof functions.getOperatorPortals>;
export type GetOperatorPortalsPaginatedParams = FunctionArguments<typeof functions.getOperatorPortalsPaginated>;
export type GetOperatorPortalsPaginatedReturn = FunctionReturn<typeof functions.getOperatorPortalsPaginated>;
export type GetPortalCountParams = FunctionArguments<typeof functions.getPortalCount>;
export type GetPortalCountReturn = FunctionReturn<typeof functions.getPortalCount>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type InitializeParams = FunctionArguments<typeof functions.initialize>;
export type InitializeReturn = FunctionReturn<typeof functions.initialize>;
export type IsAllowedPaymentTokenParams = FunctionArguments<typeof functions.isAllowedPaymentToken>;
export type IsAllowedPaymentTokenReturn = FunctionReturn<typeof functions.isAllowedPaymentToken>;
export type IsPortalParams = FunctionArguments<typeof functions.isPortal>;
export type IsPortalReturn = FunctionReturn<typeof functions.isPortal>;
export type MaxDistributionRatePerSecondParams = FunctionArguments<typeof functions.maxDistributionRatePerSecond>;
export type MaxDistributionRatePerSecondReturn = FunctionReturn<typeof functions.maxDistributionRatePerSecond>;
export type MaxPaymentTokensParams = FunctionArguments<typeof functions.maxPaymentTokens>;
export type MaxPaymentTokensReturn = FunctionReturn<typeof functions.maxPaymentTokens>;
export type MinDistributionRatePerSecondParams = FunctionArguments<typeof functions.minDistributionRatePerSecond>;
export type MinDistributionRatePerSecondReturn = FunctionReturn<typeof functions.minDistributionRatePerSecond>;
export type MinStakeThresholdParams = FunctionArguments<typeof functions.minStakeThreshold>;
export type MinStakeThresholdReturn = FunctionReturn<typeof functions.minStakeThreshold>;
export type OperatorPortalCountParams = FunctionArguments<typeof functions.operatorPortalCount>;
export type OperatorPortalCountReturn = FunctionReturn<typeof functions.operatorPortalCount>;
export type OperatorPortalPoolsParams = FunctionArguments<typeof functions.operatorPortalPools>;
export type OperatorPortalPoolsReturn = FunctionReturn<typeof functions.operatorPortalPools>;
export type PauseParams = FunctionArguments<typeof functions.pause>;
export type PauseReturn = FunctionReturn<typeof functions.pause>;
export type PausedParams = FunctionArguments<typeof functions.paused>;
export type PausedReturn = FunctionReturn<typeof functions.paused>;
export type PaymentTokensListParams = FunctionArguments<typeof functions.paymentTokensList>;
export type PaymentTokensListReturn = FunctionReturn<typeof functions.paymentTokensList>;
export type PoolDeploymentOpenParams = FunctionArguments<typeof functions.poolDeploymentOpen>;
export type PoolDeploymentOpenReturn = FunctionReturn<typeof functions.poolDeploymentOpen>;
export type PortalCountParams = FunctionArguments<typeof functions.portalCount>;
export type PortalCountReturn = FunctionReturn<typeof functions.portalCount>;
export type PortalRegistryParams = FunctionArguments<typeof functions.portalRegistry>;
export type PortalRegistryReturn = FunctionReturn<typeof functions.portalRegistry>;
export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>;
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>;
export type RemovePaymentTokenParams = FunctionArguments<typeof functions.removePaymentToken>;
export type RemovePaymentTokenReturn = FunctionReturn<typeof functions.removePaymentToken>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type SetCollectionDeadlineParams = FunctionArguments<typeof functions.setCollectionDeadline>;
export type SetCollectionDeadlineReturn = FunctionReturn<typeof functions.setCollectionDeadline>;
export type SetDefaultMaxStakePerWalletParams = FunctionArguments<typeof functions.setDefaultMaxStakePerWallet>;
export type SetDefaultMaxStakePerWalletReturn = FunctionReturn<typeof functions.setDefaultMaxStakePerWallet>;
export type SetDefaultWhitelistEnabledParams = FunctionArguments<typeof functions.setDefaultWhitelistEnabled>;
export type SetDefaultWhitelistEnabledReturn = FunctionReturn<typeof functions.setDefaultWhitelistEnabled>;
export type SetExitUnlockRateParams = FunctionArguments<typeof functions.setExitUnlockRate>;
export type SetExitUnlockRateReturn = FunctionReturn<typeof functions.setExitUnlockRate>;
export type SetFeeRouterParams = FunctionArguments<typeof functions.setFeeRouter>;
export type SetFeeRouterReturn = FunctionReturn<typeof functions.setFeeRouter>;
export type SetMaxDistributionRateParams = FunctionArguments<typeof functions.setMaxDistributionRate>;
export type SetMaxDistributionRateReturn = FunctionReturn<typeof functions.setMaxDistributionRate>;
export type SetMaxPaymentTokensParams = FunctionArguments<typeof functions.setMaxPaymentTokens>;
export type SetMaxPaymentTokensReturn = FunctionReturn<typeof functions.setMaxPaymentTokens>;
export type SetMinDistributionRateParams = FunctionArguments<typeof functions.setMinDistributionRate>;
export type SetMinDistributionRateReturn = FunctionReturn<typeof functions.setMinDistributionRate>;
export type SetMinStakeThresholdParams = FunctionArguments<typeof functions.setMinStakeThreshold>;
export type SetMinStakeThresholdReturn = FunctionReturn<typeof functions.setMinStakeThreshold>;
export type SetPoolDeploymentOpenParams = FunctionArguments<typeof functions.setPoolDeploymentOpen>;
export type SetPoolDeploymentOpenReturn = FunctionReturn<typeof functions.setPoolDeploymentOpen>;
export type SetWhitelistFeatureEnabledParams = FunctionArguments<typeof functions.setWhitelistFeatureEnabled>;
export type SetWhitelistFeatureEnabledReturn = FunctionReturn<typeof functions.setWhitelistFeatureEnabled>;
export type SetWorkerEpochLengthParams = FunctionArguments<typeof functions.setWorkerEpochLength>;
export type SetWorkerEpochLengthReturn = FunctionReturn<typeof functions.setWorkerEpochLength>;
export type SqdParams = FunctionArguments<typeof functions.sqd>;
export type SqdReturn = FunctionReturn<typeof functions.sqd>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
export type UpgradeBeaconParams = FunctionArguments<typeof functions.upgradeBeacon>;
export type UpgradeBeaconReturn = FunctionReturn<typeof functions.upgradeBeacon>;
export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>;
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>;
export type WhitelistFeatureEnabledParams = FunctionArguments<typeof functions.whitelistFeatureEnabled>;
export type WhitelistFeatureEnabledReturn = FunctionReturn<typeof functions.whitelistFeatureEnabled>;
export type WorkerEpochLengthParams = FunctionArguments<typeof functions.workerEpochLength>;
export type WorkerEpochLengthReturn = FunctionReturn<typeof functions.workerEpochLength>;
