import { TypeormDatabaseWithCache } from '@belopash/typeorm-store'
import { LessThanOrEqual } from 'typeorm'

import { ensureWorkerCapQueue, updateWorkersCap } from './core/cap'
import {
  ensureGatewayStakeApplyQueue,
  processGatewayStakeApplyQueue,
} from './core/gateway/StakeApply.queue'
import { updateWorkerRewardStats, updateWorkersMetrics, updateWorkersOnline } from './core/metrics'
import { ensureWorkerUnlock, processWorkerUnlockQueue } from './core/worker/WorkerUnlock.queue'
import { sortItems } from './item'
import { MappingContext } from './types'

import { network } from '~/config/network'
import { processor, BlockHeader } from '~/config/processor'
import { handlers } from '~/core'
import {
  ensureGatewayStakeUnlockQueue,
  processGatewayStakeUnlockQueue,
} from '~/core/gateway/StakeUnlock.queue'
import { createSettings, createBlock } from '~/core/helpers/entities'
import { createEpochId } from '~/core/helpers/ids'
import {
  ensureDelegationUnlockQueue,
  processDelegationUnlockQueue,
} from '~/core/staking/CheckDelegationUnlock.listener'
import {
  ensureWorkerStatusApplyQueue,
  processWorkerStatusApplyQueue,
} from '~/core/worker/WorkerStatusApply.queue'
import { Block, Contracts, Epoch, EpochStatus, Settings } from '~/model'
import { last, toNextEpochStart } from '~/utils/misc'
import { Task } from '~/utils/queue'

processor.run(new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (ctx) => {
  const tasks: Task[] = []

  tasks.push(() => init(ctx, ctx.blocks[0].header))

  // listenRewardsDistributed(ctx)

  // listenOnlineUpdate(ctx)
  // listenMetricsUpdate(ctx)
  // listenRewardMetricsUpdate(ctx)
  // listenUpdateWorkersCap(ctx)

  for (const block of ctx.blocks) {
    const items = sortItems(block)

    tasks.push(async () => {
      await ctx.store.insert(createBlock(block.header))

      await checkForNewEpoch(ctx, block.header)

      await processWorkerUnlockQueue(ctx, block.header)
      await processWorkerStatusApplyQueue(ctx, block.header)
      await processDelegationUnlockQueue(ctx, block.header)
      await processGatewayStakeApplyQueue(ctx, block.header)
      await processGatewayStakeUnlockQueue(ctx, block.header)
    })

    for (const item of items) {
      for (const handler of handlers) {
        const task = handler(ctx, item)
        if (task) tasks.push(task)
      }
    }
  }

  tasks.push(() => complete(ctx, last(ctx.blocks)!.header))

  for (const task of tasks) {
    await task()
  }
})

async function init(ctx: MappingContext, block: BlockHeader) {
  // ensure settings
  await ctx.store.getOrInsert(Settings, network.name, (id) => {
    const settings = createSettings(id)
    settings.delegationLimitCoefficient = 0.2
    settings.bondAmount = 10n ** 23n
    settings.baseApr = 0
    settings.utilizedStake = 0n

    settings.contracts = new Contracts({
      gatewayRegistry: network.contracts.GatewayRegistry.address,
      distributedRewardsDistribution: network.contracts.RewardsDistribution.address,
      router: network.contracts.Router.address,
      temporaryHoldingFactory: network.contracts.TemporaryHoldingFactory.address,
      vestingFactory: network.contracts.VestingFactory.address,
      softCap: network.contracts.SoftCap.address,
      networkController: network.defaultRouterContracts.networkController,
      rewardCalculation: network.defaultRouterContracts.rewardCalculation,
      rewardTreasury: network.defaultRouterContracts.rewardTreasury,
      staking: network.defaultRouterContracts.staking,
      workerRegistration: network.defaultRouterContracts.workerRegistration,
    })

    return settings
  })

  await ensureWorkerUnlock(ctx)
  await ensureWorkerStatusApplyQueue(ctx)
  await ensureDelegationUnlockQueue(ctx)
  await ensureGatewayStakeApplyQueue(ctx)
  await ensureGatewayStakeUnlockQueue(ctx)
  await ensureWorkerCapQueue(ctx, block)

  if (ctx.isHead) {
    await updateWorkersOnline(ctx, block)
    await updateWorkersMetrics(ctx, block)
    await updateWorkerRewardStats(ctx, block)
  }
}

let blocksPassed = Infinity
async function complete(ctx: MappingContext, block: BlockHeader) {
  await updateWorkersCap(ctx, block)

  if (blocksPassed > 1000) {
    const limit = 50_000
    const offset = 0
    while (true) {
      const batch = await ctx.store.find(Block, {
        where: { l1BlockNumber: LessThanOrEqual(block.l1BlockNumber - 50_000) },
        order: { l1BlockNumber: 'ASC' },
        skip: offset,
        take: limit,
        cache: false,
      })

      await ctx.store.remove(batch)
      if (batch.length < limit) break
    }

    blocksPassed = 0
  }
  blocksPassed += ctx.blocks.length
}

async function checkForNewEpoch(ctx: MappingContext, block: BlockHeader) {
  const settings = await ctx.store.getOrFail(Settings, network.name)
  const epochLength = settings?.epochLength
  if (epochLength == null) return

  let currentEpoch: Epoch | undefined
  if (settings.currentEpoch != null) {
    currentEpoch = await ctx.store.getOrFail(Epoch, createEpochId(settings.currentEpoch))
  }

  const nextEpochStart =
    currentEpoch == null ? toNextEpochStart(block.l1BlockNumber, epochLength) : currentEpoch.end + 1
  if (block.l1BlockNumber < nextEpochStart) return

  if (currentEpoch) {
    currentEpoch.status = EpochStatus.ENDED
    currentEpoch.endedAt = new Date(block.timestamp)
    await ctx.store.upsert(currentEpoch)

    ctx.log.info(`epoch ${currentEpoch.number} ended`)
  }

  const newEpochNumber = settings.currentEpoch == null ? 0 : settings.currentEpoch + 1
  currentEpoch = new Epoch({
    id: createEpochId(newEpochNumber),
    number: newEpochNumber,
    start: nextEpochStart,
    end: nextEpochStart + epochLength - 1,
    status: EpochStatus.STARTED,
  })
  await ctx.store.insert(currentEpoch)

  settings.currentEpoch = currentEpoch.number
  await ctx.store.upsert(settings)
}
