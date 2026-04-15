import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    Approval: import("@subsquid/evm-abi").AbiEvent<{
        readonly owner: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly spender: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly value: p.Codec<number | bigint, bigint>;
    }>;
    Transfer: import("@subsquid/evm-abi").AbiEvent<{
        readonly from: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly to: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly value: p.Codec<number | bigint, bigint>;
    }>;
};
export declare const functions: {
    allowance: import("@subsquid/evm-abi").AbiFunction<{
        readonly owner: p.Codec<string, string>;
        readonly spender: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    approve: import("@subsquid/evm-abi").AbiFunction<{
        readonly spender: p.Codec<string, string>;
        readonly value: p.Codec<number | bigint, bigint>;
    }, p.Codec<boolean, boolean>>;
    balanceOf: import("@subsquid/evm-abi").AbiFunction<{
        readonly account: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    decimals: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, number>>;
    isArbitrumEnabled: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, number>>;
    name: import("@subsquid/evm-abi").AbiFunction<{}, {
        readonly encode: (sink: p.Sink, val: string) => void;
        readonly decode: (src: p.Src) => string;
        readonly isDynamic: true;
        readonly baseType: "string";
    }>;
    registerTokenOnL2: import("@subsquid/evm-abi").AbiFunction<{
        readonly l2CustomTokenAddress: p.Codec<string, string>;
        readonly maxSubmissionCostForCustomGateway: p.Codec<number | bigint, bigint>;
        readonly maxSubmissionCostForRouter: p.Codec<number | bigint, bigint>;
        readonly maxGasForCustomGateway: p.Codec<number | bigint, bigint>;
        readonly maxGasForRouter: p.Codec<number | bigint, bigint>;
        readonly gasPriceBid: p.Codec<number | bigint, bigint>;
        readonly valueForGateway: p.Codec<number | bigint, bigint>;
        readonly valueForRouter: p.Codec<number | bigint, bigint>;
        readonly creditBackAddress: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    symbol: import("@subsquid/evm-abi").AbiFunction<{}, {
        readonly encode: (sink: p.Sink, val: string) => void;
        readonly decode: (src: p.Src) => string;
        readonly isDynamic: true;
        readonly baseType: "string";
    }>;
    totalSupply: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    transfer: import("@subsquid/evm-abi").AbiFunction<{
        readonly to: p.Codec<string, string>;
        readonly value: p.Codec<number | bigint, bigint>;
    }, p.Codec<boolean, boolean>>;
    transferFrom: import("@subsquid/evm-abi").AbiFunction<{
        readonly from: p.Codec<string, string>;
        readonly to: p.Codec<string, string>;
        readonly value: p.Codec<number | bigint, bigint>;
    }, p.Codec<boolean, boolean>>;
};
export declare class Contract extends ContractBase {
    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]): Promise<bigint>;
    balanceOf(account: BalanceOfParams["account"]): Promise<bigint>;
    decimals(): Promise<number>;
    isArbitrumEnabled(): Promise<number>;
    name(): Promise<string>;
    symbol(): Promise<string>;
    totalSupply(): Promise<bigint>;
}
export type ApprovalEventArgs = EParams<typeof events.Approval>;
export type TransferEventArgs = EParams<typeof events.Transfer>;
export type AllowanceParams = FunctionArguments<typeof functions.allowance>;
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>;
export type ApproveParams = FunctionArguments<typeof functions.approve>;
export type ApproveReturn = FunctionReturn<typeof functions.approve>;
export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>;
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>;
export type DecimalsParams = FunctionArguments<typeof functions.decimals>;
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>;
export type IsArbitrumEnabledParams = FunctionArguments<typeof functions.isArbitrumEnabled>;
export type IsArbitrumEnabledReturn = FunctionReturn<typeof functions.isArbitrumEnabled>;
export type NameParams = FunctionArguments<typeof functions.name>;
export type NameReturn = FunctionReturn<typeof functions.name>;
export type RegisterTokenOnL2Params = FunctionArguments<typeof functions.registerTokenOnL2>;
export type RegisterTokenOnL2Return = FunctionReturn<typeof functions.registerTokenOnL2>;
export type SymbolParams = FunctionArguments<typeof functions.symbol>;
export type SymbolReturn = FunctionReturn<typeof functions.symbol>;
export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>;
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>;
export type TransferParams = FunctionArguments<typeof functions.transfer>;
export type TransferReturn = FunctionReturn<typeof functions.transfer>;
export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>;
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>;
