import assert from 'assert';

import { MappingContext, Events } from '../../types';

import { GatewayStake } from '~/model';

export function listenGatewayStakeUnlock(ctx: MappingContext, id: string) {
  const operatorDeferred = ctx.store.defer(GatewayStake, id);

  const listenerId = `stake-unlock-${id}`;
  ctx.events.off(Events.BlockStart, listenerId);
  ctx.events.on(
    Events.BlockStart,
    async (block: { l1BlockNumber: number; timestamp: number }) => {
      const operator = await operatorDeferred.getOrFail();

      assert(operator.locked, `operator(${operator.id}) already unlocked`);
      if (operator.lockEnd && operator.lockEnd > block.l1BlockNumber) return;

      operator.locked = false;
      await ctx.store.upsert(operator);

      ctx.log.info(`operator(${operator.id}) unlocked`);

      ctx.events.off(Events.BlockStart, listenerId);
    },
    {
      id: listenerId,
    },
  );
}
