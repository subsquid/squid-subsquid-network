import assert from 'assert';

import { isContract, isLog, LogItem } from '../../item';
import { createHandlerOld } from '../base';
import { createAccountId, createWorkerId } from '../helpers/ids';

import * as RewardsDistribution from '~/abi/DistributedRewardsDistribution';
import { network } from '~/config/network';
import { Claim, ClaimType, Worker } from '~/model';
import { toHumanSQD } from '~/utils/misc';

export const handleClaimed = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.RewardsDistribution) &&
      isLog(item) &&
      RewardsDistribution.events.Claimed.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const {
      worker: workerIndex,
      by: stakerAccount,
      amount,
    } = RewardsDistribution.events.Claimed.decode(log);

    const accountId = createAccountId(stakerAccount);
    const workerId = createWorkerId(workerIndex);
    const workerDeferred = ctx.store.defer(Worker, {
      id: workerId,
      relations: { owner: true, realOwner: true },
    });

    return async () => {
      const worker = await workerDeferred.getOrFail();
      assert(worker.owner.id === accountId); // should never happen, but just in case

      worker.claimableReward = 0n;
      worker.claimedReward += amount;

      await ctx.store.upsert(worker);

      const account = worker.realOwner;
      const claim = new Claim({
        id: log.id,
        blockNumber: log.block.height,
        timestamp: new Date(log.block.timestamp),
        type: ClaimType.WORKER,
        account,
        worker,
        amount,
      });

      ctx.log.info(
        `account(${account.id}) claimed ${toHumanSQD(claim.amount)} from worker(${worker.id})`,
      );

      await ctx.store.insert(claim);
    };
  },
});
