import { isContract, isLog, LogItem } from '../../item';
import { createHandler, createHandlerOld } from '../base';

import * as NetworkController from '~/abi/NetworkController';
import { network } from '~/config/network';
import { Settings } from '~/model';

export const handleBondAmountUpdated = createHandler((ctx, item) => {
  if (!isLog(item)) return;
  if (!NetworkController.events.BondAmountUpdated.is(item.value)) return;

  const log = item.value;
  const { bondAmount } = NetworkController.events.BondAmountUpdated.decode(log);

  const settingsDeferred = ctx.store.defer(Settings, network.name);

  return async () => {
    const settings = await settingsDeferred.getOrFail();
    if (log.address !== settings.contracts.networkController) return;

    settings.bondAmount = bondAmount;

    await ctx.store.upsert(settings);

    ctx.log.debug(`set bond amount set ${bondAmount}`);
  };
});
