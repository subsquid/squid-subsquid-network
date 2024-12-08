import { isContract, isLog, LogItem } from '../../item';
import { createHandler, createHandlerOld } from '../base';

import * as NetworkController from '~/abi/NetworkController';
import { network } from '~/config/network';
import { Epoch, Settings } from '~/model';
import { toNextEpochStart } from '~/utils/misc';

export const handleEpochLengthUpdated = createHandler((ctx, item) => {
  if (!isLog(item)) return;
  if (!NetworkController.events.BondAmountUpdated.is(item.value)) return;

  const log = item.value;
  const event = NetworkController.events.EpochLengthUpdated.decode(log);

  const settingsDeferred = ctx.store.defer(Settings, network.name);

  return async () => {
    const settings = await settingsDeferred.getOrFail();
    if (log.address !== settings.contracts.networkController) return;

    settings.epochLength = Number(event.epochLength);
    await ctx.store.upsert(settings);

    // // TODO: remove after contract fix
    // const currentEpoch = await ctx.store.findOne(Epoch, { where: {}, order: { start: 'DESC' } });
    // if (currentEpoch) {
    //   currentEpoch.end = toNextEpochStart(log.block.l1BlockNumber, epochLength) - 1;
    //   await ctx.store.upsert(currentEpoch);
    // }

    ctx.log.debug(`set epoch length to ${settings.epochLength}`);
  };
});
