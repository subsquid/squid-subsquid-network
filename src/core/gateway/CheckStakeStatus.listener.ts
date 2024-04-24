import assert from 'assert';

import { MappingContext, Events } from '../../types';

import { GatewayStake } from '~/model';

export function listenStakeUnlock(ctx: MappingContext, id: string) {
  const stakeDeferred = ctx.store.defer(GatewayStake, {
    id,
    relations: { operator: true },
  });

  const listenerId = `stake-unlock-${id}`;
  ctx.events.off(Events.BlockStart, listenerId);
  ctx.events.on(
    Events.BlockStart,
    async (block: { l1BlockNumber: number; timestamp: number }) => {
      const stake = await stakeDeferred.get();
      if (!stake) return; // was deleted in favor of new stake

      assert(stake.locked, `stake(${stake.id}) already unlocked`);
      if (stake.lockEnd > block.l1BlockNumber) return;

      stake.locked = false;
      await ctx.store.upsert(stake);

      ctx.log.info(`stake(${stake.id}) unlocked`);

      ctx.events.off(Events.BlockStart, listenerId);
    },
    {
      id: listenerId,
    },
  );
}
