import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';

import * as NetworkController from '~/abi/NetworkController';
import { network } from '~/config/network';
import { Epoch, Settings } from '~/model';
import { toNextEpochStart } from '~/utils/misc';

export const handleEpochLengthUpdated = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.NetworkController.address) &&
      isContract(item, network.contracts.OldNetworkController.address) &&
      isLog(item) &&
      NetworkController.events.EpochLengthUpdated.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = NetworkController.events.EpochLengthUpdated.decode(log);
    const epochLength = Number(event.epochLength);

    const settingsDeferred = ctx.store.defer(Settings, network.name);

    return async () => {
      const settings = await settingsDeferred.getOrFail();

      settings.epochLength = epochLength;
      await ctx.store.upsert(settings);

      // // TODO: remove after contract fix
      // const currentEpoch = await ctx.store.findOne(Epoch, { where: {}, order: { start: 'DESC' } });
      // if (currentEpoch) {
      //   currentEpoch.end = toNextEpochStart(log.block.l1BlockNumber, epochLength) - 1;
      //   await ctx.store.upsert(currentEpoch);
      // }

      ctx.log.debug(`set epoch length to ${epochLength}`);
    };
  },
});
