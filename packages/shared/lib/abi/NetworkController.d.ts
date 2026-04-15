import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    AllowedVestedTargetUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly target: p.Codec<string, string>;
        readonly isAllowed: p.Codec<boolean, boolean>;
    }>;
    BondAmountUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly bondAmount: p.Codec<number | bigint, bigint>;
    }>;
    EpochLengthUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly epochLength: p.Codec<number | bigint, bigint>;
    }>;
    LockPeriodUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly lockPeriod: p.Codec<number | bigint, bigint>;
    }>;
    RewardCoefficientUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly coefficient: p.Codec<number | bigint, bigint>;
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
    StakingDeadlockUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly stakingDeadlock: p.Codec<number | bigint, bigint>;
    }>;
    StoragePerWorkerInGbUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly storagePerWorkerInGb: p.Codec<number | bigint, bigint>;
    }>;
    TargetCapacityUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly target: p.Codec<number | bigint, bigint>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    bondAmount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    epochLength: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    epochNumber: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    firstEpochBlock: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
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
    isAllowedVestedTarget: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    lockPeriod: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    nextEpoch: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setAllowedVestedTarget: import("@subsquid/evm-abi").AbiFunction<{
        readonly target: p.Codec<string, string>;
        readonly isAllowed: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setBondAmount: import("@subsquid/evm-abi").AbiFunction<{
        readonly _bondAmount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setEpochLength: import("@subsquid/evm-abi").AbiFunction<{
        readonly _epochLength: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setLockPeriod: import("@subsquid/evm-abi").AbiFunction<{
        readonly _lockPeriod: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setStakingDeadlock: import("@subsquid/evm-abi").AbiFunction<{
        readonly _newDeadlock: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setStoragePerWorkerInGb: import("@subsquid/evm-abi").AbiFunction<{
        readonly _storagePerWorkerInGb: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setTargetCapacity: import("@subsquid/evm-abi").AbiFunction<{
        readonly target: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setYearlyRewardCapCoefficient: import("@subsquid/evm-abi").AbiFunction<{
        readonly coefficient: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    stakingDeadlock: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    storagePerWorkerInGb: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    targetCapacityGb: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    workerEpochLength: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    yearlyRewardCapCoefficient: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    bondAmount(): Promise<bigint>;
    epochLength(): Promise<bigint>;
    epochNumber(): Promise<bigint>;
    firstEpochBlock(): Promise<bigint>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    isAllowedVestedTarget(_0: IsAllowedVestedTargetParams["_0"]): Promise<boolean>;
    lockPeriod(): Promise<bigint>;
    nextEpoch(): Promise<bigint>;
    stakingDeadlock(): Promise<bigint>;
    storagePerWorkerInGb(): Promise<bigint>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    targetCapacityGb(): Promise<bigint>;
    workerEpochLength(): Promise<bigint>;
    yearlyRewardCapCoefficient(): Promise<bigint>;
}
export type AllowedVestedTargetUpdatedEventArgs = EParams<typeof events.AllowedVestedTargetUpdated>;
export type BondAmountUpdatedEventArgs = EParams<typeof events.BondAmountUpdated>;
export type EpochLengthUpdatedEventArgs = EParams<typeof events.EpochLengthUpdated>;
export type LockPeriodUpdatedEventArgs = EParams<typeof events.LockPeriodUpdated>;
export type RewardCoefficientUpdatedEventArgs = EParams<typeof events.RewardCoefficientUpdated>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type StakingDeadlockUpdatedEventArgs = EParams<typeof events.StakingDeadlockUpdated>;
export type StoragePerWorkerInGbUpdatedEventArgs = EParams<typeof events.StoragePerWorkerInGbUpdated>;
export type TargetCapacityUpdatedEventArgs = EParams<typeof events.TargetCapacityUpdated>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type BondAmountParams = FunctionArguments<typeof functions.bondAmount>;
export type BondAmountReturn = FunctionReturn<typeof functions.bondAmount>;
export type EpochLengthParams = FunctionArguments<typeof functions.epochLength>;
export type EpochLengthReturn = FunctionReturn<typeof functions.epochLength>;
export type EpochNumberParams = FunctionArguments<typeof functions.epochNumber>;
export type EpochNumberReturn = FunctionReturn<typeof functions.epochNumber>;
export type FirstEpochBlockParams = FunctionArguments<typeof functions.firstEpochBlock>;
export type FirstEpochBlockReturn = FunctionReturn<typeof functions.firstEpochBlock>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type IsAllowedVestedTargetParams = FunctionArguments<typeof functions.isAllowedVestedTarget>;
export type IsAllowedVestedTargetReturn = FunctionReturn<typeof functions.isAllowedVestedTarget>;
export type LockPeriodParams = FunctionArguments<typeof functions.lockPeriod>;
export type LockPeriodReturn = FunctionReturn<typeof functions.lockPeriod>;
export type NextEpochParams = FunctionArguments<typeof functions.nextEpoch>;
export type NextEpochReturn = FunctionReturn<typeof functions.nextEpoch>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type SetAllowedVestedTargetParams = FunctionArguments<typeof functions.setAllowedVestedTarget>;
export type SetAllowedVestedTargetReturn = FunctionReturn<typeof functions.setAllowedVestedTarget>;
export type SetBondAmountParams = FunctionArguments<typeof functions.setBondAmount>;
export type SetBondAmountReturn = FunctionReturn<typeof functions.setBondAmount>;
export type SetEpochLengthParams = FunctionArguments<typeof functions.setEpochLength>;
export type SetEpochLengthReturn = FunctionReturn<typeof functions.setEpochLength>;
export type SetLockPeriodParams = FunctionArguments<typeof functions.setLockPeriod>;
export type SetLockPeriodReturn = FunctionReturn<typeof functions.setLockPeriod>;
export type SetStakingDeadlockParams = FunctionArguments<typeof functions.setStakingDeadlock>;
export type SetStakingDeadlockReturn = FunctionReturn<typeof functions.setStakingDeadlock>;
export type SetStoragePerWorkerInGbParams = FunctionArguments<typeof functions.setStoragePerWorkerInGb>;
export type SetStoragePerWorkerInGbReturn = FunctionReturn<typeof functions.setStoragePerWorkerInGb>;
export type SetTargetCapacityParams = FunctionArguments<typeof functions.setTargetCapacity>;
export type SetTargetCapacityReturn = FunctionReturn<typeof functions.setTargetCapacity>;
export type SetYearlyRewardCapCoefficientParams = FunctionArguments<typeof functions.setYearlyRewardCapCoefficient>;
export type SetYearlyRewardCapCoefficientReturn = FunctionReturn<typeof functions.setYearlyRewardCapCoefficient>;
export type StakingDeadlockParams = FunctionArguments<typeof functions.stakingDeadlock>;
export type StakingDeadlockReturn = FunctionReturn<typeof functions.stakingDeadlock>;
export type StoragePerWorkerInGbParams = FunctionArguments<typeof functions.storagePerWorkerInGb>;
export type StoragePerWorkerInGbReturn = FunctionReturn<typeof functions.storagePerWorkerInGb>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type TargetCapacityGbParams = FunctionArguments<typeof functions.targetCapacityGb>;
export type TargetCapacityGbReturn = FunctionReturn<typeof functions.targetCapacityGb>;
export type WorkerEpochLengthParams = FunctionArguments<typeof functions.workerEpochLength>;
export type WorkerEpochLengthReturn = FunctionReturn<typeof functions.workerEpochLength>;
export type YearlyRewardCapCoefficientParams = FunctionArguments<typeof functions.yearlyRewardCapCoefficient>;
export type YearlyRewardCapCoefficientReturn = FunctionReturn<typeof functions.yearlyRewardCapCoefficient>;
