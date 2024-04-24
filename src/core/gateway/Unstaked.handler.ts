import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createGatewayOperatorId } from '../helpers/ids';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { GatewayOperator } from '~/model';

export const handleUnstaked = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      GatewayRegistry.events.Unstaked.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = GatewayRegistry.events.Unstaked.decode(log);

    const operatorId = createGatewayOperatorId(event.gatewayOperator);
    const operatorDeferred = ctx.store.defer(GatewayOperator, {
      id: operatorId,
      relations: { account: { owner: true }, stake: true },
    });

    ctx.queue.add(async () => {
      const operator = await operatorDeferred.getOrFail();
      const account = operator.account;

      if (operator.stake) {
        const stake = operator.stake;

        operator.stake = null;
        await ctx.store.upsert(operator);
        await ctx.store.remove(stake);

        ctx.log.info(`account(${account.id}) unstaked ${stake.amount}$SQD`);
      }
    });
  },
});
