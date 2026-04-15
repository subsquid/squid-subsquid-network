import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const functions: {
    cap: import("@subsquid/evm-abi").AbiFunction<{
        readonly x: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    capedStake: import("@subsquid/evm-abi").AbiFunction<{
        readonly workerId: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    capedStakeAfterDelegation: import("@subsquid/evm-abi").AbiFunction<{
        readonly workerId: p.Codec<number | bigint, bigint>;
        readonly delegationAmount: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    router: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
};
export declare class Contract extends ContractBase {
    cap(x: CapParams["x"]): Promise<bigint>;
    capedStake(workerId: CapedStakeParams["workerId"]): Promise<bigint>;
    capedStakeAfterDelegation(workerId: CapedStakeAfterDelegationParams["workerId"], delegationAmount: CapedStakeAfterDelegationParams["delegationAmount"]): Promise<bigint>;
    router(): Promise<string>;
}
export type CapParams = FunctionArguments<typeof functions.cap>;
export type CapReturn = FunctionReturn<typeof functions.cap>;
export type CapedStakeParams = FunctionArguments<typeof functions.capedStake>;
export type CapedStakeReturn = FunctionReturn<typeof functions.capedStake>;
export type CapedStakeAfterDelegationParams = FunctionArguments<typeof functions.capedStakeAfterDelegation>;
export type CapedStakeAfterDelegationReturn = FunctionReturn<typeof functions.capedStakeAfterDelegation>;
export type RouterParams = FunctionArguments<typeof functions.router>;
export type RouterReturn = FunctionReturn<typeof functions.router>;
