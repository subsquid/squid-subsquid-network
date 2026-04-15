import 'dotenv/config'

import { TypeormDatabaseWithCache } from '@belopash/typeorm-store'
import { run } from '@subsquid/batch-processor'
import { augmentBlock } from '@subsquid/evm-objects'
import { createLogger } from '@subsquid/logger'

import type { StoreWithCache } from '@belopash/typeorm-store'
import { type ProcessorContext, type Task, last, sortItems, stopwatch } from '@sqd/shared'
import type { BlockData } from './types'

import { processor } from './config/processor'
import {
  ensureGatewayStakeApplyQueue,
  ensureGatewayStakeUnlockQueue,
  handlers,
  processGatewayStakeApplyQueue,
  processGatewayStakeUnlockQueue,
} from './handlers'

const logger = createLogger('sqd:gateways')

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
    await ensureGatewayStakeApplyQueue(ctx)
    await ensureGatewayStakeUnlockQueue(ctx)
  })

  let handlerTaskCount = 0
  for (const block of ctx.blocks) {
    const items = sortItems(block)

    tasks.push(async () => {
      await processGatewayStakeApplyQueue(ctx, block.header)
      await processGatewayStakeUnlockQueue(ctx, block.header)
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
