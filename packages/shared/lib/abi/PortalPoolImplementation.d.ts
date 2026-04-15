import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    CapacityUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldCapacity: p.Codec<number | bigint, bigint>;
        readonly newCapacity: p.Codec<number | bigint, bigint>;
    }>;
    Deposited: import("@subsquid/evm-abi").AbiEvent<{
        readonly provider: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly newTotal: p.Codec<number | bigint, bigint>;
    }>;
    DistributionRateChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldRate: p.Codec<number | bigint, bigint>;
        readonly newRate: p.Codec<number | bigint, bigint>;
    }>;
    ExitClaimed: import("@subsquid/evm-abi").AbiEvent<{
        readonly provider: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    ExitRequested: import("@subsquid/evm-abi").AbiEvent<{
        readonly provider: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly endPosition: p.Codec<number | bigint, bigint>;
    }>;
    Initialized: import("@subsquid/evm-abi").AbiEvent<{
        readonly version: p.Codec<number | bigint, bigint>;
    }>;
    Paused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    PoolClosed: import("@subsquid/evm-abi").AbiEvent<{
        readonly closedBy: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly timestamp: p.Codec<number | bigint, bigint>;
    }>;
    RewardsClaimed: import("@subsquid/evm-abi").AbiEvent<{
        readonly provider: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    RewardsRecovered: import("@subsquid/evm-abi").AbiEvent<{
        readonly operator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    RewardsToppedUp: import("@subsquid/evm-abi").AbiEvent<{
        readonly operator: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly received: p.Codec<number | bigint, bigint>;
        readonly toProviders: p.Codec<number | bigint, bigint>;
        readonly toWorkerPool: p.Codec<number | bigint, bigint>;
        readonly toBurn: p.Codec<number | bigint, bigint>;
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
    StakeTransferred: import("@subsquid/evm-abi").AbiEvent<{
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
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    StateChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly oldState: p.Codec<number | bigint, number>;
        readonly newState: p.Codec<number | bigint, number>;
    }>;
    Unpaused: import("@subsquid/evm-abi").AbiEvent<{
        readonly account: p.Codec<string, string>;
    }>;
    WhitelistEnabledChanged: import("@subsquid/evm-abi").AbiEvent<{
        readonly enabled: p.Codec<boolean, boolean>;
    }>;
    WhitelistUpdated: import("@subsquid/evm-abi").AbiEvent<{
        readonly user: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly added: p.Codec<boolean, boolean>;
    }>;
    Withdrawn: import("@subsquid/evm-abi").AbiEvent<{
        readonly provider: {
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
    ACC: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    DEFAULT_ADMIN_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    FACTORY_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    OPERATOR_ROLE: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string | Uint8Array, string>>;
    PRECISION: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    RATE_PRECISION: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    addToWhitelist: import("@subsquid/evm-abi").AbiFunction<{
        readonly users: p.Codec<string[], string[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    balanceTs: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    burnAddress: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    checkAndFailPortal: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    claimRewards: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    claimRewardsFromClosed: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    closePool: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    credit: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    currentBalance: import("@subsquid/evm-abi").AbiFunction<{
        readonly timestamp: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    debt: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    deposit: import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    emergencyWithdraw: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    getActiveStake: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getClaimableRewards: import("@subsquid/evm-abi").AbiFunction<{
        readonly provider: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    getComputationUnits: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getCredit: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getCurrentRewardBalance: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getDebt: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getExitTicket: import("@subsquid/evm-abi").AbiFunction<{
        readonly provider: p.Codec<string, string>;
        readonly ticketId: p.Codec<number | bigint, bigint>;
    }, import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
        readonly endPosition: p.Codec<number | bigint, bigint>;
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly withdrawn: p.Codec<boolean, boolean>;
    }>>;
    getMetadata: import("@subsquid/evm-abi").AbiFunction<{}, {
        readonly encode: (sink: p.Sink, val: string) => void;
        readonly decode: (src: p.Src) => string;
        readonly isDynamic: true;
        readonly baseType: "string";
    }>;
    getMinCapacity: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getPoolInfo: import("@subsquid/evm-abi").AbiFunction<{}, import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
        readonly operator: p.Codec<string, string>;
        readonly capacity: p.Codec<number | bigint, bigint>;
        readonly totalStaked: p.Codec<number | bigint, bigint>;
        readonly depositDeadline: p.Codec<number | bigint, bigint>;
        readonly activationTime: p.Codec<number | bigint, bigint>;
        readonly state: p.Codec<number | bigint, number>;
        readonly paused: p.Codec<boolean, boolean>;
        readonly firstActivated: p.Codec<boolean, boolean>;
    }>>;
    getPoolStatusWithRewards: import("@subsquid/evm-abi").AbiFunction<{
        readonly provider: p.Codec<string, string>;
    }, {
        readonly poolCredit: p.Codec<number | bigint, bigint>;
        readonly poolDebt: p.Codec<number | bigint, bigint>;
        readonly poolBalance: p.Codec<number | bigint, bigint>;
        readonly runway: p.Codec<number | bigint, bigint>;
        readonly outOfMoney: p.Codec<boolean, boolean>;
        readonly providerRewards: p.Codec<number | bigint, bigint>;
        readonly providerStake: p.Codec<number | bigint, bigint>;
    }>;
    getProviderStake: import("@subsquid/evm-abi").AbiFunction<{
        readonly provider: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    getQueueStatus: import("@subsquid/evm-abi").AbiFunction<{
        readonly provider: p.Codec<string, string>;
        readonly ticketId: p.Codec<number | bigint, bigint>;
    }, {
        readonly processed: p.Codec<number | bigint, bigint>;
        readonly providerEndPos: p.Codec<number | bigint, bigint>;
        readonly secondsRemaining: p.Codec<number | bigint, bigint>;
        readonly ready: p.Codec<boolean, boolean>;
    }>;
    getQueueStatusWithTimestamp: import("@subsquid/evm-abi").AbiFunction<{
        readonly provider: p.Codec<string, string>;
        readonly ticketId: p.Codec<number | bigint, bigint>;
    }, {
        readonly processed: p.Codec<number | bigint, bigint>;
        readonly providerEndPos: p.Codec<number | bigint, bigint>;
        readonly secondsRemaining: p.Codec<number | bigint, bigint>;
        readonly ready: p.Codec<boolean, boolean>;
        readonly unlockTimestamp: p.Codec<number | bigint, bigint>;
    }>;
    getRewardStatus: import("@subsquid/evm-abi").AbiFunction<{}, {
        readonly balance: p.Codec<number | bigint, bigint>;
        readonly currentDebt: p.Codec<number | bigint, bigint>;
        readonly runwayTimestamp: p.Codec<number | bigint, bigint>;
        readonly isDry: p.Codec<boolean, boolean>;
    }>;
    getRewardToken: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    getRoleAdmin: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
    }, p.Codec<string | Uint8Array, string>>;
    getRunway: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getState: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, number>>;
    getTicketCount: import("@subsquid/evm-abi").AbiFunction<{
        readonly provider: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    getTotalDrainRate: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getTotalProcessed: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    getWithdrawalWaitingTimestamp: import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    grantRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    hasRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    initialize: import("@subsquid/evm-abi").AbiFunction<{
        readonly params: import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
            readonly operator: p.Codec<string, string>;
            readonly capacity: p.Codec<number | bigint, bigint>;
            readonly depositDeadline: p.Codec<number | bigint, bigint>;
            readonly tokenSuffix: {
                readonly encode: (sink: p.Sink, val: string) => void;
                readonly decode: (src: p.Src) => string;
                readonly isDynamic: true;
                readonly baseType: "string";
            };
            readonly sqd: p.Codec<string, string>;
            readonly rewardToken: p.Codec<string, string>;
            readonly portalRegistry: p.Codec<string, string>;
            readonly feeRouter: p.Codec<string, string>;
            readonly minStakeThreshold: p.Codec<number | bigint, bigint>;
            readonly distributionRatePerSecond: p.Codec<number | bigint, bigint>;
            readonly metadata: {
                readonly encode: (sink: p.Sink, val: string) => void;
                readonly decode: (src: p.Src) => string;
                readonly isDynamic: true;
                readonly baseType: "string";
            };
        }>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    initializeCredit: import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    isOutOfMoney: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    isWhitelisted: import("@subsquid/evm-abi").AbiFunction<{
        readonly user: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    lastEffectiveRewardTs: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    lptToken: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    multicall: import("@subsquid/evm-abi").AbiFunction<{
        readonly data: p.Codec<(string | Uint8Array)[], string[]>;
    }, p.Codec<(string | Uint8Array)[], string[]>>;
    onLPTTransfer: import("@subsquid/evm-abi").AbiFunction<{
        readonly from: p.Codec<string, string>;
        readonly to: p.Codec<string, string>;
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    pause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    paused: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    perStakeRateWad: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    providerRatePerSec: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    recoverRewardsFromFailed: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    removeFromWhitelist: import("@subsquid/evm-abi").AbiFunction<{
        readonly users: p.Codec<string[], string[]>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    renounceRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly callerConfirmation: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    requestExit: import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Codec<number | bigint, bigint>>;
    revokeRole: import("@subsquid/evm-abi").AbiFunction<{
        readonly role: p.Codec<string | Uint8Array, string>;
        readonly account: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    rewardPerStakeStored: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    setCapacity: import("@subsquid/evm-abi").AbiFunction<{
        readonly newCapacity: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setDistributionRate: import("@subsquid/evm-abi").AbiFunction<{
        readonly newRatePerSecond: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    setWhitelistEnabled: import("@subsquid/evm-abi").AbiFunction<{
        readonly enabled: p.Codec<boolean, boolean>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    supportsInterface: import("@subsquid/evm-abi").AbiFunction<{
        readonly interfaceId: p.Codec<string | Uint8Array, string>;
    }, p.Codec<boolean, boolean>>;
    topUpRewards: import("@subsquid/evm-abi").AbiFunction<{
        readonly amount: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    totalDistributionRatePerSec: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    treasuryAccumulated: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    treasuryRatePerSec: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    tryMulticall: import("@subsquid/evm-abi").AbiFunction<{
        readonly data: p.Codec<(string | Uint8Array)[], string[]>;
    }, {
        readonly successes: p.Codec<boolean[], boolean[]>;
        readonly results: p.Codec<(string | Uint8Array)[], string[]>;
    }>;
    unpause: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    whitelist: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<boolean, boolean>>;
    whitelistEnabled: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<boolean, boolean>>;
    withdrawExit: import("@subsquid/evm-abi").AbiFunction<{
        readonly ticketId: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    withdrawFromFailed: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    workerPoolAddress: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
};
export declare class Contract extends ContractBase {
    ACC(): Promise<bigint>;
    DEFAULT_ADMIN_ROLE(): Promise<string>;
    FACTORY_ROLE(): Promise<string>;
    OPERATOR_ROLE(): Promise<string>;
    PRECISION(): Promise<bigint>;
    RATE_PRECISION(): Promise<bigint>;
    balanceTs(): Promise<bigint>;
    burnAddress(): Promise<string>;
    credit(): Promise<bigint>;
    currentBalance(timestamp: CurrentBalanceParams["timestamp"]): Promise<bigint>;
    debt(): Promise<bigint>;
    getActiveStake(): Promise<bigint>;
    getClaimableRewards(provider: GetClaimableRewardsParams["provider"]): Promise<bigint>;
    getComputationUnits(): Promise<bigint>;
    getCredit(): Promise<bigint>;
    getCurrentRewardBalance(): Promise<bigint>;
    getDebt(): Promise<bigint>;
    getExitTicket(provider: GetExitTicketParams["provider"], ticketId: GetExitTicketParams["ticketId"]): Promise<{
        readonly endPosition: bigint;
        readonly amount: bigint;
        readonly withdrawn: boolean;
    }>;
    getMetadata(): Promise<string>;
    getMinCapacity(): Promise<bigint>;
    getPoolInfo(): Promise<{
        readonly operator: string;
        readonly capacity: bigint;
        readonly totalStaked: bigint;
        readonly depositDeadline: bigint;
        readonly activationTime: bigint;
        readonly state: number;
        readonly paused: boolean;
        readonly firstActivated: boolean;
    }>;
    getPoolStatusWithRewards(provider: GetPoolStatusWithRewardsParams["provider"]): Promise<{
        readonly poolCredit: bigint;
        readonly poolDebt: bigint;
        readonly poolBalance: bigint;
        readonly runway: bigint;
        readonly outOfMoney: boolean;
        readonly providerRewards: bigint;
        readonly providerStake: bigint;
    }>;
    getProviderStake(provider: GetProviderStakeParams["provider"]): Promise<bigint>;
    getQueueStatus(provider: GetQueueStatusParams["provider"], ticketId: GetQueueStatusParams["ticketId"]): Promise<{
        readonly processed: bigint;
        readonly providerEndPos: bigint;
        readonly secondsRemaining: bigint;
        readonly ready: boolean;
    }>;
    getQueueStatusWithTimestamp(provider: GetQueueStatusWithTimestampParams["provider"], ticketId: GetQueueStatusWithTimestampParams["ticketId"]): Promise<{
        readonly processed: bigint;
        readonly providerEndPos: bigint;
        readonly secondsRemaining: bigint;
        readonly ready: boolean;
        readonly unlockTimestamp: bigint;
    }>;
    getRewardStatus(): Promise<{
        readonly balance: bigint;
        readonly currentDebt: bigint;
        readonly runwayTimestamp: bigint;
        readonly isDry: boolean;
    }>;
    getRewardToken(): Promise<string>;
    getRoleAdmin(role: GetRoleAdminParams["role"]): Promise<string>;
    getRunway(): Promise<bigint>;
    getState(): Promise<number>;
    getTicketCount(provider: GetTicketCountParams["provider"]): Promise<bigint>;
    getTotalDrainRate(): Promise<bigint>;
    getTotalProcessed(): Promise<bigint>;
    getWithdrawalWaitingTimestamp(amount: GetWithdrawalWaitingTimestampParams["amount"]): Promise<bigint>;
    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]): Promise<boolean>;
    isOutOfMoney(): Promise<boolean>;
    isWhitelisted(user: IsWhitelistedParams["user"]): Promise<boolean>;
    lastEffectiveRewardTs(): Promise<bigint>;
    lptToken(): Promise<string>;
    paused(): Promise<boolean>;
    perStakeRateWad(): Promise<bigint>;
    providerRatePerSec(): Promise<bigint>;
    rewardPerStakeStored(): Promise<bigint>;
    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]): Promise<boolean>;
    totalDistributionRatePerSec(): Promise<bigint>;
    treasuryAccumulated(): Promise<bigint>;
    treasuryRatePerSec(): Promise<bigint>;
    whitelist(_0: WhitelistParams["_0"]): Promise<boolean>;
    whitelistEnabled(): Promise<boolean>;
    workerPoolAddress(): Promise<string>;
}
export type CapacityUpdatedEventArgs = EParams<typeof events.CapacityUpdated>;
export type DepositedEventArgs = EParams<typeof events.Deposited>;
export type DistributionRateChangedEventArgs = EParams<typeof events.DistributionRateChanged>;
export type ExitClaimedEventArgs = EParams<typeof events.ExitClaimed>;
export type ExitRequestedEventArgs = EParams<typeof events.ExitRequested>;
export type InitializedEventArgs = EParams<typeof events.Initialized>;
export type PausedEventArgs = EParams<typeof events.Paused>;
export type PoolClosedEventArgs = EParams<typeof events.PoolClosed>;
export type RewardsClaimedEventArgs = EParams<typeof events.RewardsClaimed>;
export type RewardsRecoveredEventArgs = EParams<typeof events.RewardsRecovered>;
export type RewardsToppedUpEventArgs = EParams<typeof events.RewardsToppedUp>;
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>;
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>;
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>;
export type StakeTransferredEventArgs = EParams<typeof events.StakeTransferred>;
export type StateChangedEventArgs = EParams<typeof events.StateChanged>;
export type UnpausedEventArgs = EParams<typeof events.Unpaused>;
export type WhitelistEnabledChangedEventArgs = EParams<typeof events.WhitelistEnabledChanged>;
export type WhitelistUpdatedEventArgs = EParams<typeof events.WhitelistUpdated>;
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>;
export type ACCParams = FunctionArguments<typeof functions.ACC>;
export type ACCReturn = FunctionReturn<typeof functions.ACC>;
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>;
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>;
export type FACTORY_ROLEParams = FunctionArguments<typeof functions.FACTORY_ROLE>;
export type FACTORY_ROLEReturn = FunctionReturn<typeof functions.FACTORY_ROLE>;
export type OPERATOR_ROLEParams = FunctionArguments<typeof functions.OPERATOR_ROLE>;
export type OPERATOR_ROLEReturn = FunctionReturn<typeof functions.OPERATOR_ROLE>;
export type PRECISIONParams = FunctionArguments<typeof functions.PRECISION>;
export type PRECISIONReturn = FunctionReturn<typeof functions.PRECISION>;
export type RATE_PRECISIONParams = FunctionArguments<typeof functions.RATE_PRECISION>;
export type RATE_PRECISIONReturn = FunctionReturn<typeof functions.RATE_PRECISION>;
export type AddToWhitelistParams = FunctionArguments<typeof functions.addToWhitelist>;
export type AddToWhitelistReturn = FunctionReturn<typeof functions.addToWhitelist>;
export type BalanceTsParams = FunctionArguments<typeof functions.balanceTs>;
export type BalanceTsReturn = FunctionReturn<typeof functions.balanceTs>;
export type BurnAddressParams = FunctionArguments<typeof functions.burnAddress>;
export type BurnAddressReturn = FunctionReturn<typeof functions.burnAddress>;
export type CheckAndFailPortalParams = FunctionArguments<typeof functions.checkAndFailPortal>;
export type CheckAndFailPortalReturn = FunctionReturn<typeof functions.checkAndFailPortal>;
export type ClaimRewardsParams = FunctionArguments<typeof functions.claimRewards>;
export type ClaimRewardsReturn = FunctionReturn<typeof functions.claimRewards>;
export type ClaimRewardsFromClosedParams = FunctionArguments<typeof functions.claimRewardsFromClosed>;
export type ClaimRewardsFromClosedReturn = FunctionReturn<typeof functions.claimRewardsFromClosed>;
export type ClosePoolParams = FunctionArguments<typeof functions.closePool>;
export type ClosePoolReturn = FunctionReturn<typeof functions.closePool>;
export type CreditParams = FunctionArguments<typeof functions.credit>;
export type CreditReturn = FunctionReturn<typeof functions.credit>;
export type CurrentBalanceParams = FunctionArguments<typeof functions.currentBalance>;
export type CurrentBalanceReturn = FunctionReturn<typeof functions.currentBalance>;
export type DebtParams = FunctionArguments<typeof functions.debt>;
export type DebtReturn = FunctionReturn<typeof functions.debt>;
export type DepositParams = FunctionArguments<typeof functions.deposit>;
export type DepositReturn = FunctionReturn<typeof functions.deposit>;
export type EmergencyWithdrawParams = FunctionArguments<typeof functions.emergencyWithdraw>;
export type EmergencyWithdrawReturn = FunctionReturn<typeof functions.emergencyWithdraw>;
export type GetActiveStakeParams = FunctionArguments<typeof functions.getActiveStake>;
export type GetActiveStakeReturn = FunctionReturn<typeof functions.getActiveStake>;
export type GetClaimableRewardsParams = FunctionArguments<typeof functions.getClaimableRewards>;
export type GetClaimableRewardsReturn = FunctionReturn<typeof functions.getClaimableRewards>;
export type GetComputationUnitsParams = FunctionArguments<typeof functions.getComputationUnits>;
export type GetComputationUnitsReturn = FunctionReturn<typeof functions.getComputationUnits>;
export type GetCreditParams = FunctionArguments<typeof functions.getCredit>;
export type GetCreditReturn = FunctionReturn<typeof functions.getCredit>;
export type GetCurrentRewardBalanceParams = FunctionArguments<typeof functions.getCurrentRewardBalance>;
export type GetCurrentRewardBalanceReturn = FunctionReturn<typeof functions.getCurrentRewardBalance>;
export type GetDebtParams = FunctionArguments<typeof functions.getDebt>;
export type GetDebtReturn = FunctionReturn<typeof functions.getDebt>;
export type GetExitTicketParams = FunctionArguments<typeof functions.getExitTicket>;
export type GetExitTicketReturn = FunctionReturn<typeof functions.getExitTicket>;
export type GetMetadataParams = FunctionArguments<typeof functions.getMetadata>;
export type GetMetadataReturn = FunctionReturn<typeof functions.getMetadata>;
export type GetMinCapacityParams = FunctionArguments<typeof functions.getMinCapacity>;
export type GetMinCapacityReturn = FunctionReturn<typeof functions.getMinCapacity>;
export type GetPoolInfoParams = FunctionArguments<typeof functions.getPoolInfo>;
export type GetPoolInfoReturn = FunctionReturn<typeof functions.getPoolInfo>;
export type GetPoolStatusWithRewardsParams = FunctionArguments<typeof functions.getPoolStatusWithRewards>;
export type GetPoolStatusWithRewardsReturn = FunctionReturn<typeof functions.getPoolStatusWithRewards>;
export type GetProviderStakeParams = FunctionArguments<typeof functions.getProviderStake>;
export type GetProviderStakeReturn = FunctionReturn<typeof functions.getProviderStake>;
export type GetQueueStatusParams = FunctionArguments<typeof functions.getQueueStatus>;
export type GetQueueStatusReturn = FunctionReturn<typeof functions.getQueueStatus>;
export type GetQueueStatusWithTimestampParams = FunctionArguments<typeof functions.getQueueStatusWithTimestamp>;
export type GetQueueStatusWithTimestampReturn = FunctionReturn<typeof functions.getQueueStatusWithTimestamp>;
export type GetRewardStatusParams = FunctionArguments<typeof functions.getRewardStatus>;
export type GetRewardStatusReturn = FunctionReturn<typeof functions.getRewardStatus>;
export type GetRewardTokenParams = FunctionArguments<typeof functions.getRewardToken>;
export type GetRewardTokenReturn = FunctionReturn<typeof functions.getRewardToken>;
export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>;
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>;
export type GetRunwayParams = FunctionArguments<typeof functions.getRunway>;
export type GetRunwayReturn = FunctionReturn<typeof functions.getRunway>;
export type GetStateParams = FunctionArguments<typeof functions.getState>;
export type GetStateReturn = FunctionReturn<typeof functions.getState>;
export type GetTicketCountParams = FunctionArguments<typeof functions.getTicketCount>;
export type GetTicketCountReturn = FunctionReturn<typeof functions.getTicketCount>;
export type GetTotalDrainRateParams = FunctionArguments<typeof functions.getTotalDrainRate>;
export type GetTotalDrainRateReturn = FunctionReturn<typeof functions.getTotalDrainRate>;
export type GetTotalProcessedParams = FunctionArguments<typeof functions.getTotalProcessed>;
export type GetTotalProcessedReturn = FunctionReturn<typeof functions.getTotalProcessed>;
export type GetWithdrawalWaitingTimestampParams = FunctionArguments<typeof functions.getWithdrawalWaitingTimestamp>;
export type GetWithdrawalWaitingTimestampReturn = FunctionReturn<typeof functions.getWithdrawalWaitingTimestamp>;
export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>;
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>;
export type HasRoleParams = FunctionArguments<typeof functions.hasRole>;
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>;
export type InitializeParams = FunctionArguments<typeof functions.initialize>;
export type InitializeReturn = FunctionReturn<typeof functions.initialize>;
export type InitializeCreditParams = FunctionArguments<typeof functions.initializeCredit>;
export type InitializeCreditReturn = FunctionReturn<typeof functions.initializeCredit>;
export type IsOutOfMoneyParams = FunctionArguments<typeof functions.isOutOfMoney>;
export type IsOutOfMoneyReturn = FunctionReturn<typeof functions.isOutOfMoney>;
export type IsWhitelistedParams = FunctionArguments<typeof functions.isWhitelisted>;
export type IsWhitelistedReturn = FunctionReturn<typeof functions.isWhitelisted>;
export type LastEffectiveRewardTsParams = FunctionArguments<typeof functions.lastEffectiveRewardTs>;
export type LastEffectiveRewardTsReturn = FunctionReturn<typeof functions.lastEffectiveRewardTs>;
export type LptTokenParams = FunctionArguments<typeof functions.lptToken>;
export type LptTokenReturn = FunctionReturn<typeof functions.lptToken>;
export type MulticallParams = FunctionArguments<typeof functions.multicall>;
export type MulticallReturn = FunctionReturn<typeof functions.multicall>;
export type OnLPTTransferParams = FunctionArguments<typeof functions.onLPTTransfer>;
export type OnLPTTransferReturn = FunctionReturn<typeof functions.onLPTTransfer>;
export type PauseParams = FunctionArguments<typeof functions.pause>;
export type PauseReturn = FunctionReturn<typeof functions.pause>;
export type PausedParams = FunctionArguments<typeof functions.paused>;
export type PausedReturn = FunctionReturn<typeof functions.paused>;
export type PerStakeRateWadParams = FunctionArguments<typeof functions.perStakeRateWad>;
export type PerStakeRateWadReturn = FunctionReturn<typeof functions.perStakeRateWad>;
export type ProviderRatePerSecParams = FunctionArguments<typeof functions.providerRatePerSec>;
export type ProviderRatePerSecReturn = FunctionReturn<typeof functions.providerRatePerSec>;
export type RecoverRewardsFromFailedParams = FunctionArguments<typeof functions.recoverRewardsFromFailed>;
export type RecoverRewardsFromFailedReturn = FunctionReturn<typeof functions.recoverRewardsFromFailed>;
export type RemoveFromWhitelistParams = FunctionArguments<typeof functions.removeFromWhitelist>;
export type RemoveFromWhitelistReturn = FunctionReturn<typeof functions.removeFromWhitelist>;
export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>;
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>;
export type RequestExitParams = FunctionArguments<typeof functions.requestExit>;
export type RequestExitReturn = FunctionReturn<typeof functions.requestExit>;
export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>;
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>;
export type RewardPerStakeStoredParams = FunctionArguments<typeof functions.rewardPerStakeStored>;
export type RewardPerStakeStoredReturn = FunctionReturn<typeof functions.rewardPerStakeStored>;
export type SetCapacityParams = FunctionArguments<typeof functions.setCapacity>;
export type SetCapacityReturn = FunctionReturn<typeof functions.setCapacity>;
export type SetDistributionRateParams = FunctionArguments<typeof functions.setDistributionRate>;
export type SetDistributionRateReturn = FunctionReturn<typeof functions.setDistributionRate>;
export type SetWhitelistEnabledParams = FunctionArguments<typeof functions.setWhitelistEnabled>;
export type SetWhitelistEnabledReturn = FunctionReturn<typeof functions.setWhitelistEnabled>;
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
export type TopUpRewardsParams = FunctionArguments<typeof functions.topUpRewards>;
export type TopUpRewardsReturn = FunctionReturn<typeof functions.topUpRewards>;
export type TotalDistributionRatePerSecParams = FunctionArguments<typeof functions.totalDistributionRatePerSec>;
export type TotalDistributionRatePerSecReturn = FunctionReturn<typeof functions.totalDistributionRatePerSec>;
export type TreasuryAccumulatedParams = FunctionArguments<typeof functions.treasuryAccumulated>;
export type TreasuryAccumulatedReturn = FunctionReturn<typeof functions.treasuryAccumulated>;
export type TreasuryRatePerSecParams = FunctionArguments<typeof functions.treasuryRatePerSec>;
export type TreasuryRatePerSecReturn = FunctionReturn<typeof functions.treasuryRatePerSec>;
export type TryMulticallParams = FunctionArguments<typeof functions.tryMulticall>;
export type TryMulticallReturn = FunctionReturn<typeof functions.tryMulticall>;
export type UnpauseParams = FunctionArguments<typeof functions.unpause>;
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>;
export type WhitelistParams = FunctionArguments<typeof functions.whitelist>;
export type WhitelistReturn = FunctionReturn<typeof functions.whitelist>;
export type WhitelistEnabledParams = FunctionArguments<typeof functions.whitelistEnabled>;
export type WhitelistEnabledReturn = FunctionReturn<typeof functions.whitelistEnabled>;
export type WithdrawExitParams = FunctionArguments<typeof functions.withdrawExit>;
export type WithdrawExitReturn = FunctionReturn<typeof functions.withdrawExit>;
export type WithdrawFromFailedParams = FunctionArguments<typeof functions.withdrawFromFailed>;
export type WithdrawFromFailedReturn = FunctionReturn<typeof functions.withdrawFromFailed>;
export type WorkerPoolAddressParams = FunctionArguments<typeof functions.workerPoolAddress>;
export type WorkerPoolAddressReturn = FunctionReturn<typeof functions.workerPoolAddress>;
