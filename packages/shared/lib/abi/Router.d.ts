import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    Initialized: import("@subsquid/evm-abi").AbiEvent<{
        readonly version: p.Codec<number | bigint, bigint>;
    }>;
    NetworkControllerSet: import("@subsquid/evm-abi").AbiEvent<{
        readonly networkController: p.Codec<string, string>;
    }>;
    RewardCalculationSet: import("@subsquid/evm-abi").AbiEvent<{
        readonly rewardCalculation: p.Codec<string, string>;
    }>;
    RewardTreasurySet: import("@subsquid/evm-abi").AbiEvent<{
        readonly rewardTreasury: p.Codec<string, string>;
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
    StakingSet: import("@subsquid/evm-abi").AbiEvent<{
        readonly staking: p.Codec<string, string>;
    }>;
    WorkerRegistrationSet: import("@subsquid/evm-abi").AbiEvent<{
        readonly workerRegistration: p.Codec<string, string>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
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
        readonly _workerRegistration: p.Codec<string, string>;
        readonly _staking: p.Codec<string, string>;
        readonly _rewardTreasury: p.Codec<string, string>;
        readonly _networkController: p.Codec<string, string>;
        readonly _rewardCalculation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    networkController: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    rewardCalculation: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    rewardTreasury: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    setNetworkController: import("@subsquid/evm-abi").AbiFunction<{
        readonly _networkController: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setRewardCalculation: import("@subsquid/evm-abi").AbiFunction<{
        readonly _rewardCalculation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setRewardTreasury: import("@subsquid/evm-abi").AbiFunction<{
        readonly _rewardTreasury: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setStaking: import("@subsquid/evm-abi").AbiFunction<{
        readonly _staking: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setWorkerRegistration: import("@subsquid/evm-abi").AbiFunction<{
        readonly _workerRegistration: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    staking: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    workerRegistration: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    networkController(): Promise<string>;
    rewardCalculation(): Promise<string>;
    rewardTreasury(): Promise<string>;
    staking(): Promise<string>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    workerRegistration(): Promise<string>;
}
export type InitializedEventArgs = EParams<typeof events.Initialized>;
export type NetworkControllerSetEventArgs = EParams<typeof events.NetworkControllerSet>;
export type RewardCalculationSetEventArgs = EParams<typeof events.RewardCalculationSet>;
export type RewardTreasurySetEventArgs = EParams<typeof events.RewardTreasurySet>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type StakingSetEventArgs = EParams<typeof events.StakingSet>;
export type WorkerRegistrationSetEventArgs = EParams<typeof events.WorkerRegistrationSet>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type InitializeParams = FunctionArguments<typeof functions.initialize>;
export type InitializeReturn = FunctionReturn<typeof functions.initialize>;
export type NetworkControllerParams = FunctionArguments<typeof functions.networkController>;
export type NetworkControllerReturn = FunctionReturn<typeof functions.networkController>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type RewardCalculationParams = FunctionArguments<typeof functions.rewardCalculation>;
export type RewardCalculationReturn = FunctionReturn<typeof functions.rewardCalculation>;
export type RewardTreasuryParams = FunctionArguments<typeof functions.rewardTreasury>;
export type RewardTreasuryReturn = FunctionReturn<typeof functions.rewardTreasury>;
export type SetNetworkControllerParams = FunctionArguments<typeof functions.setNetworkController>;
export type SetNetworkControllerReturn = FunctionReturn<typeof functions.setNetworkController>;
export type SetRewardCalculationParams = FunctionArguments<typeof functions.setRewardCalculation>;
export type SetRewardCalculationReturn = FunctionReturn<typeof functions.setRewardCalculation>;
export type SetRewardTreasuryParams = FunctionArguments<typeof functions.setRewardTreasury>;
export type SetRewardTreasuryReturn = FunctionReturn<typeof functions.setRewardTreasury>;
export type SetStakingParams = FunctionArguments<typeof functions.setStaking>;
export type SetStakingReturn = FunctionReturn<typeof functions.setStaking>;
export type SetWorkerRegistrationParams = FunctionArguments<typeof functions.setWorkerRegistration>;
export type SetWorkerRegistrationReturn = FunctionReturn<typeof functions.setWorkerRegistration>;
export type StakingParams = FunctionArguments<typeof functions.staking>;
export type StakingReturn = FunctionReturn<typeof functions.staking>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type WorkerRegistrationParams = FunctionArguments<typeof functions.workerRegistration>;
export type WorkerRegistrationReturn = FunctionReturn<typeof functions.workerRegistration>;
