import { assertNotNull } from '@subsquid/evm-processor';

import { isContract, isLog, LogItem } from '../../item';
import { createHandlerOld } from '../base';
import { createWorker } from '../helpers/entities';
import { createAccountId, createWorkerId, createWorkerStatusId } from '../helpers/ids';

import { listenStatusCheck } from './CheckStatus.listener';

import * as WorkerRegistry from '~/abi/WorkerRegistration';
import { network } from '~/config/network';
import { Account, Settings, WorkerStatus, WorkerStatusChange, Worker } from '~/model';
import { parseWorkerMetadata, parsePeerId, toHumanSQD } from '~/utils/misc';

export const handleWorkerRegistered = createHandlerOld({
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

    const settingsDeferred = ctx.store.defer(Settings, network.name);

    return async () => {
      const settings = await settingsDeferred.getOrFail();

      const bond = assertNotNull(settings.bondAmount, `bond amount is not defined`);
      const metadata = parseWorkerMetadata(ctx, event.metadata);

      const owner = await ownerDeferred.getOrFail();

      const worker = createWorker(workerId, {
        owner,
        realOwner: owner.owner ? owner.owner : owner,
        peerId: parsePeerId(event.peerId),
        createdAt: new Date(log.block.timestamp),
        metadata,
      });

      ctx.log.info(`registered worker(${worker.id})`);

      worker.bond = bond;
      worker.locked = true;
      worker.lockStart = log.block.l1BlockNumber;

      await ctx.store.upsert(worker);

      const statusChange = new WorkerStatusChange({
        id: createWorkerStatusId(workerId, log.block.l1BlockNumber),
        worker,
        blockNumber: log.block.l1BlockNumber,
        timestamp: new Date(log.block.timestamp),
        status: WorkerStatus.REGISTERING,
        pending: false,
      });
      await ctx.store.insert(statusChange);

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
        `account(${worker.realOwner.id}) bonded ${toHumanSQD(worker.bond)} to worker(${worker.id})`,
      );
    };
  },
});
