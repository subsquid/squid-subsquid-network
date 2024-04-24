import { TypeormDatabaseWithCache } from '@belopash/typeorm-store';
import { last } from 'lodash';
import { LessThanOrEqual } from 'typeorm';

import { handlers } from './core';
import { listenStakeApply } from './core/gateway/CheckStakeApply.listener';
import { listenStakeUnlock } from './core/gateway/CheckStakeStatus.listener';
import { createSettings, createBlock } from './core/helpers/entities';
import { createEpochId } from './core/helpers/ids';
import { listenOnlineUpdate, listenMetricsUpdate, listenRewardsDistributed } from './core/metrics';
import { listenDelegationUnlock } from './core/staking/CheckDelegationUnlock.listener';
import { listenStatusCheck } from './core/worker/CheckStatus.listener';
import { sortItems } from './item';
import { Events, MappingContext } from './types';
import { EventEmitter } from './utils/events';
import { toNextEpochStart } from './utils/misc';
import { TaskQueue } from './utils/queue';

import { network } from '~/config/network';
import { processor, BlockData } from '~/config/processor';
import {
  Block,
  Delegation,
  Epoch,
  EpochStatus,
  GatewayOperator,
  Settings,
  Statistics,
  Worker,
  WorkerStatus,
  WorkerStatusChange,
} from '~/model';
import { HOUR_MS, MINUTE_MS, toStartOfInterval } from '~/utils/time';

processor.run(new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (ctx) => {
  await mapBlocks({
    ...ctx,
    queue: new TaskQueue(),
    events: new EventEmitter(),
  });
});

async function mapBlocks(ctx: MappingContext) {
  // ctx.events.on(Events.BlockStart, async (block) => {
  //   if (block.height === 7305465) {
  //     const settings = createSettings(network.name);
  //     settings.delegationLimitCoefficient = 0.2;
  //     settings.epochLength = 100;
  //     await ctx.store.upsert(settings);
  //   }
  // });

  scheduleInit(ctx);
  scheduleComplete(ctx);

  scheduleEpochs(ctx);

  if (ctx.isHead) {
    listenOnlineUpdate(ctx);
    listenMetricsUpdate(ctx);
    listenRewardsDistributed(ctx);
  }

  ctx.queue.add(() => ctx.events.emit(Events.Initialization));

  for (const block of ctx.blocks) {
    mapBlock(ctx, block);
  }

  ctx.queue.add(() => ctx.events.emit(Events.Finalization));

  await ctx.queue.run();
}

function mapBlock(ctx: MappingContext, block: BlockData) {
  const items = sortItems(block);

  ctx.queue.add(async () => {
    await ctx.store.insert(createBlock(block.header));

    await ctx.events.emit(Events.BlockStart, block.header);
  });

  for (const item of items) {
    for (const handler of handlers) {
      handler(ctx, item);
    }
  }

  ctx.queue.add(() => ctx.events.emit(Events.BlockEnd, block.header));
}

function scheduleInit(ctx: MappingContext) {
  const settingsDefer = ctx.store.defer(Settings, network.name);
  const statisticsDefer = ctx.store.defer(Statistics, network.name);

  ctx.events.on(Events.Initialization, async () => {
    const firstBlock = ctx.blocks[0].header;
    const lastBlock = last(ctx.blocks)!.header;

    // ensure settings
    await settingsDefer.getOrInsert((id) => {
      const settings = createSettings(id);
      settings.delegationLimitCoefficient = 0.2;
      settings.bondAmount = 10n ** 23n;
      return settings;
    });

    await statisticsDefer.getOrInsert((id) => {
      return new Statistics({
        id,
        blockTime: 0,
        lastBlock: firstBlock.height,
        lastBlockTimestamp: new Date(firstBlock.timestamp),
        blockTimeL1: 0,
        lastBlockL1: firstBlock.l1BlockNumber,
        lastBlockTimestampL1: new Date(firstBlock.timestamp),
        currentEpoch: null,
        lastSnapshotTimestamp: new Date(
          toStartOfInterval(firstBlock.timestamp, 12 * HOUR_MS) - MINUTE_MS,
        ),
      });
    });

    // schedule pending worker statuses
    const pendingStatuses = await ctx.store.find(WorkerStatusChange, {
      where: { pending: true, blockNumber: LessThanOrEqual(lastBlock.l1BlockNumber) },
      relations: { worker: true },
      order: { blockNumber: 'ASC' },
    });
    pendingStatuses.forEach((s) => listenStatusCheck(ctx, s.id));

    const operatorsWithPendingOrLockedStakes = await ctx.store.find(GatewayOperator, {
      where: [
        {
          pendingStake: {
            lockStart: LessThanOrEqual(lastBlock.l1BlockNumber),
          },
        },
        {
          stake: {
            locked: true,
            lockEnd: LessThanOrEqual(lastBlock.l1BlockNumber),
          },
        },
      ],
      relations: {
        stake: true,
        pendingStake: true,
      },
    });
    operatorsWithPendingOrLockedStakes.forEach((o) => {
      if (o.pendingStake) {
        listenStakeApply(ctx, o.pendingStake!.id);
      }
      if (o.stake?.locked) {
        listenStakeUnlock(ctx, o.stake!.id);
      }
    });

    const lockedDelegations = await ctx.store.find(Delegation, {
      where: {
        locked: true,
        lockEnd: LessThanOrEqual(lastBlock.l1BlockNumber),
      },
      order: { lockStart: 'ASC' },
    });
    lockedDelegations.forEach((s) => listenDelegationUnlock(ctx, s.id));
  });
}

function scheduleComplete(ctx: MappingContext) {
  let blocksPassed = 0;

  ctx.events.on(Events.Finalization, async () => {
    const firstBlock = ctx.blocks[0].header;
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
        });

        await ctx.store.remove(batch);
        if (batch.length < limit) break;
      }

      blocksPassed = 0;
    }
    blocksPassed += ctx.blocks.length;

    const statistics = await ctx.store.getOrFail(Statistics, network.name);

    let lastBlockIndex = 0;
    const diffs: number[] = [];

    let lastBlockIndexL1 = 0;
    const diffsL1: number[] = [];

    for (let i = 1; i < ctx.blocks.length; i++) {
      const cur = ctx.blocks[i].header;
      const prev = ctx.blocks[lastBlockIndex].header;
      const prevL1 = ctx.blocks[lastBlockIndexL1].header;

      lastBlockIndex = i;
      diffs.push(cur.timestamp - prev.timestamp);

      if (cur.l1BlockNumber > prevL1.l1BlockNumber) {
        lastBlockIndexL1 = i;
        diffsL1.push((cur.timestamp - prevL1.timestamp) / (cur.l1BlockNumber - prev.l1BlockNumber));
      }
    }

    const lb = ctx.blocks[lastBlockIndex].header;
    statistics.lastBlock = lb.height;
    statistics.lastBlockTimestamp = new Date(lb.timestamp);
    // statistics.blockTime = diffs.sort((a, b) => a - b)[Math.floor(diffs.length / 2)];

    const lbL1 = ctx.blocks[lastBlockIndexL1].header;
    statistics.lastBlockL1 = lbL1.l1BlockNumber;
    statistics.lastBlockTimestampL1 = new Date(lb.timestamp);
    // statistics.blockTimeL1 = diffsL1.sort((a, b) => a - b)[Math.floor(diffsL1.length / 2)];

    await ctx.store.upsert(statistics);
  });
}

function scheduleEpochs(ctx: MappingContext) {
  let currentEpochId: string | undefined;

  ctx.events.on(Events.BlockStart, async (block) => {
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
  });

  ctx.events.on(Events.EpochStart, async (block, epochId) => {
    const statistics = await ctx.store.getOrFail(Statistics, network.name);
    const epoch = await ctx.store.getOrFail(Epoch, epochId);

    statistics.currentEpoch = epoch.number;
    await ctx.store.upsert(statistics);
  });

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
        await ctx.events.emit(Events.EpochStart, block, currentEpoch.id);
      }
    }
  });
}
