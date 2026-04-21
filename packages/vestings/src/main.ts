import 'dotenv/config'

import { TypeormDatabaseWithCache } from '@belopash/typeorm-store'
import { run } from '@subsquid/batch-processor'
import { augmentBlock } from '@subsquid/evm-objects'
import { createLogger } from '@subsquid/logger'

import type { StoreWithCache } from '@belopash/typeorm-store'
import {
  type ProcessorContext,
  type Task,
  VESTING_TEMPLATE_KEY,
  last,
  network,
  sortItems,
  stopwatch,
} from '@sqd/shared'
import type { BlockData } from './types'

import { processor } from './config/processor'
import {
  ensureTemporaryHoldingUnlockQueue,
  handlers,
  processTemporaryHoldingUnlockQueue,
} from './handlers'

const logger = createLogger('sqd:vestings')

run(processor, new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
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
    await ensureTemporaryHoldingUnlockQueue(ctx)
  })

  let handlerTaskCount = 0
  for (const block of ctx.blocks) {
    const items = sortItems(block)

    tasks.push(async () => {
      await processTemporaryHoldingUnlockQueue(ctx, block.header)
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

  const prepTime = batchSw.get()

  for (const task of tasks) {
    await task()
  }

  const execTime = batchSw.get()

  ctx.log.debug(
    `batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`,
  )
})
