import { handleBondAmountUpdated } from './BondAmountUpdated.handler'
import { handleEpochLengthUpdated } from './EpochLengthUpdated.handler'
import { handleLockPeriodUpdated } from './LockPeriodUpdated.handler'

export const handlers = [handleBondAmountUpdated, handleEpochLengthUpdated, handleLockPeriodUpdated]
