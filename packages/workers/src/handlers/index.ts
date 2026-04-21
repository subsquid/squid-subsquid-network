import * as NetworkController from './network-controller'
import * as RewardsDistributor from './rewards-distributor'
import * as Router from './router'
import * as Staking from './staking'
import * as WorkerHandlers from './worker'

export const handlers = [
  ...NetworkController.handlers,
  ...RewardsDistributor.handlers,
  ...Staking.handlers,
  ...WorkerHandlers.handlers,
  ...Router.handlers,
]

export { ensureWorkerStatusApplyQueue, processWorkerStatusApplyQueue } from './worker'
export { ensureWorkerUnlock, processWorkerUnlockQueue } from './worker'
export { ensureDelegationUnlockQueue, processDelegationUnlockQueue } from './staking'
export { flushAprRecalc, markAprDirty, recalculateWorkerAprs, refreshWorkerCap } from './cap'
export { updateWorkersOnline, updateWorkersMetrics, updateWorkerRewardStats } from './metrics'
