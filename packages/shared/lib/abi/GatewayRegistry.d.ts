import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    AllocatedCUs: import("@subsquid/evm-abi").AbiEvent<{
        readonly gateway: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly workerIds: p.Codec<(number | bigint)[], bigint[]>;
        readonly shares: p.Codec<(number | bigint)[], bigint[]>;
    }>;
    AutoextensionDisabled: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly lockEnd: p.Codec<number | bigint, bigint>;
    }>;
    AutoextensionEnabled: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    AverageBlockTimeChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly newBlockTime: p.Codec<number | bigint, bigint>;
    }>;
    DefaultStrategyChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly strategy: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    GatewayAddressChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly newAddress: p.Codec<string, string>;
    }>;
    Initialized: import("@subsquid/evm-abi").AbiEvent<{
        readonly version: p.Codec<number | bigint, bigint>;
    }>;
    ManaChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly newCuPerSQD: p.Codec<number | bigint, bigint>;
    }>;
    MaxGatewaysPerClusterChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly newAmount: p.Codec<number | bigint, bigint>;
    }>;
    MetadataChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>;
    MinStakeChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly newAmount: p.Codec<number | bigint, bigint>;
    }>;
    Paused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    Registered: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly id: {
            encode: (sink: p.Sink, val: string | Uint8Array) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly peerId: p.Codec<string | Uint8Array, string>;
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
    Staked: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly lockStart: p.Codec<number | bigint, bigint>;
        readonly lockEnd: p.Codec<number | bigint, bigint>;
        readonly computationUnits: p.Codec<number | bigint, bigint>;
    }>;
    StrategyAllowed: import("@subsquid/evm-abi").AbiEvent<{
        readonly strategy: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly isAllowed: p.Codec<boolean, boolean>;
    }>;
    Unpaused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    Unregistered: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }>;
    Unstaked: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    UsedStrategyChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly gatewayOperator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly strategy: p.Codec<string, string>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PAUSER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    addStake: import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    allocateComputationUnits: import("@subsquid/evm-abi").AbiFunction<{
        readonly workerIds: p.Codec<(number | bigint)[], bigint[]>;
        readonly cus: p.Codec<(number | bigint)[], bigint[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    averageBlockTime: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    canUnstake: import("@subsquid/evm-abi").AbiFunction<{
        readonly operator: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    computationUnitsAmount: import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly durationBlocks: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    computationUnitsAvailable: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<number | bigint, bigint>>;
    defaultStrategy: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    disableAutoExtension: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    enableAutoExtension: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    gatewayByAddress: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<string | Uint8Array, string>>;
    getActiveGateways: import("@subsquid/evm-abi").AbiFunction<{
        readonly pageNumber: p.Codec<number | bigint, bigint>;
        readonly perPage: p.Codec<number | bigint, bigint>;
    }, p.Codec<(string | Uint8Array)[], string[]>>;
    getActiveGatewaysCount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getCluster: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<(string | Uint8Array)[], string[]>>;
    getGateway: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
        readonly operator: p.Codec<string, string>;
        readonly ownAddress: p.Codec<string, string>;
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>>;
    getMetadata: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, {
        readonly encode: (sink: p.Sink, val: string) => void;
        readonly decode: (src: p.Src) => string;
        readonly isDynamic: true;
        readonly baseType: "string";
    }>;
    getMyGateways: import("@subsquid/evm-abi").AbiFunction<{
        readonly operator: p.Codec<string, string>;
    }, p.Codec<(string | Uint8Array)[], string[]>>;
    getRoleAdmin: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
    }, p.Codec<string | Uint8Array, string>>;
    getStake: import("@subsquid/evm-abi").AbiFunction<{
        readonly operator: p.Codec<string, string>;
    }, import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly lockStart: p.Codec<number | bigint, bigint>;
        readonly lockEnd: p.Codec<number | bigint, bigint>;
        readonly duration: p.Codec<number | bigint, bigint>;
        readonly autoExtension: p.Codec<boolean, boolean>;
        readonly oldCUs: p.Codec<number | bigint, bigint>;
    }>>;
    getUsedStrategy: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<string, string>>;
    grantRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    hasRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    initialize: import("@subsquid/evm-abi").AbiFunction<{
        readonly _token: p.Codec<string, string>;
        readonly _router: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    isStrategyAllowed: import("@subsquid/evm-abi").AbiFunction<{
        readonly strategy: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    mana: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    maxGatewaysPerCluster: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    minStake: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    pause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    paused: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    'register(bytes)': import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'register(bytes,string,address)': import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly gatewayAddress: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'register(bytes,string)': import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }, p.Struct | p.Codec<any, any> | undefined>;
    'register(bytes[],string[],address[])': import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<(string | Uint8Array)[], string[]>;
        readonly metadata: p.Codec<string[], string[]>;
        readonly gatewayAddress: p.Codec<string[], string[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    router: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    setAverageBlockTime: import("@subsquid/evm-abi").AbiFunction<{
        readonly _newAverageBlockTime: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setGatewayAddress: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly newAddress: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setIsStrategyAllowed: import("@subsquid/evm-abi").AbiFunction<{
        readonly strategy: p.Codec<string, string>;
        readonly isAllowed: p.Codec<boolean, boolean>;
        readonly isDefault: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMana: import("@subsquid/evm-abi").AbiFunction<{
        readonly _newMana: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMaxGatewaysPerCluster: import("@subsquid/evm-abi").AbiFunction<{
        readonly _maxGatewaysPerCluster: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMetadata: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMinStake: import("@subsquid/evm-abi").AbiFunction<{
        readonly _minStake: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'stake(uint256,uint128)': import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly durationBlocks: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'stake(uint256,uint128,bool)': import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly durationBlocks: p.Codec<number | bigint, bigint>;
        readonly withAutoExtension: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    staked: import("@subsquid/evm-abi").AbiFunction<{
        readonly operator: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    token: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    'unregister(bytes)': import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'unregister(bytes[])': import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<(string | Uint8Array)[], string[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    unstake: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    useStrategy: import("@subsquid/evm-abi").AbiFunction<{
        readonly strategy: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    PAUSER_ROLE(): Promise<string>;
    averageBlockTime(): Promise<bigint>;
    canUnstake(operator: CanUnstakeParams["operator"]): Promise<boolean>;
    computationUnitsAmount(amount: ComputationUnitsAmountParams["amount"], durationBlocks: ComputationUnitsAmountParams["durationBlocks"]): Promise<bigint>;
    computationUnitsAvailable(peerId: ComputationUnitsAvailableParams["peerId"]): Promise<bigint>;
    defaultStrategy(): Promise<string>;
    gatewayByAddress(_0: GatewayByAddressParams["_0"]): Promise<string>;
    getActiveGateways(pageNumber: GetActiveGatewaysParams["pageNumber"], perPage: GetActiveGatewaysParams["perPage"]): Promise<string[]>;
    getActiveGatewaysCount(): Promise<bigint>;
    getCluster(peerId: GetClusterParams["peerId"]): Promise<string[]>;
    getGateway(peerId: GetGatewayParams["peerId"]): Promise<{
        readonly operator: string;
        readonly ownAddress: string;
        readonly peerId: string;
        readonly metadata: string;
    }>;
    getMetadata(peerId: GetMetadataParams["peerId"]): Promise<string>;
    getMyGateways(operator: GetMyGatewaysParams["operator"]): Promise<string[]>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    getStake(operator: GetStakeParams["operator"]): Promise<{
        readonly amount: bigint;
        readonly lockStart: bigint;
        readonly lockEnd: bigint;
        readonly duration: bigint;
        readonly autoExtension: boolean;
        readonly oldCUs: bigint;
    }>;
    getUsedStrategy(peerId: GetUsedStrategyParams["peerId"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    isStrategyAllowed(strategy: IsStrategyAllowedParams["strategy"]): Promise<boolean>;
    mana(): Promise<bigint>;
    maxGatewaysPerCluster(): Promise<bigint>;
    minStake(): Promise<bigint>;
    paused(): Promise<boolean>;
    router(): Promise<string>;
    staked(operator: StakedParams["operator"]): Promise<bigint>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    token(): Promise<string>;
}
export type AllocatedCUsEventArgs = EParams<typeof events.AllocatedCUs>;
export type AutoextensionDisabledEventArgs = EParams<typeof events.AutoextensionDisabled>;
export type AutoextensionEnabledEventArgs = EParams<typeof events.AutoextensionEnabled>;
export type AverageBlockTimeChangedEventArgs = EParams<typeof events.AverageBlockTimeChanged>;
export type DefaultStrategyChangedEventArgs = EParams<typeof events.DefaultStrategyChanged>;
export type GatewayAddressChangedEventArgs = EParams<typeof events.GatewayAddressChanged>;
export type InitializedEventArgs = EParams<typeof events.Initialized>;
export type ManaChangedEventArgs = EParams<typeof events.ManaChanged>;
export type MaxGatewaysPerClusterChangedEventArgs = EParams<typeof events.MaxGatewaysPerClusterChanged>;
export type MetadataChangedEventArgs = EParams<typeof events.MetadataChanged>;
export type MinStakeChangedEventArgs = EParams<typeof events.MinStakeChanged>;
export type PausedEventArgs = EParams<typeof events.Paused>;
export type RegisteredEventArgs = EParams<typeof events.Registered>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type StakedEventArgs = EParams<typeof events.Staked>;
export type StrategyAllowedEventArgs = EParams<typeof events.StrategyAllowed>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type UnregisteredEventArgs = EParams<typeof events.Unregistered>;
export type UnstakedEventArgs = EParams<typeof events.Unstaked>;
export type UsedStrategyChangedEventArgs = EParams<typeof events.UsedStrategyChanged>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>;
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>;
export type AddStakeParams = FunctionArguments<typeof functions.addStake>;
export type AddStakeReturn = FunctionReturn<typeof functions.addStake>;
export type AllocateComputationUnitsParams = FunctionArguments<typeof functions.allocateComputationUnits>;
export type AllocateComputationUnitsReturn = FunctionReturn<typeof functions.allocateComputationUnits>;
export type AverageBlockTimeParams = FunctionArguments<typeof functions.averageBlockTime>;
export type AverageBlockTimeReturn = FunctionReturn<typeof functions.averageBlockTime>;
export type CanUnstakeParams = FunctionArguments<typeof functions.canUnstake>;
export type CanUnstakeReturn = FunctionReturn<typeof functions.canUnstake>;
export type ComputationUnitsAmountParams = FunctionArguments<typeof functions.computationUnitsAmount>;
export type ComputationUnitsAmountReturn = FunctionReturn<typeof functions.computationUnitsAmount>;
export type ComputationUnitsAvailableParams = FunctionArguments<typeof functions.computationUnitsAvailable>;
export type ComputationUnitsAvailableReturn = FunctionReturn<typeof functions.computationUnitsAvailable>;
export type DefaultStrategyParams = FunctionArguments<typeof functions.defaultStrategy>;
export type DefaultStrategyReturn = FunctionReturn<typeof functions.defaultStrategy>;
export type DisableAutoExtensionParams = FunctionArguments<typeof functions.disableAutoExtension>;
export type DisableAutoExtensionReturn = FunctionReturn<typeof functions.disableAutoExtension>;
export type EnableAutoExtensionParams = FunctionArguments<typeof functions.enableAutoExtension>;
export type EnableAutoExtensionReturn = FunctionReturn<typeof functions.enableAutoExtension>;
export type GatewayByAddressParams = FunctionArguments<typeof functions.gatewayByAddress>;
export type GatewayByAddressReturn = FunctionReturn<typeof functions.gatewayByAddress>;
export type GetActiveGatewaysParams = FunctionArguments<typeof functions.getActiveGateways>;
export type GetActiveGatewaysReturn = FunctionReturn<typeof functions.getActiveGateways>;
export type GetActiveGatewaysCountParams = FunctionArguments<typeof functions.getActiveGatewaysCount>;
export type GetActiveGatewaysCountReturn = FunctionReturn<typeof functions.getActiveGatewaysCount>;
export type GetClusterParams = FunctionArguments<typeof functions.getCluster>;
export type GetClusterReturn = FunctionReturn<typeof functions.getCluster>;
export type GetGatewayParams = FunctionArguments<typeof functions.getGateway>;
export type GetGatewayReturn = FunctionReturn<typeof functions.getGateway>;
export type GetMetadataParams = FunctionArguments<typeof functions.getMetadata>;
export type GetMetadataReturn = FunctionReturn<typeof functions.getMetadata>;
export type GetMyGatewaysParams = FunctionArguments<typeof functions.getMyGateways>;
export type GetMyGatewaysReturn = FunctionReturn<typeof functions.getMyGateways>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GetStakeParams = FunctionArguments<typeof functions.getStake>;
export type GetStakeReturn = FunctionReturn<typeof functions.getStake>;
export type GetUsedStrategyParams = FunctionArguments<typeof functions.getUsedStrategy>;
export type GetUsedStrategyReturn = FunctionReturn<typeof functions.getUsedStrategy>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type InitializeParams = FunctionArguments<typeof functions.initialize>;
export type InitializeReturn = FunctionReturn<typeof functions.initialize>;
export type IsStrategyAllowedParams = FunctionArguments<typeof functions.isStrategyAllowed>;
export type IsStrategyAllowedReturn = FunctionReturn<typeof functions.isStrategyAllowed>;
export type ManaParams = FunctionArguments<typeof functions.mana>;
export type ManaReturn = FunctionReturn<typeof functions.mana>;
export type MaxGatewaysPerClusterParams = FunctionArguments<typeof functions.maxGatewaysPerCluster>;
export type MaxGatewaysPerClusterReturn = FunctionReturn<typeof functions.maxGatewaysPerCluster>;
export type MinStakeParams = FunctionArguments<typeof functions.minStake>;
export type MinStakeReturn = FunctionReturn<typeof functions.minStake>;
export type PauseParams = FunctionArguments<typeof functions.pause>;
export type PauseReturn = FunctionReturn<typeof functions.pause>;
export type PausedParams = FunctionArguments<typeof functions.paused>;
export type PausedReturn = FunctionReturn<typeof functions.paused>;
export type RegisterParams_0 = FunctionArguments<typeof functions['register(bytes)']>;
export type RegisterReturn_0 = FunctionReturn<typeof functions['register(bytes)']>;
export type RegisterParams_1 = FunctionArguments<typeof functions['register(bytes,string,address)']>;
export type RegisterReturn_1 = FunctionReturn<typeof functions['register(bytes,string,address)']>;
export type RegisterParams_2 = FunctionArguments<typeof functions['register(bytes,string)']>;
export type RegisterReturn_2 = FunctionReturn<typeof functions['register(bytes,string)']>;
export type RegisterParams_3 = FunctionArguments<typeof functions['register(bytes[],string[],address[])']>;
export type RegisterReturn_3 = FunctionReturn<typeof functions['register(bytes[],string[],address[])']>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type RouterParams = FunctionArguments<typeof functions.router>;
export type RouterReturn = FunctionReturn<typeof functions.router>;
export type SetAverageBlockTimeParams = FunctionArguments<typeof functions.setAverageBlockTime>;
export type SetAverageBlockTimeReturn = FunctionReturn<typeof functions.setAverageBlockTime>;
export type SetGatewayAddressParams = FunctionArguments<typeof functions.setGatewayAddress>;
export type SetGatewayAddressReturn = FunctionReturn<typeof functions.setGatewayAddress>;
export type SetIsStrategyAllowedParams = FunctionArguments<typeof functions.setIsStrategyAllowed>;
export type SetIsStrategyAllowedReturn = FunctionReturn<typeof functions.setIsStrategyAllowed>;
export type SetManaParams = FunctionArguments<typeof functions.setMana>;
export type SetManaReturn = FunctionReturn<typeof functions.setMana>;
export type SetMaxGatewaysPerClusterParams = FunctionArguments<typeof functions.setMaxGatewaysPerCluster>;
export type SetMaxGatewaysPerClusterReturn = FunctionReturn<typeof functions.setMaxGatewaysPerCluster>;
export type SetMetadataParams = FunctionArguments<typeof functions.setMetadata>;
export type SetMetadataReturn = FunctionReturn<typeof functions.setMetadata>;
export type SetMinStakeParams = FunctionArguments<typeof functions.setMinStake>;
export type SetMinStakeReturn = FunctionReturn<typeof functions.setMinStake>;
export type StakeParams_0 = FunctionArguments<typeof functions['stake(uint256,uint128)']>;
export type StakeReturn_0 = FunctionReturn<typeof functions['stake(uint256,uint128)']>;
export type StakeParams_1 = FunctionArguments<typeof functions['stake(uint256,uint128,bool)']>;
export type StakeReturn_1 = FunctionReturn<typeof functions['stake(uint256,uint128,bool)']>;
export type StakedParams = FunctionArguments<typeof functions.staked>;
export type StakedReturn = FunctionReturn<typeof functions.staked>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type TokenParams = FunctionArguments<typeof functions.token>;
export type TokenReturn = FunctionReturn<typeof functions.token>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
export type UnregisterParams_0 = FunctionArguments<typeof functions['unregister(bytes)']>;
export type UnregisterReturn_0 = FunctionReturn<typeof functions['unregister(bytes)']>;
export type UnregisterParams_1 = FunctionArguments<typeof functions['unregister(bytes[])']>;
export type UnregisterReturn_1 = FunctionReturn<typeof functions['unregister(bytes[])']>;
export type UnstakeParams = FunctionArguments<typeof functions.unstake>;
export type UnstakeReturn = FunctionReturn<typeof functions.unstake>;
export type UseStrategyParams = FunctionArguments<typeof functions.useStrategy>;
export type UseStrategyReturn = FunctionReturn<typeof functions.useStrategy>;
