import { assertNotNull } from '@subsquid/evm-processor';

import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createAccountId, createWorkerId, createWorkerStatusId } from '../helpers/ids';

import { listenStatusCheck } from './CheckStatus.listener';

import * as WorkerRegistry from '~/abi/WorkerRegistration';
import { network } from '~/config/network';
import { Account, Settings, WorkerStatus, WorkerStatusChange, Worker } from '~/model';
import { parseWorkerMetadata, parsePeerId } from '~/utils/misc';

export const handleWorkerRegistered = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.WorkerRegistry) &&
      isLog(item) &&
      WorkerRegistry.events.WorkerRegistered.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = WorkerRegistry.events.WorkerRegistered.decode(log);

    const ownerId = createAccountId(event.registrar);
    const ownerDeferred = ctx.store.defer(Account, {
      id: ownerId,
      relations: {
        owner: true,
      },
    });

    const workerId = createWorkerId(event.workerId);
    const workerDeferred = ctx.store.defer(Worker, {
      id: workerId,
      relations: { realOwner: true },
    });

    const settingsDeferred = ctx.store.defer(Settings, network.name);

    ctx.queue.add(async () => {
      const settings = await settingsDeferred.getOrFail();

      const bond = assertNotNull(settings.bondAmount, `bond amount is not defined`);
      const metadata = parseWorkerMetadata(ctx, event.metadata);

      const owner = await ownerDeferred.getOrFail();

      const worker = await workerDeferred.getOrInsert((id) => {
        ctx.log.info(`created worker(${id})`);

        return new Worker({
          id,
          bond,
          owner,
          realOwner: owner.owner ? owner.owner : owner,
          peerId: parsePeerId(event.peerId),
          createdAt: new Date(log.block.timestamp),
          claimableReward: 0n,
          claimedReward: 0n,
          totalDelegation: 0n,
          status: WorkerStatus.UNKNOW,
          delegationCount: 0,
          ...metadata,
        });
      });

      const statusChange = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, log.block.height),
        worker,
        blockNumber: log.block.l1BlockNumber,
        timestamp: new Date(log.block.timestamp),
        status: WorkerStatus.REGISTERING,
        pending: false,
      });
      await ctx.store.insert(statusChange);

      worker.bond = bond;
      worker.status = statusChange.status;
      await ctx.store.upsert(worker);

      const pendingStatus = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, event.registeredAt),
        worker,
        blockNumber: Number(event.registeredAt),
        status: WorkerStatus.ACTIVE,
        pending: true,
      });
      await ctx.store.insert(pendingStatus);

      listenStatusCheck(ctx, pendingStatus.id);

      ctx.log.info(`account(${worker.realOwner.id}) registered worker(${worker.id})`);
      ctx.log.info(
        `account(${worker.realOwner.id}) bonded ${worker.bond}$SQD to worker(${worker.id})`,
      );
    });
  },
});
