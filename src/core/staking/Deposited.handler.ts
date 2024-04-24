import assert from 'assert';

import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createDelegation } from '../helpers/entities';
import { createAccountId, createDelegationId, createWorkerId } from '../helpers/ids';

import { listenDelegationUnlock } from './CheckDelegationUnlock.listener';

import * as Staking from '~/abi/Staking';
import { network } from '~/config/network';
import { Worker, Account, Delegation, Settings } from '~/model';
import { toNextEpochStart } from '~/utils/misc';

export const handleDeposited = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.Staking) &&
      isLog(item) &&
      Staking.events.Deposited.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const {
      worker: workerIndex,
      staker: stakerAccount,
      amount,
    } = Staking.events.Deposited.decode(log);

    const workerId = createWorkerId(workerIndex);
    const workerDeferred = ctx.store.defer(Worker, workerId);

    const accountId = createAccountId(stakerAccount);
    const accountDeferred = ctx.store.defer(Account, {
      id: accountId,
      relations: { owner: true },
    });

    const delegationId = createDelegationId(workerId, accountId);
    const delegationDeferred = ctx.store.defer(Delegation, {
      id: delegationId,
      relations: { worker: true, realOwner: true },
    });

    ctx.queue.add(async () => {
      const settings = await ctx.store.getOrFail(Settings, network.name);

      const delegation = await delegationDeferred.getOrInsert(async (id) => {
        const worker = await workerDeferred.getOrFail();
        const owner = await accountDeferred.getOrFail();

        ctx.log.info(`created delegation(${id})`);

        return createDelegation(id, {
          owner,
          realOwner: owner.owner || undefined,
          worker,
        });
      });

      delegation.deposit += amount;
      if (settings.epochLength) {
        delegation.locked = true;
        delegation.lockStart = toNextEpochStart(log.block.l1BlockNumber, settings.epochLength);
        delegation.lockEnd = delegation.lockStart + settings.epochLength;

        listenDelegationUnlock(ctx, delegation.id);
      }
      await ctx.store.upsert(delegation);

      const worker = delegation.worker;
      assert(worker.id === workerId);
      if (delegation.deposit === amount) {
        worker.delegationCount += 1;
      }
      worker.totalDelegation += amount;
      await ctx.store.upsert(worker);

      ctx.log.info(
        `account(${delegation.realOwner.id}) delegated ${amount}$SQD to worker(${worker.id})`,
      );
    });
  },
});
