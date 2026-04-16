import 'dotenv/config'

import { type StoreWithCache, TypeormDatabaseWithCache } from '@belopash/typeorm-store'
import { run } from '@subsquid/batch-processor'
import { augmentBlock } from '@subsquid/evm-objects'
import { createLogger } from '@subsquid/logger'
import { LessThanOrEqual } from 'typeorm'

import {
  NETWORK_CONTROLLER_TEMPLATE_KEY,
  type ProcessorContext,
  STAKING_TEMPLATE_KEY,
  type Task,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  createEpochId,
  last,
  network,
  sortItems,
  stopwatch,
  toEpochStart,
} from '@sqd/shared'
import type { BlockData, BlockHeader } from './types'

import { Block, Contracts, Epoch, EpochStatus, Settings } from '~/model'
import { processor } from './config/processor'
import {
  ensureDelegationUnlockQueue,
  ensureWorkerCapQueue,
  ensureWorkerStatusApplyQueue,
  ensureWorkerUnlock,
  handlers,
  processDelegationUnlockQueue,
  processWorkerStatusApplyQueue,
  processWorkerUnlockQueue,
  updateWorkerRewardStats,
  updateWorkersCap,
  updateWorkersMetrics,
  updateWorkersOnline,
} from './handlers'
import { createBlock, createSettings } from './helpers'

const logger = createLogger('sqd:workers')

let isMaterializedRefreshRunning = false

run(processor, new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
  if (!isMaterializedRefreshRunning) {
    isMaterializedRefreshRunning = true
    const { startMaterializedViewRefresh } = await import('./materialized-view-refresh')
    startMaterializedViewRefresh((_ctx.store as any).em.connection.manager)
  }

  const batchSw = stopwatch()

  const ctx: ProcessorContext<StoreWithCache> = {
    ..._ctx,
    blocks: _ctx.blocks.map(augmentBlock) as BlockData[],
    log: logger,
  }

  const firstBlock = ctx.blocks[0].header
  const lastBlock = last(ctx.blocks)!.header

  const tasks: Task[] = []

  ctx.store.defer(Settings, network.name)
  tasks.push(() => init(ctx, ctx.blocks[0].header))

  let handlerTaskCount = 0
  for (const block of ctx.blocks) {
    const items = sortItems(block)

    tasks.push(async () => {
      await ctx.store.track(createBlock(block.header))

      await checkForNewEpoch(ctx, block.header)

      await processWorkerUnlockQueue(ctx, block.header)
      await processWorkerStatusApplyQueue(ctx, block.header)
      await processDelegationUnlockQueue(ctx, block.header)
    })

    for (const item of items) {
      for (const handler of handlers) {
        const task = handler(ctx, item)
        if (task) {
          tasks.push(task)
          handlerTaskCount++
        }
      }
    }
  }

  tasks.push(() => complete(ctx, lastBlock))

  const prepTime = batchSw.get()

  for (const task of tasks) {
    await task()
  }

  const execTime = batchSw.get()

  ctx.log.debug(
    `batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`,
  )
})

type MappingContext = ProcessorContext<StoreWithCache>

async function init(ctx: MappingContext, block: BlockHeader) {
  await ctx.store.getOrCreate(Settings, network.name, (id) => {
    const settings = createSettings(id)

    settings.contracts = new Contracts({
      gatewayRegistry: network.contracts.GatewayRegistry.address,
      distributedRewardsDistribution: network.contracts.RewardsDistribution.address,
      router: network.contracts.Router.address,
      temporaryHoldingFactory: network.contracts.TemporaryHoldingFactory.address,
      vestingFactory: network.contracts.VestingFactory.address,
      softCap: network.contracts.SoftCap.address,
      portalPoolFactory: network.contracts.PortalPoolFactory.address,
      networkController: network.defaultRouterContracts.networkController,
      rewardCalculation: network.defaultRouterContracts.rewardCalculation,
      rewardTreasury: network.defaultRouterContracts.rewardTreasury,
      staking: network.defaultRouterContracts.staking,
      workerRegistration: network.defaultRouterContracts.workerRegistration,
    })

    return settings
  })

  const defaults = [
    [WORKER_REGISTRATION_TEMPLATE_KEY, network.defaultRouterContracts.workerRegistration],
    [NETWORK_CONTROLLER_TEMPLATE_KEY, network.defaultRouterContracts.networkController],
    [STAKING_TEMPLATE_KEY, network.defaultRouterContracts.staking],
  ] as const
  for (const [key, address] of defaults) {
    if (!ctx.templates.has(key, address, network.range.from)) {
      ctx.templates.add(key, address, network.range.from)
    }
  }

  await ensureWorkerUnlock(ctx)
  await ensureWorkerStatusApplyQueue(ctx)
  await ensureDelegationUnlockQueue(ctx)
  await ensureWorkerCapQueue(ctx, block)

  if (ctx.isHead) {
    await updateWorkersOnline(ctx, block)
    await updateWorkersMetrics(ctx, block)
    await updateWorkerRewardStats(ctx, block)
  }
}

let blocksPassed = 0
async function complete(ctx: MappingContext, block: BlockHeader) {
  if (ctx.isHead) {
    await updateWorkersCap(ctx, block)
  }

  if (blocksPassed > 1000 && block.l1BlockNumber) {
    const cutoff = block.l1BlockNumber - 50_000
    const chunkSize = 10_000

    while (true) {
      const batch = await ctx.store.find(Block, {
        where: { l1BlockNumber: LessThanOrEqual(cutoff) },
        order: { l1BlockNumber: 'ASC' },
        take: chunkSize,
        cacheEntities: false,
      })
      if (batch.length === 0) break

      await ctx.store.remove(Block, batch.map((b) => b.id))
      ctx.log.info(`pruned ${batch.length} old blocks`)

      if (batch.length < chunkSize) break
    }

    blocksPassed = 0
  }
  blocksPassed += ctx.blocks.length
}

async function checkForNewEpoch(ctx: MappingContext, block: BlockHeader) {
  if (block.height < network.epochsStart) return
  if (!block.l1BlockNumber) return

  const settings = await ctx.store.getOrFail(Settings, network.name)
  const epochLength = settings?.epochLength
  if (epochLength == null) return

  let currentEpoch: Epoch | undefined
  if (settings.currentEpoch != null) {
    currentEpoch = await ctx.store.getOrFail(Epoch, createEpochId(settings.currentEpoch))
  }

  while (true) {
    const epochStart =
      currentEpoch == null ? toEpochStart(block.l1BlockNumber, epochLength) : currentEpoch.end + 1
    if (block.l1BlockNumber < epochStart) break

    if (currentEpoch) {
      currentEpoch.status = EpochStatus.ENDED
      currentEpoch.endedAt = new Date(block.timestamp)
      ctx.log.info(`epoch ${currentEpoch.number} ended`)
    }

    const newEpochNumber = settings.currentEpoch == null ? 0 : settings.currentEpoch + 1
    currentEpoch = new Epoch({
      id: createEpochId(newEpochNumber),
      number: newEpochNumber,
      start: epochStart,
      end: epochStart + epochLength - 1,
      status: EpochStatus.STARTED,
    })
    await ctx.store.track(currentEpoch)

    ctx.log.info(`epoch ${currentEpoch.number} started [${currentEpoch.start}, ${currentEpoch.end}]`)

    settings.currentEpoch = currentEpoch.number
  }
}
