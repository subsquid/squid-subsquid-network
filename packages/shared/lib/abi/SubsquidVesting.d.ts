import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    ERC20Released: import("@subsquid/evm-abi").AbiEvent<{
        readonly token: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    EtherReleased: import("@subsquid/evm-abi").AbiEvent<{
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    OwnershipTransferred: import("@subsquid/evm-abi").AbiEvent<{
        readonly previousOwner: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly newOwner: {
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
    SQD: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    balanceOf: import("@subsquid/evm-abi").AbiFunction<{
        readonly token: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    depositedIntoProtocol: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    duration: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    end: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    'execute(address,bytes)': import("@subsquid/evm-abi").AbiFunction<{
        readonly to: p.Codec<string, string>;
        readonly data: p.Codec<string | Uint8Array, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'execute(address,bytes,uint256)': import("@subsquid/evm-abi").AbiFunction<{
        readonly to: p.Codec<string, string>;
        readonly data: p.Codec<string | Uint8Array, string>;
        readonly requiredApprove: p.Codec<number | bigint, bigint>;
    }, p.Codec<string | Uint8Array, string>>;
    expectedTotalAmount: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    immediateReleaseBIP: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    owner: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    'releasable(address)': import("@subsquid/evm-abi").AbiFunction<{
        readonly token: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    'releasable()': import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    'release(address)': import("@subsquid/evm-abi").AbiFunction<{
        readonly token: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'release()': import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    'released()': import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    'released(address)': import("@subsquid/evm-abi").AbiFunction<{
        readonly token: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    renounceOwnership: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    router: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    start: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    transferOwnership: import("@subsquid/evm-abi").AbiFunction<{
        readonly newOwner: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    'vestedAmount(uint64)': import("@subsquid/evm-abi").AbiFunction<{
        readonly timestamp: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    'vestedAmount(address,uint64)': import("@subsquid/evm-abi").AbiFunction<{
        readonly token: p.Codec<string, string>;
        readonly timestamp: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
};
export declare class Contract extends ContractBase {
    SQD(): Promise<string>;
    balanceOf(token: BalanceOfParams["token"]): Promise<bigint>;
    depositedIntoProtocol(): Promise<bigint>;
    duration(): Promise<bigint>;
    end(): Promise<bigint>;
    expectedTotalAmount(): Promise<bigint>;
    immediateReleaseBIP(): Promise<bigint>;
    owner(): Promise<string>;
    'releasable(address)'(token: ReleasableParams_0["token"]): Promise<bigint>;
    'releasable()'(): Promise<bigint>;
    'released()'(): Promise<bigint>;
    'released(address)'(token: ReleasedParams_1["token"]): Promise<bigint>;
    router(): Promise<string>;
    start(): Promise<bigint>;
    'vestedAmount(uint64)'(timestamp: VestedAmountParams_0["timestamp"]): Promise<bigint>;
    'vestedAmount(address,uint64)'(token: VestedAmountParams_1["token"], timestamp: VestedAmountParams_1["timestamp"]): Promise<bigint>;
}
export type ERC20ReleasedEventArgs = EParams<typeof events.ERC20Released>;
export type EtherReleasedEventArgs = EParams<typeof events.EtherReleased>;
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>;
export type SQDParams = FunctionArguments<typeof functions.SQD>;
export type SQDReturn = FunctionReturn<typeof functions.SQD>;
export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>;
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>;
export type DepositedIntoProtocolParams = FunctionArguments<typeof functions.depositedIntoProtocol>;
export type DepositedIntoProtocolReturn = FunctionReturn<typeof functions.depositedIntoProtocol>;
export type DurationParams = FunctionArguments<typeof functions.duration>;
export type DurationReturn = FunctionReturn<typeof functions.duration>;
export type EndParams = FunctionArguments<typeof functions.end>;
export type EndReturn = FunctionReturn<typeof functions.end>;
export type ExecuteParams_0 = FunctionArguments<typeof functions['execute(address,bytes)']>;
export type ExecuteReturn_0 = FunctionReturn<typeof functions['execute(address,bytes)']>;
export type ExecuteParams_1 = FunctionArguments<typeof functions['execute(address,bytes,uint256)']>;
export type ExecuteReturn_1 = FunctionReturn<typeof functions['execute(address,bytes,uint256)']>;
export type ExpectedTotalAmountParams = FunctionArguments<typeof functions.expectedTotalAmount>;
export type ExpectedTotalAmountReturn = FunctionReturn<typeof functions.expectedTotalAmount>;
export type ImmediateReleaseBIPParams = FunctionArguments<typeof functions.immediateReleaseBIP>;
export type ImmediateReleaseBIPReturn = FunctionReturn<typeof functions.immediateReleaseBIP>;
export type OwnerParams = FunctionArguments<typeof functions.owner>;
export type OwnerReturn = FunctionReturn<typeof functions.owner>;
export type ReleasableParams_0 = FunctionArguments<typeof functions['releasable(address)']>;
export type ReleasableReturn_0 = FunctionReturn<typeof functions['releasable(address)']>;
export type ReleasableParams_1 = FunctionArguments<typeof functions['releasable()']>;
export type ReleasableReturn_1 = FunctionReturn<typeof functions['releasable()']>;
export type ReleaseParams_0 = FunctionArguments<typeof functions['release(address)']>;
export type ReleaseReturn_0 = FunctionReturn<typeof functions['release(address)']>;
export type ReleaseParams_1 = FunctionArguments<typeof functions['release()']>;
export type ReleaseReturn_1 = FunctionReturn<typeof functions['release()']>;
export type ReleasedParams_0 = FunctionArguments<typeof functions['released()']>;
export type ReleasedReturn_0 = FunctionReturn<typeof functions['released()']>;
export type ReleasedParams_1 = FunctionArguments<typeof functions['released(address)']>;
export type ReleasedReturn_1 = FunctionReturn<typeof functions['released(address)']>;
export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>;
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>;
export type RouterParams = FunctionArguments<typeof functions.router>;
export type RouterReturn = FunctionReturn<typeof functions.router>;
export type StartParams = FunctionArguments<typeof functions.start>;
export type StartReturn = FunctionReturn<typeof functions.start>;
export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>;
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>;
export type VestedAmountParams_0 = FunctionArguments<typeof functions['vestedAmount(uint64)']>;
export type VestedAmountReturn_0 = FunctionReturn<typeof functions['vestedAmount(uint64)']>;
export type VestedAmountParams_1 = FunctionArguments<typeof functions['vestedAmount(address,uint64)']>;
export type VestedAmountReturn_1 = FunctionReturn<typeof functions['vestedAmount(address,uint64)']>;
