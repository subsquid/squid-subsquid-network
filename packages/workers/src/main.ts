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
  ensureWorkerStatusApplyQueue,
  ensureWorkerUnlock,
  flushAprRecalc,
  handlers,
  processDelegationUnlockQueue,
  processWorkerStatusApplyQueue,
  processWorkerUnlockQueue,
  updateWorkerRewardStats,
  updateWorkersMetrics,
  updateWorkersOnline,
} from './handlers'
import { createBlock, createSettings } from './helpers'
import { startMaterializedViewRefresh } from './materialized-view-refresh'

const logger = createLogger('sqd:workers')

let isMaterializedRefreshRunning = false

run(processor, new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
  const batchSw = stopwatch()

  const ctx: ProcessorContext<StoreWithCache> = {
    ..._ctx,
    blocks: _ctx.blocks.map(augmentBlock) as BlockData[],
    log: logger,
  }

  // Start the periodic materialized-view refresh once we reach the chain head.
  // Starting during cold-sync would contend with batch processing for DB
  // connections and produce partial views anyway.
  if (!isMaterializedRefreshRunning && ctx.isHead) {
    isMaterializedRefreshRunning = true
    startMaterializedViewRefresh(ctx.store['em'].connection.manager)
  }

  const firstBlock = ctx.blocks[0].header
  const lastBlock = last(ctx.blocks)!.header

  const tasks: Task[] = []

  ctx.store.defer(Settings, network.name)
  tasks.push(withBlockContext(ctx, firstBlock, () => init(ctx, firstBlock)))

  let handlerTaskCount = 0
  for (const block of ctx.blocks) {
    const items = sortItems(block)

    tasks.push(
      withBlockContext(ctx, block.header, async () => {
        await ctx.store.track(createBlock(block.header))

        await processWorkerUnlockQueue(ctx, block.header)
        await processWorkerStatusApplyQueue(ctx, block.header)
        await processDelegationUnlockQueue(ctx, block.header)
      }),
    )

    for (const item of items) {
      for (const handler of handlers) {
        const task = handler(ctx, item)
        if (task) {
          tasks.push(withBlockContext(ctx, block.header, task))
          handlerTaskCount++
        }
      }
    }

    // Epoch bookkeeping must run *after* this block's handlers so `Settings`
    // (e.g. `epochLength` from `EpochLengthUpdated`) is visible. Otherwise the
    // first successful `checkForNewEpoch` can be deferred to a later delivered
    // block with a higher L1, shifting `toEpochStart` for epoch 0 vs the
    // historical behaviour.
    tasks.push(
      withBlockContext(ctx, block.header, async () => {
        await checkForNewEpoch(ctx, block.header)
      }),
    )
  }

  tasks.push(withBlockContext(ctx, lastBlock, () => complete(ctx, lastBlock)))

  const prepTime = batchSw.get()

  for (const task of tasks) {
    await task()
  }

  const execTime = batchSw.get()

  ctx.log.debug(
    `batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`,
  )
})

/**
 * Wraps a task so thrown errors carry the block number/hash they originated
 * from. Matches the master-branch `withBlockContext` helper that was dropped
 * during the monorepo split (and which made handler failures diagnosable in
 * production logs).
 */
function withBlockContext(ctx: MappingContext, block: BlockHeader, task: Task): Task {
  return async () => {
    try {
      await task()
    } catch (err) {
      if (err instanceof Error && !(err as Error & { __sqdBlock?: true }).__sqdBlock) {
        err.message = `at block ${block.height} (${block.hash}): ${err.message}`
        ;(err as Error & { __sqdBlock?: true }).__sqdBlock = true
      }
      throw err
    }
  }
}

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
}

// Start at +Infinity so the first head batch with an L1 block number runs the
// prune pass immediately (matches master behavior). After the first run we
// reset to 0 and accumulate blocks until >1000 have passed before pruning
// again, which keeps the delete volume per batch bounded.
let blocksPassed = Number.POSITIVE_INFINITY
async function complete(ctx: MappingContext, block: BlockHeader) {
  if (ctx.isHead) {
    // Head-only network polls run after all block handlers so metrics / HTTP
    // work does not delay indexing of chain events in this batch.
    await updateWorkersOnline(ctx, block)
    await updateWorkersMetrics(ctx, block)
    await updateWorkerRewardStats(ctx, block)
    // Re-run the network-wide APR rollup at most once per batch, and only if
    // any worker's cap actually moved (deposit/withdraw via `refreshWorkerCap`
    // sets the dirty flag). `updateWorkerRewardStats` triggers its own recalc
    // independently when reward stats arrive.
    await flushAprRecalc(ctx)
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

      await ctx.store.remove(
        Block,
        batch.map((b) => b.id),
      )
      ctx.log.info(`pruned ${batch.length} old blocks`)

      if (batch.length < chunkSize) break
    }

    blocksPassed = 0
  }
  blocksPassed += ctx.blocks.length
}

/**
 * Advance `Settings.currentEpoch` and materialize any missing `Epoch` entities
 * up to and including the epoch that contains `block.l1BlockNumber`.
 *
 * Invoked once per delivered block, **after** that block's log handlers (see
 * task order in the batch loop). That way `Settings.epochLength` and other
 * fields updated in the same block are visible before we align epoch 0 with
 * `toEpochStart(block.l1BlockNumber, epochLength)`.
 *
 * The processor does not subscribe to every chain block (no `includeAllBlocks()`),
 * so delivered blocks are a sparser set than every L1 block — the catch-up loop
 * replays all boundaries between the previously recorded `currentEpoch` and
 * this block.
 *
 * Boundary timestamps are attributed to the block that first carries us past
 * them: the loop does not advance an epoch until a block's L1 number actually
 * reaches `epoch.end + 1`, so `endedAt`/`startedAt` end up stamped with the
 * earliest delivered block past each boundary. When several boundaries fall
 * between two consecutive delivered blocks (e.g. after a network outage) they
 * unavoidably share the same later timestamp — there is no finer-grained data
 * to attribute them with.
 */
async function checkForNewEpoch(ctx: MappingContext, block: BlockHeader) {
  if (block.height < network.epochsStart) return
  if (!block.l1BlockNumber) return

  const settings = await ctx.store.getOrFail(Settings, network.name)
  const epochLength = settings.epochLength
  if (epochLength == null) return

  let currentEpoch: Epoch | undefined
  if (settings.currentEpoch != null) {
    currentEpoch = await ctx.store.getOrFail(Epoch, createEpochId(settings.currentEpoch))
  }

  // Hot path: this block is still inside the current epoch — the typical case
  // for every delivered block that isn't a boundary-crosser. Skipping early
  // avoids the `new Date(...)` allocation below when there's nothing to do.
  if (currentEpoch != null && block.l1BlockNumber <= currentEpoch.end) return

  const timestamp = new Date(block.timestamp)

  let advanced = 0
  while (true) {
    const epochStart =
      currentEpoch == null ? toEpochStart(block.l1BlockNumber, epochLength) : currentEpoch.end + 1
    if (block.l1BlockNumber < epochStart) break

    if (currentEpoch) {
      currentEpoch.status = EpochStatus.ENDED
      currentEpoch.endedAt = timestamp
      ctx.log.info(`epoch ${currentEpoch.number} ended`)
    }

    const newEpochNumber = settings.currentEpoch == null ? 0 : settings.currentEpoch + 1
    currentEpoch = new Epoch({
      id: createEpochId(newEpochNumber),
      number: newEpochNumber,
      start: epochStart,
      end: epochStart + epochLength - 1,
      startedAt: timestamp,
      status: EpochStatus.STARTED,
    })
    await ctx.store.track(currentEpoch)

    ctx.log.info(
      `epoch ${currentEpoch.number} started [${currentEpoch.start}, ${currentEpoch.end}]`,
    )

    settings.currentEpoch = currentEpoch.number
    advanced++
  }

  if (advanced > 1) {
    ctx.log.debug(
      `epoch catch-up: advanced ${advanced} epochs at L1 block ${block.l1BlockNumber}`,
    )
  }
}
