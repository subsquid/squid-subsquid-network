import { handleVestingCreated } from './VestingCreated.handler'
import { handleVestingTransferred } from './VestingTransferred.handler'
import { handleTemporaryHoldingCreated } from './TemporaryHoldingCreated.handler'

export { ensureTemporaryHoldingUnlockQueue, processTemporaryHoldingUnlockQueue } from './TemporaryHoldingCreated.handler'

export const handlers = [
  handleVestingCreated,
  handleVestingTransferred,
  handleTemporaryHoldingCreated,
]
