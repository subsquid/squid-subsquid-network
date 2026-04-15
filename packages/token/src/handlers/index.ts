import { handleStakingDeposited, handleStakingWithdrawn } from './DelegationStaking.handler'
import { handleGatewayStaked, handleGatewayUnstaked } from './GatewayStaking.handler'
import {
  handlePortalPoolDeposited,
  handlePortalPoolExitClaimed,
  handlePortalPoolWithdrawn,
} from './PortalPool.handler'
import { handleRewardTreasuryClaimed } from './RewardTreasury.handler'
import {
  rewardTreasurySetHandler,
  stakingSetHandler,
  workerRegistrationSetHandler,
} from './Router.handler'
import { handleTransfer } from './Transfer.handler'
import { handleVestingCreated } from './VestingCreated.handler'
import { handleVestingReleased } from './VestingRelease.handler'
import {
  handleExcessiveBondReturned,
  handleWorkerRegistered,
  handleWorkerWithdrawn,
} from './WorkerStaking.handler'

export const handlers = [
  handleTransfer,
  handleWorkerRegistered,
  handleWorkerWithdrawn,
  handleExcessiveBondReturned,
  handleStakingDeposited,
  handleStakingWithdrawn,
  handleGatewayStaked,
  handleGatewayUnstaked,
  handlePortalPoolDeposited,
  handlePortalPoolWithdrawn,
  handlePortalPoolExitClaimed,
  handleRewardTreasuryClaimed,
  stakingSetHandler,
  workerRegistrationSetHandler,
  rewardTreasurySetHandler,
  handleVestingCreated,
  handleVestingReleased,
]
