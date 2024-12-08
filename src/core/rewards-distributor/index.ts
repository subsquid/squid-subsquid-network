import { handleClaimed } from './Claimed.handler';
import { rewardsDistributedHandler } from './Distributed.handler';

export const handlers = [handleClaimed, rewardsDistributedHandler];
