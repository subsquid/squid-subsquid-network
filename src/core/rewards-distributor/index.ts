import { handleClaimed } from './Claimed.handler';
import { handleDistributed } from './Distributed.handler';

export const handlers = [handleClaimed, handleDistributed];
