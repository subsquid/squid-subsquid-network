import { handleDeposited } from './Deposited.handler'
import { handleExitClaimed } from './ExitClaimed.handler'
import { handlePoolCreated } from './PoolCreated.handler'
import { handleWithdrawn } from './Withdrawn.handler'

export const handlers = [handlePoolCreated, handleDeposited, handleWithdrawn, handleExitClaimed]
