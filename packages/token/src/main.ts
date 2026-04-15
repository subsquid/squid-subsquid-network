import 'dotenv/config'

import { TypeormDatabaseWithCache } from '@belopash/typeorm-store'
import { run } from '@subsquid/batch-processor'
import { augmentBlock } from '@subsquid/evm-objects'
import { createLogger } from '@subsquid/logger'

import {
  type ProcessorContext,
  type Task,
  last,
  sortItems,
  stopwatch,
  network,
  STAKING_TEMPLATE_KEY,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  REWARD_TREASURY_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import type { StoreWithCache } from '@belopash/typeorm-store'

import { processor } from './config/processor'
import { handlers } from './handlers'

const logger = createLogger('sqd:token')

run(processor, new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
  const batchSw = stopwatch()

  const ctx: ProcessorContext<StoreWithCache> = {
    ..._ctx,
    blocks: _ctx.blocks.map(augmentBlock),
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

  ctx.log.info(
    `batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`,
  )
})
