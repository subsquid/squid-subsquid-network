import { autoExtensionChangedHandler } from './AutoExtensionChanged.handler';
import { handleMetadataChanged } from './MetadataChanged.handler';
import { handleRegistered } from './Registered.handler';
import { handleStaked } from './Staked.handler';
import { handleUnregistered } from './Unregistered.handler';
import { handleUnstaked } from './Unstaked.handler';

export const handlers = [
  handleUnstaked,
  handleStaked,
  handleMetadataChanged,
  handleRegistered,
  handleUnregistered,
  autoExtensionChangedHandler,
];
