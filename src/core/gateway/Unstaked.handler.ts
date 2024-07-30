import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createGatewayOperatorId } from '../helpers/ids';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { GatewayStake } from '~/model';
import { toHumanSQD } from '~/utils/misc';

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

    const stakeId = createGatewayOperatorId(event.gatewayOperator);
    const stakeDeferred = ctx.store.defer(GatewayStake, {
      id: stakeId,
      relations: { owner: true },
    });

    ctx.queue.add(async () => {
      const stake = await stakeDeferred.getOrFail();
      const account = stake.owner;

      stake.amount = 0n;
      stake.computationUnits = 0n;
      stake.lockStart = null;
      stake.lockEnd = null;
      stake.computationUnitsPending = null;

      await ctx.store.upsert(stake);

      ctx.log.info(`account(${account.id}) unstaked ${toHumanSQD(event.amount)}`);
    });
  },
});
