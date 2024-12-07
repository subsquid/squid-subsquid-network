import { isContract, isLog } from '../../item';
import { createHandler } from '../base';
import { createGatewayOperatorId } from '../helpers/ids';

import { listenGatewayStakeUnlock } from './CheckStakeStatus.listener';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { GatewayStake } from '~/model';

export const autoExtensionChangedHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return;
  if (!isLog(item)) return;
  if (
    !GatewayRegistry.events.AutoextensionEnabled.is(item.value) &&
    !GatewayRegistry.events.AutoextensionDisabled.is(item.value)
  )
    return;

  const log = item.value;

  let gatewayOperator: string, lockEnd: number | null, autoExtension: boolean;

  if (GatewayRegistry.events.AutoextensionEnabled.is(log)) {
    const data = GatewayRegistry.events.AutoextensionEnabled.decode(log);
    gatewayOperator = data.gatewayOperator;
    lockEnd = null;
    autoExtension = true;
  } else {
    const data = GatewayRegistry.events.AutoextensionDisabled.decode(log);
    gatewayOperator = data.gatewayOperator;
    lockEnd = Number(data.lockEnd);
    autoExtension = false;
  }

  const stakeId = createGatewayOperatorId(gatewayOperator);
  const stakeDeferred = ctx.store.defer(GatewayStake, stakeId);

  return async () => {
    const stake = await stakeDeferred.get();
    // for some reason it's possible to change autoExtension before staking any tokens
    if (!stake) return;

    stake.autoExtension = autoExtension;
    stake.lockEnd = lockEnd;

    await ctx.store.upsert(stake);

    listenGatewayStakeUnlock(ctx, stake.id);
  };
});
