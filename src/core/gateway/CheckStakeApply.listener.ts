import assert from 'assert';

import { isNil } from 'lodash';

import { MappingContext, Events } from '../../types';

import { GatewayStake } from '~/model';

export function listenStakeApply(ctx: MappingContext, id: string) {
  const stakeDeferred = ctx.store.defer(GatewayStake, id);

  const listenerId = `stake-apply-${id}`;

  ctx.events.off(Events.BlockStart, listenerId);
  ctx.events.on(
    Events.BlockStart,
    async (block) => {
      const stake = await stakeDeferred.getOrFail();
      if (stake.lockStart && stake.lockStart > block.l1BlockNumber) return;

      assert(
        !isNil(stake.computationUnitsPending),
        `pending computation units is equal to ${stake.computationUnitsPending}`,
      );

      stake.computationUnits = stake.computationUnitsPending;
      stake.computationUnitsPending = null;
      await ctx.store.upsert(stake);

      ctx.log.info(`stake(${stake.id}) applied`);

      ctx.events.off(Events.BlockStart, listenerId);
    },
    {
      id: listenerId,
    },
  );
}
