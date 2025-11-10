import { handleVestingCreated } from './Created.handler'
import { handleVestingReleased } from './ERC20Released.handler'
import { handleVestingTransfered } from './Transfered.handler'

export const handlers = [handleVestingCreated, handleVestingTransfered, handleVestingReleased]
