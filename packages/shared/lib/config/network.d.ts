export type ContractConfig = {
    address: string;
    range: {
        from: number;
        to?: number;
    };
};
export type NetworkConfig = {
    name: 'mainnet' | 'tethys';
    contracts: {
        SQD: ContractConfig;
        Router: ContractConfig;
        VestingFactory: ContractConfig;
        RewardsDistribution: ContractConfig;
        GatewayRegistry: ContractConfig;
        Multicall3: ContractConfig;
        SoftCap: ContractConfig;
        TemporaryHoldingFactory: ContractConfig;
        PortalPoolFactory: ContractConfig;
    };
    defaultRouterContracts: {
        networkController: string;
        rewardCalculation: string;
        rewardTreasury: string;
        workerRegistration: string;
        staking: string;
    };
    epochsStart: number;
    range: {
        from: number;
        to?: number;
    };
};
export declare const network: NetworkConfig;
