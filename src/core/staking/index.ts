import { handleClaimed } from './Claimed.handler';
import { handleDeposited } from './Deposited.handler';
import { handleWithdrawn } from './Withdrawn.handler';

export const handlers = [handleWithdrawn, handleDeposited, handleClaimed];
