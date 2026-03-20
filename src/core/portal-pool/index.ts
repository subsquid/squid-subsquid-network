import { handlePoolCreated } from './PoolCreated.handler'
import { handleDeposited } from './Deposited.handler'
import { handleWithdrawn } from './Withdrawn.handler'
import { handleExitClaimed } from './ExitClaimed.handler'

export const handlers = [handlePoolCreated, handleDeposited, handleWithdrawn, handleExitClaimed]
