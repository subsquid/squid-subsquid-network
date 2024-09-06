import assert from 'assert';

import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createAccountId, createDelegationId, createWorkerId } from '../helpers/ids';

import * as Staking from '~/abi/Staking';
import { network } from '~/config/network';
import { Delegation } from '~/model';
import { toHumanSQD } from '~/utils/misc';

export const handleWithdrawn = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.Staking) &&
      isLog(item) &&
      Staking.events.Withdrawn.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const {
      worker: workerIndex,
      staker: stakerAccount,
      amount,
    } = Staking.events.Withdrawn.decode(log);

    const workerId = createWorkerId(workerIndex);
    const accountId = createAccountId(stakerAccount);
    const delegationId = createDelegationId(workerId, accountId);
    const delegationDeferred = ctx.store.defer(Delegation, {
      id: delegationId,
      relations: { worker: true, realOwner: true },
    });

    ctx.tasks.add(async () => {
      const delegation = await delegationDeferred.getOrFail();
      delegation.deposit -= amount;

      await ctx.store.upsert(delegation);

      const worker = delegation.worker;
      assert(worker.id === workerId);
      if (delegation.deposit === 0n) {
        worker.delegationCount -= 1;
      }
      worker.totalDelegation -= amount;

      await ctx.store.upsert(worker);

      ctx.log.info(
        `account(${delegation.realOwner.id}) undelegated ${toHumanSQD(amount)} from worker(${worker.id})`,
      );

      ctx.delegatedWorkers.add(worker.id);
    });
  },
});
