import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';

import * as NetworkController from '~/abi/NetworkController';
import { network } from '~/config/network';
import { Settings } from '~/model';

export const handleBondAmountUpdated = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.NetworkController.address) &&
      isContract(item, network.contracts.OldNetworkController.address) &&
      isLog(item) &&
      NetworkController.events.BondAmountUpdated.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const { bondAmount } = NetworkController.events.BondAmountUpdated.decode(log);

    const settingsDeferred = ctx.store.defer(Settings, network.name);

    ctx.tasks.add(async () => {
      const settings = await settingsDeferred.getOrFail();

      settings.bondAmount = bondAmount;

      await ctx.store.upsert(settings);

      ctx.log.debug(`set bond amount set ${bondAmount}`);
    });
  },
});
