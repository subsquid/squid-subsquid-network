import { handleTransfer } from './Transfer.handler'
import {
  handleWorkerRegistered,
  handleWorkerWithdrawn,
  handleExcessiveBondReturned,
} from './WorkerStaking.handler'
import { handleStakingDeposited, handleStakingWithdrawn } from './DelegationStaking.handler'
import { handleGatewayStaked, handleGatewayUnstaked } from './GatewayStaking.handler'
import {
  handlePortalPoolDeposited,
  handlePortalPoolWithdrawn,
  handlePortalPoolExitClaimed,
} from './PortalPool.handler'
import { handleRewardTreasuryClaimed } from './RewardTreasury.handler'
import {
  stakingSetHandler,
  workerRegistrationSetHandler,
  rewardTreasurySetHandler,
} from './Router.handler'
import { handleVestingCreated } from './VestingCreated.handler'
import { handleVestingReleased } from './VestingRelease.handler'

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
