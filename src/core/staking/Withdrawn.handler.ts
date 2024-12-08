import assert from 'assert';

import { isContract, isLog, LogItem } from '../../item';
import { createHandler, createHandlerOld } from '../base';
import { createAccountId, createDelegationId, createWorkerId } from '../helpers/ids';

import * as Staking from '~/abi/Staking';
import { network } from '~/config/network';
import { Delegation } from '~/model';
import { toHumanSQD } from '~/utils/misc';

export const handleWithdrawn = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Staking)) return;
  if (!isLog(item)) return;
  if (!Staking.events.Withdrawn.is(item.value)) return;

  const log = item.value;
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

  return async () => {
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
  };
});
