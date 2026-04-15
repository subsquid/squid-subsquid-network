import 'dotenv/config'

import { TypeormDatabaseWithCache } from '@belopash/typeorm-store'
import { run } from '@subsquid/batch-processor'
import { augmentBlock } from '@subsquid/evm-objects'
import { createLogger } from '@subsquid/logger'

import type { StoreWithCache } from '@belopash/typeorm-store'
import {
  type ProcessorContext,
  REWARD_TREASURY_TEMPLATE_KEY,
  STAKING_TEMPLATE_KEY,
  type Task,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  last,
  network,
  sortItems,
  stopwatch,
} from '@sqd/shared'
import type { BlockData } from './types'

import { processor } from './config/processor'
import { handlers } from './handlers'

const logger = createLogger('sqd:token')

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

  tasks.push(async () => {
    const defaultFrom = network.range.from
    const defaults = [
      [WORKER_REGISTRATION_TEMPLATE_KEY, network.defaultRouterContracts.workerRegistration],
      [STAKING_TEMPLATE_KEY, network.defaultRouterContracts.staking],
      [REWARD_TREASURY_TEMPLATE_KEY, network.defaultRouterContracts.rewardTreasury],
    ] as const
    for (const [key, address] of defaults) {
      if (!ctx.templates.has(key, address, defaultFrom)) {
        ctx.templates.add(key, address, defaultFrom)
      }
    }
  })

  let handlerTaskCount = 0
  for (const block of ctx.blocks) {
    const items = sortItems(block)

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

  const prepTime = batchSw.get()

  for (const task of tasks) {
    await task()
  }

  const execTime = batchSw.get()

  ctx.log.debug(
    `batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`,
  )
})
