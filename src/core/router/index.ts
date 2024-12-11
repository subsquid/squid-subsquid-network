import { networkControllerSetHandler } from './NetworkController.handler'
import { rewardCalculationSetHandler } from './RewardCalculation.handler'
import { rewardTreasurySetHandler } from './RewardTreasury.handler'
import { stakingSetHandler } from './Staking.handler'
import { workerRegistrationSetHandler } from './WorkerRegistration.handler'

export const handlers = [
  networkControllerSetHandler,
  workerRegistrationSetHandler,
  rewardCalculationSetHandler,
  rewardTreasurySetHandler,
  stakingSetHandler,
]
