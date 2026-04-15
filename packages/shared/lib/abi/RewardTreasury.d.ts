import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    Claimed: import("@subsquid/evm-abi").AbiEvent<{
        readonly by: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly receiver: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    Paused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
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
    WhitelistedDistributorSet: import("@subsquid/evm-abi").AbiEvent<{
        readonly distributor: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly isWhitelisted: p.Codec<boolean, boolean>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PAUSER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    claim: import("@subsquid/evm-abi").AbiFunction<{
        readonly rewardDistribution: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    claimFor: import("@subsquid/evm-abi").AbiFunction<{
        readonly rewardDistribution: p.Codec<string, string>;
        readonly receiver: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    claimable: import("@subsquid/evm-abi").AbiFunction<{
        readonly rewardDistribution: p.Codec<string, string>;
        readonly sender: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
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
    isWhitelistedDistributor: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    pause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    paused: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    reclaimFunds: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    rewardToken: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    setWhitelistedDistributor: import("@subsquid/evm-abi").AbiFunction<{
        readonly distributor: p.Codec<string, string>;
        readonly isWhitelisted: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    PAUSER_ROLE(): Promise<string>;
    claimable(rewardDistribution: ClaimableParams["rewardDistribution"], sender: ClaimableParams["sender"]): Promise<bigint>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    isWhitelistedDistributor(_0: IsWhitelistedDistributorParams["_0"]): Promise<boolean>;
    paused(): Promise<boolean>;
    rewardToken(): Promise<string>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
}
export type ClaimedEventArgs = EParams<typeof events.Claimed>;
export type PausedEventArgs = EParams<typeof events.Paused>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type WhitelistedDistributorSetEventArgs = EParams<typeof events.WhitelistedDistributorSet>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>;
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>;
export type ClaimParams = FunctionArguments<typeof functions.claim>;
export type ClaimReturn = FunctionReturn<typeof functions.claim>;
export type ClaimForParams = FunctionArguments<typeof functions.claimFor>;
export type ClaimForReturn = FunctionReturn<typeof functions.claimFor>;
export type ClaimableParams = FunctionArguments<typeof functions.claimable>;
export type ClaimableReturn = FunctionReturn<typeof functions.claimable>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type IsWhitelistedDistributorParams = FunctionArguments<typeof functions.isWhitelistedDistributor>;
export type IsWhitelistedDistributorReturn = FunctionReturn<typeof functions.isWhitelistedDistributor>;
export type PauseParams = FunctionArguments<typeof functions.pause>;
export type PauseReturn = FunctionReturn<typeof functions.pause>;
export type PausedParams = FunctionArguments<typeof functions.paused>;
export type PausedReturn = FunctionReturn<typeof functions.paused>;
export type ReclaimFundsParams = FunctionArguments<typeof functions.reclaimFunds>;
export type ReclaimFundsReturn = FunctionReturn<typeof functions.reclaimFunds>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>;
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>;
export type SetWhitelistedDistributorParams = FunctionArguments<typeof functions.setWhitelistedDistributor>;
export type SetWhitelistedDistributorReturn = FunctionReturn<typeof functions.setWhitelistedDistributor>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
