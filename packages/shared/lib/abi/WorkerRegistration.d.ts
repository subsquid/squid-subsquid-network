import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    ExcessiveBondReturned: import("@subsquid/evm-abi").AbiEvent<{
        readonly workerId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    MetadataUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly workerId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
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
    WorkerDeregistered: import("@subsquid/evm-abi").AbiEvent<{
        readonly workerId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
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
        readonly deregistedAt: p.Codec<number | bigint, bigint>;
    }>;
    WorkerRegistered: import("@subsquid/evm-abi").AbiEvent<{
        readonly workerId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly registrar: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly registeredAt: p.Codec<number | bigint, bigint>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>;
    WorkerWithdrawn: import("@subsquid/evm-abi").AbiEvent<{
        readonly workerId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
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
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PAUSER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    SQD: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    bondAmount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    deregister: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    epochLength: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getActiveWorkerCount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getActiveWorkerIds: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<(number | bigint)[], bigint[]>>;
    getActiveWorkers: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<{
        readonly creator: string;
        readonly peerId: string | Uint8Array;
        readonly bond: number | bigint;
        readonly registeredAt: number | bigint;
        readonly deregisteredAt: number | bigint;
        readonly metadata: string;
    }[], {
        readonly creator: string;
        readonly peerId: string;
        readonly bond: bigint;
        readonly registeredAt: bigint;
        readonly deregisteredAt: bigint;
        readonly metadata: string;
    }[]>>;
    getAllWorkersCount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getMetadata: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, {
        readonly encode: (sink: p.Sink, val: string) => void;
        readonly decode: (src: p.Src) => string;
        readonly isDynamic: true;
        readonly baseType: "string";
    }>;
    getOwnedWorkers: import("@subsquid/evm-abi").AbiFunction<{
        readonly owner: p.Codec<string, string>;
    }, p.Codec<(number | bigint)[], bigint[]>>;
    getRoleAdmin: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
    }, p.Codec<string | Uint8Array, string>>;
    getWorker: import("@subsquid/evm-abi").AbiFunction<{
        readonly workerId: p.Codec<number | bigint, bigint>;
    }, import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
        readonly creator: p.Codec<string, string>;
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly bond: p.Codec<number | bigint, bigint>;
        readonly registeredAt: p.Codec<number | bigint, bigint>;
        readonly deregisteredAt: p.Codec<number | bigint, bigint>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>>;
    grantRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    hasRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    isWorkerActive: import("@subsquid/evm-abi").AbiFunction<{
        readonly workerId: p.Codec<number | bigint, bigint>;
    }, p.Codec<boolean, boolean>>;
    lockPeriod: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    nextEpoch: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    nextWorkerId: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    pause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    paused: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    'register(bytes)': import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
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
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    returnExcessiveBond: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    router: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    updateMetadata: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }, p.Struct | p.Codec<any, any> | undefined>;
    withdraw: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    workerIds: import("@subsquid/evm-abi").AbiFunction<{
        readonly peerId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<number | bigint, bigint>>;
    workers: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<number | bigint, bigint>;
    }, {
        readonly creator: p.Codec<string, string>;
        readonly peerId: p.Codec<string | Uint8Array, string>;
        readonly bond: p.Codec<number | bigint, bigint>;
        readonly registeredAt: p.Codec<number | bigint, bigint>;
        readonly deregisteredAt: p.Codec<number | bigint, bigint>;
        readonly metadata: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    PAUSER_ROLE(): Promise<string>;
    SQD(): Promise<string>;
    bondAmount(): Promise<bigint>;
    epochLength(): Promise<bigint>;
    getActiveWorkerCount(): Promise<bigint>;
    getActiveWorkerIds(): Promise<bigint[]>;
    getActiveWorkers(): Promise<{
        readonly creator: string;
        readonly peerId: string;
        readonly bond: bigint;
        readonly registeredAt: bigint;
        readonly deregisteredAt: bigint;
        readonly metadata: string;
    }[]>;
    getAllWorkersCount(): Promise<bigint>;
    getMetadata(peerId: GetMetadataParams["peerId"]): Promise<string>;
    getOwnedWorkers(owner: GetOwnedWorkersParams["owner"]): Promise<bigint[]>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    getWorker(workerId: GetWorkerParams["workerId"]): Promise<{
        readonly creator: string;
        readonly peerId: string;
        readonly bond: bigint;
        readonly registeredAt: bigint;
        readonly deregisteredAt: bigint;
        readonly metadata: string;
    }>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    isWorkerActive(workerId: IsWorkerActiveParams["workerId"]): Promise<boolean>;
    lockPeriod(): Promise<bigint>;
    nextEpoch(): Promise<bigint>;
    nextWorkerId(): Promise<bigint>;
    paused(): Promise<boolean>;
    router(): Promise<string>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    workerIds(peerId: WorkerIdsParams["peerId"]): Promise<bigint>;
    workers(_0: WorkersParams["_0"]): Promise<{
        readonly creator: string;
        readonly peerId: string;
        readonly bond: bigint;
        readonly registeredAt: bigint;
        readonly deregisteredAt: bigint;
        readonly metadata: string;
    }>;
}
export type ExcessiveBondReturnedEventArgs = EParams<typeof events.ExcessiveBondReturned>;
export type MetadataUpdatedEventArgs = EParams<typeof events.MetadataUpdated>;
export type PausedEventArgs = EParams<typeof events.Paused>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type WorkerDeregisteredEventArgs = EParams<typeof events.WorkerDeregistered>;
export type WorkerRegisteredEventArgs = EParams<typeof events.WorkerRegistered>;
export type WorkerWithdrawnEventArgs = EParams<typeof events.WorkerWithdrawn>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>;
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>;
export type SQDParams = FunctionArguments<typeof functions.SQD>;
export type SQDReturn = FunctionReturn<typeof functions.SQD>;
export type BondAmountParams = FunctionArguments<typeof functions.bondAmount>;
export type BondAmountReturn = FunctionReturn<typeof functions.bondAmount>;
export type DeregisterParams = FunctionArguments<typeof functions.deregister>;
export type DeregisterReturn = FunctionReturn<typeof functions.deregister>;
export type EpochLengthParams = FunctionArguments<typeof functions.epochLength>;
export type EpochLengthReturn = FunctionReturn<typeof functions.epochLength>;
export type GetActiveWorkerCountParams = FunctionArguments<typeof functions.getActiveWorkerCount>;
export type GetActiveWorkerCountReturn = FunctionReturn<typeof functions.getActiveWorkerCount>;
export type GetActiveWorkerIdsParams = FunctionArguments<typeof functions.getActiveWorkerIds>;
export type GetActiveWorkerIdsReturn = FunctionReturn<typeof functions.getActiveWorkerIds>;
export type GetActiveWorkersParams = FunctionArguments<typeof functions.getActiveWorkers>;
export type GetActiveWorkersReturn = FunctionReturn<typeof functions.getActiveWorkers>;
export type GetAllWorkersCountParams = FunctionArguments<typeof functions.getAllWorkersCount>;
export type GetAllWorkersCountReturn = FunctionReturn<typeof functions.getAllWorkersCount>;
export type GetMetadataParams = FunctionArguments<typeof functions.getMetadata>;
export type GetMetadataReturn = FunctionReturn<typeof functions.getMetadata>;
export type GetOwnedWorkersParams = FunctionArguments<typeof functions.getOwnedWorkers>;
export type GetOwnedWorkersReturn = FunctionReturn<typeof functions.getOwnedWorkers>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GetWorkerParams = FunctionArguments<typeof functions.getWorker>;
export type GetWorkerReturn = FunctionReturn<typeof functions.getWorker>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type IsWorkerActiveParams = FunctionArguments<typeof functions.isWorkerActive>;
export type IsWorkerActiveReturn = FunctionReturn<typeof functions.isWorkerActive>;
export type LockPeriodParams = FunctionArguments<typeof functions.lockPeriod>;
export type LockPeriodReturn = FunctionReturn<typeof functions.lockPeriod>;
export type NextEpochParams = FunctionArguments<typeof functions.nextEpoch>;
export type NextEpochReturn = FunctionReturn<typeof functions.nextEpoch>;
export type NextWorkerIdParams = FunctionArguments<typeof functions.nextWorkerId>;
export type NextWorkerIdReturn = FunctionReturn<typeof functions.nextWorkerId>;
export type PauseParams = FunctionArguments<typeof functions.pause>;
export type PauseReturn = FunctionReturn<typeof functions.pause>;
export type PausedParams = FunctionArguments<typeof functions.paused>;
export type PausedReturn = FunctionReturn<typeof functions.paused>;
export type RegisterParams_0 = FunctionArguments<typeof functions['register(bytes)']>;
export type RegisterReturn_0 = FunctionReturn<typeof functions['register(bytes)']>;
export type RegisterParams_1 = FunctionArguments<typeof functions['register(bytes,string)']>;
export type RegisterReturn_1 = FunctionReturn<typeof functions['register(bytes,string)']>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type ReturnExcessiveBondParams = FunctionArguments<typeof functions.returnExcessiveBond>;
export type ReturnExcessiveBondReturn = FunctionReturn<typeof functions.returnExcessiveBond>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type RouterParams = FunctionArguments<typeof functions.router>;
export type RouterReturn = FunctionReturn<typeof functions.router>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
export type UpdateMetadataParams = FunctionArguments<typeof functions.updateMetadata>;
export type UpdateMetadataReturn = FunctionReturn<typeof functions.updateMetadata>;
export type WithdrawParams = FunctionArguments<typeof functions.withdraw>;
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>;
export type WorkerIdsParams = FunctionArguments<typeof functions.workerIds>;
export type WorkerIdsReturn = FunctionReturn<typeof functions.workerIds>;
export type WorkersParams = FunctionArguments<typeof functions.workers>;
export type WorkersReturn = FunctionReturn<typeof functions.workers>;
