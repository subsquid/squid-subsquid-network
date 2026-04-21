import { autoExtensionChangedHandler } from './gateway/AutoExtensionChanged.handler'
import { handleMetadataChanged } from './gateway/MetadataChanged.handler'
import { handleRegistered } from './gateway/Registered.handler'
import { gatewayStakedHandler } from './gateway/Staked.handler'
import { handleUnregistered } from './gateway/Unregistered.handler'
import { handleUnstaked } from './gateway/Unstaked.handler'

import { handleCapacityUpdated } from './pool/CapacityUpdated.handler'
import { handleDeposited } from './pool/Deposited.handler'
import { handleDistributionRateChanged } from './pool/DistributionRateChanged.handler'
import { handleExitClaimed } from './pool/ExitClaimed.handler'
import { handleExitRequested } from './pool/ExitRequested.handler'
import { handlePoolClosed } from './pool/PoolClosed.handler'
import { handlePoolCreated } from './pool/PoolCreated.handler'
import { handleRewardsClaimed } from './pool/RewardsClaimed.handler'
import { handleRewardsToppedUp } from './pool/RewardsToppedUp.handler'
import { handleWithdrawn } from './pool/Withdrawn.handler'

export const handlers = [
  handleRegistered,
  handleUnregistered,
  gatewayStakedHandler,
  handleUnstaked,
  handleMetadataChanged,
  autoExtensionChangedHandler,
  handlePoolCreated,
  handlePoolClosed,
  handleDeposited,
  handleWithdrawn,
  handleExitRequested,
  handleExitClaimed,
  handleRewardsToppedUp,
  handleRewardsClaimed,
  handleCapacityUpdated,
  handleDistributionRateChanged,
]

export {
  ensureGatewayStakeApplyQueue,
  processGatewayStakeApplyQueue,
} from './gateway/StakeApply.queue'
export {
  ensureGatewayStakeUnlockQueue,
  processGatewayStakeUnlockQueue,
} from './gateway/StakeUnlock.queue'
