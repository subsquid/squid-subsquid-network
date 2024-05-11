import { handleVestingCreated } from './Created.handler';
import { handleVestingTransfered } from './Transfered.handler';

export const handlers = [handleVestingCreated, handleVestingTransfered];
