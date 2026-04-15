import { DataSourceBuilder } from '@subsquid/evm-stream';
import type { ContractConfig } from '../network';
export type RewardCalculationMetadata = {
    height: number;
    rewardCalculation: ContractConfig[];
};
export declare function addRewardCalculationQuery(builder: DataSourceBuilder): void;
