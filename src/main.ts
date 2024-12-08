import { TypeormDatabaseWithCache } from '@belopash/typeorm-store';
import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { last } from 'lodash';
import { IsNull, LessThanOrEqual, Not } from 'typeorm';

import { ensureGatewayStakeApplyQueue } from './core/gateway/StakeApply.queue';
import { sortItems } from './item';
import { Events, MappingContext } from './types';

import * as Router from '~/abi/Router';
import { network } from '~/config/network';
import { processor, BlockData, BlockHeader } from '~/config/processor';
import { handlers } from '~/core';
import { listenUpdateWorkersCap } from '~/core/cap';
import {
  ensureGatewayStakeUnlockQueue,
  listenGatewayStakeUnlock,
} from '~/core/gateway/StakeUnlock.queue';
import { createSettings, createBlock } from '~/core/helpers/entities';
import { createEpochId } from '~/core/helpers/ids';
import {
  listenOnlineUpdate,
  listenMetricsUpdate,
  listenRewardsDistributed,
  listenRewardMetricsUpdate,
} from '~/core/metrics';
import {
  ensureDelegationUnlockQueue,
  listenDelegationUnlock,
} from '~/core/staking/CheckDelegationUnlock.listener';
import { listenStatusCheck } from '~/core/worker/WorkerStatusApply.listener';
import { listenUnlockCheck } from '~/core/worker/WorkerUnlock.listener';
import {
  Block,
  Delegation,
  Epoch,
  EpochStatus,
  GatewayStake,
  Settings,
  Worker,
  WorkerStatus,
  WorkerStatusChange,
} from '~/model';
import { EventEmitter } from '~/utils/events';
import { toNextEpochStart } from '~/utils/misc';
import { Task, TaskQueue } from '~/utils/queue';
import { HOUR_MS, MINUTE_MS, toStartOfInterval } from '~/utils/time';

processor.run(new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (ctx_) => {
  const ctx = Object.assign(ctx_, {
    events: new EventEmitter(),
    delegatedWorkers: new Set<string>(),
  });

  const tasks: Task[] = [];

  // tasks.push(() => ctx.events.emit(Events.Initialization, ctx.blocks[0].header));

  tasks.push(init(ctx));

  listenRewardsDistributed(ctx);

  listenOnlineUpdate(ctx);
  listenMetricsUpdate(ctx);
  listenRewardMetricsUpdate(ctx);
  listenUpdateWorkersCap(ctx);

  for (const block of ctx.blocks) {
    const items = sortItems(block);

    tasks.push(async () => {
      await ctx.store.insert(createBlock(block.header));

      await ctx.events.emit(Events.BlockStart, block.header);
    });

    tasks.push(endEpoch(ctx, block.header));

    for (const item of items) {
      for (const handler of handlers) {
        const task = handler(ctx, item);
        if (task) tasks.push(task);
      }
    }

    tasks.push(() => ctx.events.emit(Events.BlockEnd, block.header));
  }

  tasks.push(complete(ctx));

  // tasks.push(() => ctx.events.emit(Events.Finalization, last(ctx.blocks)!.header));

  for (const task of tasks) {
    await task();
  }
});

function init(ctx: MappingContext) {
  const settingsDefer = ctx.store.defer(Settings, network.name);

  return async () => {
    const firstBlock = ctx.blocks[0].header;
    const lastBlock = last(ctx.blocks)!.header;

    // ensure settings
    await settingsDefer.getOrInsert((id) => {
      const settings = createSettings(id);
      settings.delegationLimitCoefficient = 0.2;
      settings.bondAmount = 10n ** 23n;
      settings.baseApr = 0;
      settings.utilizedStake = 0n;
      return settings;
    });

    await ensureGatewayStakeApplyQueue(ctx);
    await ensureDelegationUnlockQueue(ctx);
    await ensureGatewayStakeApplyQueue(ctx);
    await ensureGatewayStakeUnlockQueue(ctx);

    // schedule pending worker statuses
    const pendingStatuses = await ctx.store.find(WorkerStatusChange, {
      where: {
        blockNumber: LessThanOrEqual(lastBlock.l1BlockNumber),
        pending: true,
      },
      relations: { worker: true },
      order: { blockNumber: 'ASC' },
      cache: false,
    });
    pendingStatuses.forEach((s) => listenStatusCheck(ctx, s.id));

    const pendingUnlocks = await ctx.store.find(Worker, {
      where: {
        lockEnd: LessThanOrEqual(lastBlock.l1BlockNumber),
        locked: true,
      },
      cache: false,
    });
    pendingUnlocks.forEach((w) => listenUnlockCheck(ctx, w.id));

    const lockedGatewayStakes = await ctx.store.find(GatewayStake, {
      where: {
        lockEnd: LessThanOrEqual(lastBlock.l1BlockNumber),
        locked: true,
      },
      cache: false,
    });
    lockedGatewayStakes.forEach((o) => listenGatewayStakeUnlock(ctx, o.id));

    const lockedDelegations = await ctx.store.find(Delegation, {
      where: {
        locked: true,
        lockEnd: LessThanOrEqual(lastBlock.l1BlockNumber),
      },
      order: { lockStart: 'ASC' },
      cache: false,
    });
    lockedDelegations.forEach((s) => listenDelegationUnlock(ctx, s.id));
  };
}

let blocksPassed = Infinity;
function complete(ctx: MappingContext) {
  return async () => {
    const lastBlock = last(ctx.blocks)!.header;

    if (blocksPassed > 1000) {
      const limit = 50_000;
      const offset = 0;
      while (true) {
        const batch = await ctx.store.find(Block, {
          where: { l1BlockNumber: LessThanOrEqual(lastBlock.l1BlockNumber - 50_000) },
          order: { l1BlockNumber: 'ASC' },
          skip: offset,
          take: limit,
          cache: false,
        });

        await ctx.store.remove(batch);
        if (batch.length < limit) break;
      }

      blocksPassed = 0;
    }
    blocksPassed += ctx.blocks.length;
  };
}

function endEpoch(ctx: MappingContext, block: BlockHeader) {
  const settingsDefer = ctx.store.defer(Settings, network.name);

  let currentEpochId: string | undefined;

  return async () => {
    const settings = await settingsDefer.get();
    const epochLength = settings?.epochLength;
    if (!epochLength) return;

    let currentEpoch: Epoch | undefined;
    if (!currentEpochId) {
      currentEpoch = await ctx.store.findOne(Epoch, { where: {}, order: { start: 'DESC' } });
    } else {
      currentEpoch = await ctx.store.getOrFail(Epoch, currentEpochId);
    }

    const nextEpochStart = currentEpoch
      ? currentEpoch.end + 1
      : toNextEpochStart(block.l1BlockNumber, epochLength);

    if (currentEpoch) {
      if (nextEpochStart > block.l1BlockNumber || currentEpoch.status !== EpochStatus.STARTED) {
        // nothing need to be done
      } else {
        currentEpoch.status = EpochStatus.ENDED;
        currentEpoch.endedAt = new Date(block.timestamp);
        await ctx.store.upsert(currentEpoch);

        ctx.log.info(`epoch ${currentEpoch.number} ended`);
        await ctx.events.emit(Events.EpochEnd, block, currentEpoch.id);

        const newEpochNumber = currentEpoch.number + 1;
        currentEpoch = new Epoch({
          id: createEpochId(newEpochNumber),
          number: newEpochNumber,
          start: nextEpochStart,
          end: nextEpochStart + epochLength - 1,
          status: EpochStatus.PLANNED,
        });
        await ctx.store.insert(currentEpoch);
      }
    } else {
      ctx.log.info(`no epoch was found`);
      currentEpoch = new Epoch({
        id: createEpochId(1),
        number: 1,
        start: nextEpochStart,
        end: nextEpochStart + epochLength - 1,
        status: EpochStatus.PLANNED,
      });
      await ctx.store.insert(currentEpoch);
    }

    currentEpochId = currentEpoch.id;
  };
}

function startEpoch(ctx: MappingContext, block: BlockHeader) {
  const settingsDefer = ctx.store.defer(Settings, network.name);
  let currentEpochId: string | undefined;

  return async () => {
    const settings = await ctx.store.get(Settings, network.name);
    const epochLength = settings?.epochLength;
    if (!epochLength) return;

    let currentEpoch: Epoch | undefined;
    if (!currentEpochId) {
      currentEpoch = await ctx.store.findOne(Epoch, { where: {}, order: { start: 'DESC' } });
    } else {
      currentEpoch = await ctx.store.getOrFail(Epoch, currentEpochId);
    }

    const nextEpochStart = currentEpoch
      ? currentEpoch.end + 1
      : toNextEpochStart(block.l1BlockNumber, epochLength);

    if (currentEpoch) {
      if (nextEpochStart > block.l1BlockNumber || currentEpoch.status !== EpochStatus.STARTED) {
        // nothing need to be done
      } else {
        currentEpoch.status = EpochStatus.ENDED;
        currentEpoch.endedAt = new Date(block.timestamp);
        await ctx.store.upsert(currentEpoch);

        ctx.log.info(`epoch ${currentEpoch.number} ended`);
        await ctx.events.emit(Events.EpochEnd, block, currentEpoch.id);

        const newEpochNumber = currentEpoch.number + 1;
        currentEpoch = new Epoch({
          id: createEpochId(newEpochNumber),
          number: newEpochNumber,
          start: nextEpochStart,
          end: nextEpochStart + epochLength - 1,
          status: EpochStatus.PLANNED,
        });
        await ctx.store.insert(currentEpoch);
      }
    } else {
      ctx.log.info(`no epoch was found`);
      currentEpoch = new Epoch({
        id: createEpochId(1),
        number: 1,
        start: nextEpochStart,
        end: nextEpochStart + epochLength - 1,
        status: EpochStatus.PLANNED,
      });
      await ctx.store.insert(currentEpoch);
    }

    currentEpochId = currentEpoch.id;
  };

  ctx.events.on(Events.BlockStart, async (block) => {
    if (!currentEpochId) return;

    const currentEpoch = await ctx.store.getOrFail(Epoch, currentEpochId);
    if (currentEpoch.status === EpochStatus.PLANNED) {
      if (currentEpoch.start <= block.l1BlockNumber) {
        const activeWorkers = await ctx.store.find(Worker, {
          where: { status: WorkerStatus.ACTIVE },
        });

        currentEpoch.status = EpochStatus.STARTED;
        currentEpoch.startedAt = new Date(block.timestamp);
        currentEpoch.activeWorkerIds = activeWorkers.map((w) => w.id);
        await ctx.store.upsert(currentEpoch);

        ctx.log.info(`epoch ${currentEpoch.number} started`);

        const statistics = await ctx.store.getOrFail(Statistics, network.name);

        statistics.currentEpoch = currentEpoch.number;
        await ctx.store.upsert(statistics);
      }
    }
  });
}
