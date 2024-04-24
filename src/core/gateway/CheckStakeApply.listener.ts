import { MappingContext, Events } from '../../types';

import { listenStakeUnlock } from './CheckStakeStatus.listener';

import { GatewayStake } from '~/model';

export function listenStakeApply(ctx: MappingContext, id: string) {
  const stakeDeferred = ctx.store.defer(GatewayStake, {
    id,
    relations: { operator: { stake: true } },
  });

  const listenerId = `stake-apply-${id}`;

  ctx.events.off(Events.BlockStart, listenerId);
  ctx.events.on(
    Events.BlockStart,
    async (block) => {
      const stake = await stakeDeferred.getOrFail();
      if (stake.lockStart > block.l1BlockNumber) return;

      const operator = stake.operator;
      if (operator.stake) {
        await ctx.store.remove(operator.stake);
      }

      operator.stake = stake;
      operator.pendingStake = null;
      await ctx.store.upsert(operator);

      ctx.log.info(`stake(${stake.id}) applied`);

      listenStakeUnlock(ctx, stake.id);

      ctx.events.off(Events.BlockStart, listenerId);
    },
    {
      id: listenerId,
    },
  );
}
