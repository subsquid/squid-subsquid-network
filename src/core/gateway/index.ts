import { autoExtensionChangedHandler } from './AutoExtensionChanged.handler';
import { handleMetadataChanged } from './MetadataChanged.handler';
import { handleRegistered } from './Registered.handler';
import { gatewayStakedHandler } from './Staked.handler';
import { handleUnregistered } from './Unregistered.handler';
import { handleUnstaked } from './Unstaked.handler';

export const handlers = [
  handleUnstaked,
  gatewayStakedHandler,
  handleMetadataChanged,
  handleRegistered,
  handleUnregistered,
  autoExtensionChangedHandler,
];
