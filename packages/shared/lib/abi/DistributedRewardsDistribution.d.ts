import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    Approved: import("@subsquid/evm-abi").AbiEvent<{
        readonly who: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
        readonly commitment: p.Codec<string | Uint8Array, string>;
    }>;
    ApprovesRequiredChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly newApprovesRequired: p.Codec<number | bigint, bigint>;
    }>;
    Claimed: import("@subsquid/evm-abi").AbiEvent<{
        readonly by: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly worker: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    Distributed: import("@subsquid/evm-abi").AbiEvent<{
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
        readonly recipients: p.Codec<(number | bigint)[], bigint[]>;
        readonly workerRewards: p.Codec<(number | bigint)[], bigint[]>;
        readonly stakerRewards: p.Codec<(number | bigint)[], bigint[]>;
    }>;
    DistributorAdded: import("@subsquid/evm-abi").AbiEvent<{
        readonly distributor: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    DistributorRemoved: import("@subsquid/evm-abi").AbiEvent<{
        readonly distributor: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    NewCommitment: import("@subsquid/evm-abi").AbiEvent<{
        readonly who: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
        readonly commitment: p.Codec<string | Uint8Array, string>;
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
    RoundRobinBlocksChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly newRoundRobinBlocks: p.Codec<number | bigint, bigint>;
    }>;
    Unpaused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    WindowSizeChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly newWindowSize: p.Codec<number | bigint, bigint>;
    }>;
};
export declare const functions: {
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PAUSER_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    REWARDS_DISTRIBUTOR_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    REWARDS_TREASURY_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    addDistributor: import("@subsquid/evm-abi").AbiFunction<{
        readonly distributor: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    alreadyApproved: import("@subsquid/evm-abi").AbiFunction<{
        readonly commitment: p.Codec<string | Uint8Array, string>;
        readonly distributor: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    approve: import("@subsquid/evm-abi").AbiFunction<{
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
        readonly recipients: p.Codec<(number | bigint)[], bigint[]>;
        readonly workerRewards: p.Codec<(number | bigint)[], bigint[]>;
        readonly _stakerRewards: p.Codec<(number | bigint)[], bigint[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    approves: import("@subsquid/evm-abi").AbiFunction<{
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, number>>;
    canApprove: import("@subsquid/evm-abi").AbiFunction<{
        readonly who: p.Codec<string, string>;
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
        readonly recipients: p.Codec<(number | bigint)[], bigint[]>;
        readonly workerRewards: p.Codec<(number | bigint)[], bigint[]>;
        readonly _stakerRewards: p.Codec<(number | bigint)[], bigint[]>;
    }, p.Codec<boolean, boolean>>;
    canCommit: import("@subsquid/evm-abi").AbiFunction<{
        readonly who: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    claim: import("@subsquid/evm-abi").AbiFunction<{
        readonly who: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    claimable: import("@subsquid/evm-abi").AbiFunction<{
        readonly who: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    commit: import("@subsquid/evm-abi").AbiFunction<{
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
        readonly recipients: p.Codec<(number | bigint)[], bigint[]>;
        readonly workerRewards: p.Codec<(number | bigint)[], bigint[]>;
        readonly _stakerRewards: p.Codec<(number | bigint)[], bigint[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    commitments: import("@subsquid/evm-abi").AbiFunction<{
        readonly fromBlock: p.Codec<number | bigint, bigint>;
        readonly toBlock: p.Codec<number | bigint, bigint>;
    }, p.Codec<string | Uint8Array, string>>;
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
    lastBlockRewarded: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    pause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    paused: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    removeDistributor: import("@subsquid/evm-abi").AbiFunction<{
        readonly distributor: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    requiredApproves: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    roundRobinBlocks: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    router: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    setApprovesRequired: import("@subsquid/evm-abi").AbiFunction<{
        readonly _approvesRequired: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setRoundRobinBlocks: import("@subsquid/evm-abi").AbiFunction<{
        readonly _roundRobinBlocks: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setWindowSize: import("@subsquid/evm-abi").AbiFunction<{
        readonly _windowSize: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    windowSize: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
};
export declare class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    PAUSER_ROLE(): Promise<string>;
    REWARDS_DISTRIBUTOR_ROLE(): Promise<string>;
    REWARDS_TREASURY_ROLE(): Promise<string>;
    alreadyApproved(commitment: AlreadyApprovedParams["commitment"], distributor: AlreadyApprovedParams["distributor"]): Promise<boolean>;
    approves(fromBlock: ApprovesParams["fromBlock"], toBlock: ApprovesParams["toBlock"]): Promise<number>;
    canApprove(who: CanApproveParams["who"], fromBlock: CanApproveParams["fromBlock"], toBlock: CanApproveParams["toBlock"], recipients: CanApproveParams["recipients"], workerRewards: CanApproveParams["workerRewards"], _stakerRewards: CanApproveParams["_stakerRewards"]): Promise<boolean>;
    canCommit(who: CanCommitParams["who"]): Promise<boolean>;
    claimable(who: ClaimableParams["who"]): Promise<bigint>;
    commitments(fromBlock: CommitmentsParams["fromBlock"], toBlock: CommitmentsParams["toBlock"]): Promise<string>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    lastBlockRewarded(): Promise<bigint>;
    paused(): Promise<boolean>;
    requiredApproves(): Promise<bigint>;
    roundRobinBlocks(): Promise<bigint>;
    router(): Promise<string>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    windowSize(): Promise<bigint>;
}
export type ApprovedEventArgs = EParams<typeof events.Approved>;
export type ApprovesRequiredChangedEventArgs = EParams<typeof events.ApprovesRequiredChanged>;
export type ClaimedEventArgs = EParams<typeof events.Claimed>;
export type DistributedEventArgs = EParams<typeof events.Distributed>;
export type DistributorAddedEventArgs = EParams<typeof events.DistributorAdded>;
export type DistributorRemovedEventArgs = EParams<typeof events.DistributorRemoved>;
export type NewCommitmentEventArgs = EParams<typeof events.NewCommitment>;
export type PausedEventArgs = EParams<typeof events.Paused>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type RoundRobinBlocksChangedEventArgs = EParams<typeof events.RoundRobinBlocksChanged>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type WindowSizeChangedEventArgs = EParams<typeof events.WindowSizeChanged>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>;
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>;
export type REWARDS_DISTRIBUTOR_ROLEParams = FunctionArguments<typeof functions.REWARDS_DISTRIBUTOR_ROLE>;
export type REWARDS_DISTRIBUTOR_ROLEReturn = FunctionReturn<typeof functions.REWARDS_DISTRIBUTOR_ROLE>;
export type REWARDS_TREASURY_ROLEParams = FunctionArguments<typeof functions.REWARDS_TREASURY_ROLE>;
export type REWARDS_TREASURY_ROLEReturn = FunctionReturn<typeof functions.REWARDS_TREASURY_ROLE>;
export type AddDistributorParams = FunctionArguments<typeof functions.addDistributor>;
export type AddDistributorReturn = FunctionReturn<typeof functions.addDistributor>;
export type AlreadyApprovedParams = FunctionArguments<typeof functions.alreadyApproved>;
export type AlreadyApprovedReturn = FunctionReturn<typeof functions.alreadyApproved>;
export type ApproveParams = FunctionArguments<typeof functions.approve>;
export type ApproveReturn = FunctionReturn<typeof functions.approve>;
export type ApprovesParams = FunctionArguments<typeof functions.approves>;
export type ApprovesReturn = FunctionReturn<typeof functions.approves>;
export type CanApproveParams = FunctionArguments<typeof functions.canApprove>;
export type CanApproveReturn = FunctionReturn<typeof functions.canApprove>;
export type CanCommitParams = FunctionArguments<typeof functions.canCommit>;
export type CanCommitReturn = FunctionReturn<typeof functions.canCommit>;
export type ClaimParams = FunctionArguments<typeof functions.claim>;
export type ClaimReturn = FunctionReturn<typeof functions.claim>;
export type ClaimableParams = FunctionArguments<typeof functions.claimable>;
export type ClaimableReturn = FunctionReturn<typeof functions.claimable>;
export type CommitParams = FunctionArguments<typeof functions.commit>;
export type CommitReturn = FunctionReturn<typeof functions.commit>;
export type CommitmentsParams = FunctionArguments<typeof functions.commitments>;
export type CommitmentsReturn = FunctionReturn<typeof functions.commitments>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type LastBlockRewardedParams = FunctionArguments<typeof functions.lastBlockRewarded>;
export type LastBlockRewardedReturn = FunctionReturn<typeof functions.lastBlockRewarded>;
export type PauseParams = FunctionArguments<typeof functions.pause>;
export type PauseReturn = FunctionReturn<typeof functions.pause>;
export type PausedParams = FunctionArguments<typeof functions.paused>;
export type PausedReturn = FunctionReturn<typeof functions.paused>;
export type RemoveDistributorParams = FunctionArguments<typeof functions.removeDistributor>;
export type RemoveDistributorReturn = FunctionReturn<typeof functions.removeDistributor>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RequiredApprovesParams = FunctionArguments<typeof functions.requiredApproves>;
export type RequiredApprovesReturn = FunctionReturn<typeof functions.requiredApproves>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type RoundRobinBlocksParams = FunctionArguments<typeof functions.roundRobinBlocks>;
export type RoundRobinBlocksReturn = FunctionReturn<typeof functions.roundRobinBlocks>;
export type RouterParams = FunctionArguments<typeof functions.router>;
export type RouterReturn = FunctionReturn<typeof functions.router>;
export type SetApprovesRequiredParams = FunctionArguments<typeof functions.setApprovesRequired>;
export type SetApprovesRequiredReturn = FunctionReturn<typeof functions.setApprovesRequired>;
export type SetRoundRobinBlocksParams = FunctionArguments<typeof functions.setRoundRobinBlocks>;
export type SetRoundRobinBlocksReturn = FunctionReturn<typeof functions.setRoundRobinBlocks>;
export type SetWindowSizeParams = FunctionArguments<typeof functions.setWindowSize>;
export type SetWindowSizeReturn = FunctionReturn<typeof functions.setWindowSize>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
export type WindowSizeParams = FunctionArguments<typeof functions.windowSize>;
export type WindowSizeReturn = FunctionReturn<typeof functions.windowSize>;
