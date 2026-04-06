import { type StoreWithCache, TypeormDatabaseWithCache } from '@belopash/typeorm-store'
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

import { run } from '@subsquid/batch-processor'
import { augmentBlock } from '@subsquid/evm-objects'
import { createLogger } from '@subsquid/logger'
import { network } from '~/config/network'
import { BlockHeader, type ProcessorContext, processor } from '~/config/processor'
import { NETWORK_CONTROLLER_TEMPLATE_KEY } from '~/config/queries/networkController'
import { REWARD_TREASURY_TEMPLATE_KEY } from '~/config/queries/rewardTreasury'
import { STAKING_TEMPLATE_KEY } from '~/config/queries/staking'
import { WORKER_REGISTRATION_TEMPLATE_KEY } from '~/config/queries/workersRegistry'
import { handlers } from '~/core'
import {
  ensureGatewayStakeUnlockQueue,
  processGatewayStakeUnlockQueue,
} from '~/core/gateway/StakeUnlock.queue'
import { createBlock, createSettings } from '~/core/helpers/entities'
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
import { last, stopwatch, toEpochStart, toNextEpochStart } from '~/utils/misc'
import { Task } from '~/utils/queue'
import {
  ensureTemporaryHoldingUnlockQueue,
  processTemporaryHoldingUnlockQueue,
} from './core/temporary-holding/CheckTempHoldingUnlock.listener'
import { startMaterializedViewRefresh } from './materialized-view-refresh'

let isMaterializedRefreshRunning = false

const logger = createLogger('sqd:mapping')

run(processor, new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
  const batchSw = stopwatch()

  const ctx: ProcessorContext<StoreWithCache> = {
    ..._ctx,
    blocks: _ctx.blocks.map(augmentBlock),
    log: logger,
  }

  const firstBlock = ctx.blocks[0].header
  const lastBlock = last(ctx.blocks)!.header

  if (!isMaterializedRefreshRunning && ctx.isHead) {
    isMaterializedRefreshRunning = true
    startMaterializedViewRefresh(ctx.store['em'].connection.manager)
  }

  const tasks: Task[] = []

  ctx.store.defer(Settings, network.name)
  tasks.push(() => init(ctx, ctx.blocks[0].header))

  let handlerTaskCount = 0
  for (const block of ctx.blocks) {
    const items = sortItems(block)

    tasks.push(
      withBlockContext(
        async () => {
          await ctx.store.track(createBlock(block.header))

          await checkForNewEpoch(ctx, block.header)

          await processWorkerUnlockQueue(ctx, block.header)
          await processWorkerStatusApplyQueue(ctx, block.header)
          await processDelegationUnlockQueue(ctx, block.header)
          await processGatewayStakeApplyQueue(ctx, block.header)
          await processGatewayStakeUnlockQueue(ctx, block.header)
          await processTemporaryHoldingUnlockQueue(ctx, block.header)
        },
        { block: block.header },
      ),
    )

    for (const item of items) {
      for (const handler of handlers) {
        const task = handler(ctx, item)
        if (task) {
          tasks.push(withBlockContext(task, item.value))
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

  ctx.log.info(
    `batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`,
  )
})

async function init(ctx: MappingContext, block: BlockHeader) {
  // ensure settings
  await ctx.store.getOrCreate(Settings, network.name, (id) => {
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
      portalPoolFactory: network.contracts.PortalPoolFactory.address,
      networkController: network.defaultRouterContracts.networkController,
      rewardCalculation: network.defaultRouterContracts.rewardCalculation,
      rewardTreasury: network.defaultRouterContracts.rewardTreasury,
      staking: network.defaultRouterContracts.staking,
      workerRegistration: network.defaultRouterContracts.workerRegistration,
    })

    return settings
  })

  // seed default router contract templates on first run
  const defaultFrom = network.range.from
  const defaults = [
    [WORKER_REGISTRATION_TEMPLATE_KEY, network.defaultRouterContracts.workerRegistration],
    [NETWORK_CONTROLLER_TEMPLATE_KEY, network.defaultRouterContracts.networkController],
    [STAKING_TEMPLATE_KEY, network.defaultRouterContracts.staking],
    [REWARD_TREASURY_TEMPLATE_KEY, network.defaultRouterContracts.rewardTreasury],
  ] as const
  for (const [key, address] of defaults) {
    if (!ctx.templates.has(key, address, defaultFrom)) {
      ctx.templates.add(key, address, defaultFrom)
    }
  }

  await ensureWorkerUnlock(ctx)
  await ensureWorkerStatusApplyQueue(ctx)
  await ensureDelegationUnlockQueue(ctx)
  await ensureGatewayStakeApplyQueue(ctx)
  await ensureGatewayStakeUnlockQueue(ctx)
  await ensureTemporaryHoldingUnlockQueue(ctx)
  await ensureWorkerCapQueue(ctx, block)

  if (ctx.isHead) {
    await updateWorkersOnline(ctx, block)
    await updateWorkersMetrics(ctx, block)
    await updateWorkerRewardStats(ctx, block)
  }
}

let blocksPassed = Infinity
async function complete(ctx: MappingContext, block: BlockHeader) {
  if (ctx.isHead) {
    await updateWorkersCap(ctx, block)
  }

  if (blocksPassed > 1000 && block.l1BlockNumber) {
    const limit = 50_000
    let offset = 0
    const ids: string[] = []

    while (true) {
      const batch = await ctx.store.find(Block, {
        where: { l1BlockNumber: LessThanOrEqual(block.l1BlockNumber - 50_000) },
        order: { l1BlockNumber: 'ASC' },
        skip: offset,
        take: limit,
        cacheEntities: false,
      })

      ids.push(...batch.map((block) => block.id))

      if (batch.length < limit) break
      offset += limit
    }

    if (ids.length > 0) {
      await ctx.store.remove(Block, ids)
      ctx.log.info(`pruned ${ids.length} old blocks`)
    }

    blocksPassed = 0
  }
  blocksPassed += ctx.blocks.length
}

async function checkForNewEpoch(ctx: MappingContext, block: BlockHeader) {
  if (block.number < network.epochsStart) return
  if (!block.l1BlockNumber) return

  const settings = await ctx.store.getOrFail(Settings, network.name)
  const epochLength = settings?.epochLength
  if (epochLength == null) return

  let currentEpoch: Epoch | undefined
  if (settings.currentEpoch != null) {
    currentEpoch = await ctx.store.getOrFail(Epoch, createEpochId(settings.currentEpoch))
  }

  const epochStart =
    currentEpoch == null ? toEpochStart(block.l1BlockNumber, epochLength) : currentEpoch.end + 1
  if (block.l1BlockNumber < epochStart) return

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

function withBlockContext<T>(fn: () => T, ctx: { block: { height: number; hash: string } }) {
  return () => {
    try {
      return fn()
    } catch (err: any) {
      throw addErrorContext(err, {
        blockHeight: ctx.block.height,
        blockHash: ctx.block.hash,
      })
    }
  }
}

function addErrorContext<T extends Error>(err: T, ctx: any): T {
  const e = err as any
  for (const key in ctx) {
    if (e[key] == null) {
      e[key] = ctx[key]
    }
  }
  return err
}
