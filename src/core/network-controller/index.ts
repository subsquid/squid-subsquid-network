import { handleBondAmountUpdated } from './BondAmountUpdated.handler'
// import { handleDelegationLimitCoefficientUpdated } from './DelegationLimitCoefficienUpdated.handler';
import { handleEpochLengthUpdated } from './EpochLengthUpdated.handler'
import { handleLockPeriodUpdated } from './LockPeriodUpdated.handler'

export const handlers = [
  handleBondAmountUpdated,
  // handleDelegationLimitCoefficientUpdated,
  handleEpochLengthUpdated,
  handleLockPeriodUpdated,
]
