import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    Claimed: import("@subsquid/evm-abi").AbiEvent<{
        readonly staker: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly workerIds: p.Codec<(number | bigint)[], bigint[]>;
    }>;
    Deposited: import("@subsquid/evm-abi").AbiEvent<{
        readonly worker: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly staker: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    Distributed: import("@subsquid/evm-abi").AbiEvent<{
        readonly epoch: p.Codec<number | bigint, bigint>;
    }>;
    EpochsLockChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly epochsLock: p.Codec<number | bigint, bigint>;
    }>;
    MaxDelegationsChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly maxDelegations: p.Codec<number | bigint, bigint>;
    }>;
    Paused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    Rewarded: import("@subsquid/evm-abi").AbiEvent<{
        readonly workerId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly staker: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
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
    Withdrawn: import("@subsquid/evm-abi").AbiEvent<{
        readonly worker: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly staker: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PAUSER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    REWARDS_DISTRIBUTOR_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    claim: import("@subsquid/evm-abi").AbiFunction<{
        readonly staker: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    claimable: import("@subsquid/evm-abi").AbiFunction<{
        readonly staker: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    delegated: import("@subsquid/evm-abi").AbiFunction<{
        readonly worker: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    delegates: import("@subsquid/evm-abi").AbiFunction<{
        readonly staker: p.Codec<string, string>;
    }, p.Codec<(number | bigint)[], bigint[]>>;
    deposit: import("@subsquid/evm-abi").AbiFunction<{
        readonly worker: p.Codec<number | bigint, bigint>;
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    distribute: import("@subsquid/evm-abi").AbiFunction<{
        readonly workers: p.Codec<(number | bigint)[], bigint[]>;
        readonly amounts: p.Codec<(number | bigint)[], bigint[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    epochsLockedAfterStake: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getDeposit: import("@subsquid/evm-abi").AbiFunction<{
        readonly staker: p.Codec<string, string>;
        readonly worker: p.Codec<number | bigint, bigint>;
    }, {
        readonly depositAmount: p.Codec<number | bigint, bigint>;
        readonly withdrawAllowed: p.Codec<number | bigint, bigint>;
    }>;
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
    lastEpochRewarded: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    lockLengthBlocks: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    maxDelegations: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
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
    setEpochsLock: import("@subsquid/evm-abi").AbiFunction<{
        readonly _epochsLock: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setMaxDelegations: import("@subsquid/evm-abi").AbiFunction<{
        readonly _maxDelegations: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    token: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    totalStakedPerWorker: import("@subsquid/evm-abi").AbiFunction<{
        readonly workers: p.Codec<(number | bigint)[], bigint[]>;
    }, p.Codec<(number | bigint)[], bigint[]>>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    withdraw: import("@subsquid/evm-abi").AbiFunction<{
        readonly worker: p.Codec<number | bigint, bigint>;
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    PAUSER_ROLE(): Promise<string>;
    REWARDS_DISTRIBUTOR_ROLE(): Promise<string>;
    claimable(staker: ClaimableParams["staker"]): Promise<bigint>;
    delegated(worker: DelegatedParams["worker"]): Promise<bigint>;
    delegates(staker: DelegatesParams["staker"]): Promise<bigint[]>;
    epochsLockedAfterStake(): Promise<bigint>;
    getDeposit(staker: GetDepositParams["staker"], worker: GetDepositParams["worker"]): Promise<{
        readonly depositAmount: bigint;
        readonly withdrawAllowed: bigint;
    }>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    lastEpochRewarded(): Promise<bigint>;
    lockLengthBlocks(): Promise<bigint>;
    maxDelegations(): Promise<bigint>;
    paused(): Promise<boolean>;
    router(): Promise<string>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    token(): Promise<string>;
    totalStakedPerWorker(workers: TotalStakedPerWorkerParams["workers"]): Promise<bigint[]>;
}
export type ClaimedEventArgs = EParams<typeof events.Claimed>;
export type DepositedEventArgs = EParams<typeof events.Deposited>;
export type DistributedEventArgs = EParams<typeof events.Distributed>;
export type EpochsLockChangedEventArgs = EParams<typeof events.EpochsLockChanged>;
export type MaxDelegationsChangedEventArgs = EParams<typeof events.MaxDelegationsChanged>;
export type PausedEventArgs = EParams<typeof events.Paused>;
export type RewardedEventArgs = EParams<typeof events.Rewarded>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>;
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>;
export type REWARDS_DISTRIBUTOR_ROLEParams = FunctionArguments<typeof functions.REWARDS_DISTRIBUTOR_ROLE>;
export type REWARDS_DISTRIBUTOR_ROLEReturn = FunctionReturn<typeof functions.REWARDS_DISTRIBUTOR_ROLE>;
export type ClaimParams = FunctionArguments<typeof functions.claim>;
export type ClaimReturn = FunctionReturn<typeof functions.claim>;
export type ClaimableParams = FunctionArguments<typeof functions.claimable>;
export type ClaimableReturn = FunctionReturn<typeof functions.claimable>;
export type DelegatedParams = FunctionArguments<typeof functions.delegated>;
export type DelegatedReturn = FunctionReturn<typeof functions.delegated>;
export type DelegatesParams = FunctionArguments<typeof functions.delegates>;
export type DelegatesReturn = FunctionReturn<typeof functions.delegates>;
export type DepositParams = FunctionArguments<typeof functions.deposit>;
export type DepositReturn = FunctionReturn<typeof functions.deposit>;
export type DistributeParams = FunctionArguments<typeof functions.distribute>;
export type DistributeReturn = FunctionReturn<typeof functions.distribute>;
export type EpochsLockedAfterStakeParams = FunctionArguments<typeof functions.epochsLockedAfterStake>;
export type EpochsLockedAfterStakeReturn = FunctionReturn<typeof functions.epochsLockedAfterStake>;
export type GetDepositParams = FunctionArguments<typeof functions.getDeposit>;
export type GetDepositReturn = FunctionReturn<typeof functions.getDeposit>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type LastEpochRewardedParams = FunctionArguments<typeof functions.lastEpochRewarded>;
export type LastEpochRewardedReturn = FunctionReturn<typeof functions.lastEpochRewarded>;
export type LockLengthBlocksParams = FunctionArguments<typeof functions.lockLengthBlocks>;
export type LockLengthBlocksReturn = FunctionReturn<typeof functions.lockLengthBlocks>;
export type MaxDelegationsParams = FunctionArguments<typeof functions.maxDelegations>;
export type MaxDelegationsReturn = FunctionReturn<typeof functions.maxDelegations>;
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
export type SetEpochsLockParams = FunctionArguments<typeof functions.setEpochsLock>;
export type SetEpochsLockReturn = FunctionReturn<typeof functions.setEpochsLock>;
export type SetMaxDelegationsParams = FunctionArguments<typeof functions.setMaxDelegations>;
export type SetMaxDelegationsReturn = FunctionReturn<typeof functions.setMaxDelegations>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type TokenParams = FunctionArguments<typeof functions.token>;
export type TokenReturn = FunctionReturn<typeof functions.token>;
export type TotalStakedPerWorkerParams = FunctionArguments<typeof functions.totalStakedPerWorker>;
export type TotalStakedPerWorkerReturn = FunctionReturn<typeof functions.totalStakedPerWorker>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
export type WithdrawParams = FunctionArguments<typeof functions.withdraw>;
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>;
