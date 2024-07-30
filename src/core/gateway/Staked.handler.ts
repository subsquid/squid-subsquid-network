import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createGatewayStake, unwrapAccount } from '../helpers/entities';
import { createAccountId, createGatewayOperatorId, createGatewayStakeId } from '../helpers/ids';

import { listenStakeApply } from './CheckStakeApply.listener';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { Account, GatewayStake } from '~/model';
import { toHumanSQD } from '~/utils/misc';

export const handleStaked = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      GatewayRegistry.events.Staked.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = GatewayRegistry.events.Staked.decode(log);

    const accountId = createAccountId(event.gatewayOperator);
    const accountDeferred = ctx.store.defer(Account, {
      id: accountId,
      relations: { owner: true },
    });

    const stakeId = createGatewayOperatorId(event.gatewayOperator);
    const stakeDeferred = ctx.store.defer(GatewayStake, stakeId);

    ctx.queue.add(async () => {
      const account = await accountDeferred.getOrFail();

      const stake = await stakeDeferred.getOrInsert(async (id) =>
        createGatewayStake(id, {
          owner: account,
          realOwner: unwrapAccount(account),
        }),
      );

      stake.amount += event.amount;
      stake.computationUnitsPending = event.computationUnits;

      stake.lockStart = Number(event.lockStart);
      stake.lockEnd = event.lockEnd > INT32_MAX ? INT32_MAX : Number(event.lockEnd);
      stake.locked = true;

      await ctx.store.upsert(stake);

      ctx.log.info(
        `account(${account.id}) staked ${toHumanSQD(stake.amount)} for [${stake.lockStart}, ${stake.lockEnd}]`,
      );

      listenStakeApply(ctx, stake.id);
    });
  },
});

const INT32_MAX = 2_147_483_647;
