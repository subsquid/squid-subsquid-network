import { handleWorkerDeregistered } from './Deregistered.handler';
import { handleExcessiveBondReturned } from './ExcessiveBondReturned.handler';
import { handleMetadataUpdated } from './MetadataUpdated.handler';
import { handleWorkerRegistered } from './Registered.handler';
import { handleWorkerWithdrawn } from './Withdrawn.handler';

export const handlers = [
  handleWorkerDeregistered,
  handleExcessiveBondReturned,
  handleMetadataUpdated,
  handleWorkerRegistered,
  handleWorkerWithdrawn,
];
