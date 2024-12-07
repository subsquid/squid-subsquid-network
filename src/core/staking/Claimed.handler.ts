import assert from 'assert';

import { isContract, isLog, LogItem } from '../../item';
import { createHandlerOld } from '../base';
import { createAccountId, createDelegationId, createWorkerId } from '../helpers/ids';

import * as Staking from '~/abi/Staking';
import { network } from '~/config/network';
import { Account, Claim, ClaimType, Delegation } from '~/model';
import { toHumanSQD } from '~/utils/misc';

export const handleClaimed = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.Staking) &&
      isLog(item) &&
      Staking.events.Claimed.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const { staker: stakerAccount, workerIds: workerIndexes } = Staking.events.Claimed.decode(log);

    const accountId = createAccountId(stakerAccount);
    const accountDeferred = ctx.store.defer(Account, accountId);

    const workerIds = workerIndexes.map((i) => createWorkerId(i));
    const delegationIds = workerIds.map((workerId) => createDelegationId(workerId, accountId));
    const delegationsDeferred = delegationIds.map((id) =>
      ctx.store.defer(Delegation, {
        id,
        relations: {
          owner: true,
          realOwner: true,
        },
      }),
    );

    return async () => {
      const account = await accountDeferred.getOrFail();

      let delegations: Delegation[];
      if (account.claimableDelegationCount > delegationsDeferred.length) {
        delegations = await ctx.store.find(Delegation, {
          where: {
            owner: account,
          },
          relations: {
            realOwner: true,
          },
        });
      } else {
        delegations = await Promise.all(delegationsDeferred.map((d) => d.getOrFail()));
      }

      for (let i = 0; i < delegations.length; i++) {
        const delegation = delegations[i];

        const amount = delegation.claimableReward;
        if (amount === 0n) continue;

        delegation.claimableReward = 0n;
        delegation.claimedReward += amount;

        await ctx.store.upsert(delegation);

        const claimer = delegation.realOwner;
        const claim = new Claim({
          id: `${log.id}-${String(i).padStart(5, '0')}`,
          blockNumber: log.block.height,
          timestamp: new Date(log.block.timestamp),
          type: ClaimType.DELEGATION,
          account: claimer,
          delegation,
          amount,
        });

        ctx.log.info(
          `account(${claimer.id}) claimed ${toHumanSQD(claim.amount)} from delegation(${delegation.id})`,
        );

        await ctx.store.insert(claim);
      }

      account.claimableDelegationCount = 0;
      await ctx.store.upsert(account);
    };
  },
});
