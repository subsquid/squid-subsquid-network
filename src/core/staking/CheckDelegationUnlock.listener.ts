import assert from 'assert';

import { MappingContext, Events } from '../../types';

import { Delegation } from '~/model';

export function listenDelegationUnlock(ctx: MappingContext, id: string) {
  const delegationDeferred = ctx.store.defer(Delegation, id);

  const listenerId = `delegation-unlock-${id}`;
  ctx.events.on(
    Events.BlockStart,
    async (block) => {
      const delegation = await delegationDeferred.getOrFail();
      assert(delegation.lockEnd);
      if (delegation.lockEnd > block.l1BlockNumber) return;

      delegation.locked = false;
      await ctx.store.upsert(delegation);

      ctx.log.info(`delegation(${delegation.id}) unlocked`);

      ctx.events.off(Events.BlockStart, listenerId);
    },
    {
      id: listenerId,
    },
  );
}
