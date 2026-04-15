import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
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
    TemporaryHoldingCreated: import("@subsquid/evm-abi").AbiEvent<{
        readonly vesting: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly beneficiaryAddress: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly admin: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly unlockTimestamp: p.Codec<number | bigint, bigint>;
        readonly expectedTotalAmount: p.Codec<number | bigint, bigint>;
    }>;
    Unpaused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    HOLDING_CREATOR_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PAUSER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    createTemporaryHolding: import("@subsquid/evm-abi").AbiFunction<{
        readonly beneficiaryAddress: p.Codec<string, string>;
        readonly admin: p.Codec<string, string>;
        readonly unlockTimestamp: p.Codec<number | bigint, bigint>;
        readonly expectedTotalAmount: p.Codec<number | bigint, bigint>;
    }, p.Codec<string, string>>;
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
    pause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    paused: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    router: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    token: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    HOLDING_CREATOR_ROLE(): Promise<string>;
    PAUSER_ROLE(): Promise<string>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    paused(): Promise<boolean>;
    router(): Promise<string>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    token(): Promise<string>;
}
export type PausedEventArgs = EParams<typeof events.Paused>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type TemporaryHoldingCreatedEventArgs = EParams<typeof events.TemporaryHoldingCreated>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type HOLDING_CREATOR_ROLEParams = FunctionArguments<typeof functions.HOLDING_CREATOR_ROLE>;
export type HOLDING_CREATOR_ROLEReturn = FunctionReturn<typeof functions.HOLDING_CREATOR_ROLE>;
export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>;
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>;
export type CreateTemporaryHoldingParams = FunctionArguments<typeof functions.createTemporaryHolding>;
export type CreateTemporaryHoldingReturn = FunctionReturn<typeof functions.createTemporaryHolding>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type PauseParams = FunctionArguments<typeof functions.pause>;
export type PauseReturn = FunctionReturn<typeof functions.pause>;
export type PausedParams = FunctionArguments<typeof functions.paused>;
export type PausedReturn = FunctionReturn<typeof functions.paused>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type RouterParams = FunctionArguments<typeof functions.router>;
export type RouterReturn = FunctionReturn<typeof functions.router>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type TokenParams = FunctionArguments<typeof functions.token>;
export type TokenReturn = FunctionReturn<typeof functions.token>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
