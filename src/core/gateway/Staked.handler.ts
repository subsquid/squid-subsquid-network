import {toHumanSQD} from '~/utils/misc';
import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { unwrapAccount } from '../helpers/entities';
import { createAccountId, createGatewayOperatorId, createGatewayStakeId } from '../helpers/ids';

import { listenStakeApply } from './CheckStakeApply.listener';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { Account, GatewayOperator, GatewayStake } from '~/model';

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

    const operatorId = createGatewayOperatorId(event.gatewayOperator);
    const operatorDeferred = ctx.store.defer(GatewayOperator, {
      id: operatorId,
      relations: { account: { owner: true }, stake: true, pendingStake: true },
    });

    ctx.queue.add(async () => {
      const account = await accountDeferred.getOrFail();

      const operator = await operatorDeferred.getOrInsert(async (id) => {
        return new GatewayOperator({
          id,
          account,
          autoExtension: false,
        });
      });

      let stake: GatewayStake;
      if (operator.pendingStake) {
        stake = operator.pendingStake;

        stake.amount += event.amount;

        await ctx.store.upsert(stake);
      } else {
        const index = operator.stake ? operator.stake.index + 1 : 0;
        const amount = operator.stake ? operator.stake.amount + event.amount : event.amount;

        stake = new GatewayStake({
          id: createGatewayStakeId(operator.id, index),
          index,
          operator,
          owner: unwrapAccount(account),
          lockStart: Number(event.lockStart),
          lockEnd: event.lockEnd > INT32_MAX ? INT32_MAX : Number(event.lockEnd),
          amount,
          computationUnits: event.computationUnits,
          locked: true,
        });
        await ctx.store.insert(stake);

        operator.pendingStake = stake;
        await ctx.store.upsert(operator);

        ctx.log.info(
          `account(${account.id}) staked ${toHumanSQD(stake.amount)} for [${stake.lockStart}, ${stake.lockEnd}]`,
        );

        listenStakeApply(ctx, stake.id);
      }
    });
  },
});

const INT32_MAX = 2_147_483_647;
