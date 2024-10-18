import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createGatewayOperatorId } from '../helpers/ids';

import { listenGatewayStakeUnlock } from './CheckStakeStatus.listener';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { GatewayStake } from '~/model';

export const handleAutoExtensionChanged = createHandler({
  filter: (_, item): item is LogItem => {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      (GatewayRegistry.events.AutoextensionEnabled.is(item.value) ||
        GatewayRegistry.events.AutoextensionDisabled.is(item.value))
    );
  },
  handle: (ctx, { value: log }) => {
    let gatewayOperator: string, lockEnd: number, autoExtension: boolean;

    if (GatewayRegistry.events.AutoextensionEnabled.is(log)) {
      const data = GatewayRegistry.events.AutoextensionEnabled.decode(log);
      (gatewayOperator = data.gatewayOperator), (lockEnd = INT32_MAX);
      autoExtension = true;
    } else {
      const data = GatewayRegistry.events.AutoextensionDisabled.decode(log);
      (gatewayOperator = data.gatewayOperator), (lockEnd = Number(data.lockEnd));
      autoExtension = false;
    }

    const stakeId = createGatewayOperatorId(gatewayOperator);
    const stakeDeferred = ctx.store.defer(GatewayStake, stakeId);

    ctx.tasks.add(async () => {
      const stake = await stakeDeferred.get();
      if (!stake) return;

      stake.autoExtension = autoExtension;
      stake.lockEnd = lockEnd;

      await ctx.store.upsert(stake);

      listenGatewayStakeUnlock(ctx, stake.id);
    });
  },
});

const INT32_MAX = 2_147_483_647;
