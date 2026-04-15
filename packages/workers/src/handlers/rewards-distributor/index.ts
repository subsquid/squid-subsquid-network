import { handleRewardsClaimed } from './Claimed.handler'
import { rewardsDistributedHandler } from './Distributed.handler'

export const handlers = [handleRewardsClaimed, rewardsDistributedHandler]
