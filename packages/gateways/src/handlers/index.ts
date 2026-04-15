import { autoExtensionChangedHandler } from './AutoExtensionChanged.handler'
import { handleDeposited } from './Deposited.handler'
import { handleExitClaimed } from './ExitClaimed.handler'
import { handleMetadataChanged } from './MetadataChanged.handler'
import { handlePoolCreated } from './PoolCreated.handler'
import { handleRegistered } from './Registered.handler'
import { gatewayStakedHandler } from './Staked.handler'
import { handleUnregistered } from './Unregistered.handler'
import { handleUnstaked } from './Unstaked.handler'
import { handleWithdrawn } from './Withdrawn.handler'

export const handlers = [
  handleRegistered,
  handleUnregistered,
  gatewayStakedHandler,
  handleUnstaked,
  handleMetadataChanged,
  autoExtensionChangedHandler,
  handlePoolCreated,
  handleDeposited,
  handleWithdrawn,
  handleExitClaimed,
]

export { ensureGatewayStakeApplyQueue, processGatewayStakeApplyQueue } from './StakeApply.queue'
export { ensureGatewayStakeUnlockQueue, processGatewayStakeUnlockQueue } from './StakeUnlock.queue'
