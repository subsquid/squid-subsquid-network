import { DataHandlerContext, type TemplateManager } from '@subsquid/batch-processor'
import {
  Block as _BlockData,
  BlockHeader as _BlockHeader,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-objects'
import { DataSourceBuilder, type GetDataSourceBlock, type Block } from '@subsquid/evm-stream'
import type { Logger } from '@subsquid/logger'
import { assertNotNull } from '@subsquid/util-internal'

import { network } from './config/network'

export { DataSourceBuilder }

export function createBaseBuilder() {
  const builder = new DataSourceBuilder()
    .setFields({
      block: {
        timestamp: true,
        l1BlockNumber: true,
      },
      log: {
        address: true,
        topics: true,
        data: true,
        transactionHash: true,
      },
    })
    .includeAllBlocks()
    .setBlockRange(network.range)

  if (process.env.PORTAL_ENDPOINT) {
    builder.setPortal({
      url: assertNotNull(process.env.PORTAL_ENDPOINT),
      minBytes: 40 * 1024 * 1024,
    })
  }

  return builder
}

type BaseBuilder = ReturnType<typeof createBaseBuilder>
type BaseProcessor = ReturnType<BaseBuilder['build']>
export type Fields = GetDataSourceBlock<BaseProcessor> extends Block<infer F> ? F : never

export type BlockData = _BlockData<Fields>
export type BlockHeader = _BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>

export type { TemplateManager }

export type ProcessorContext<Store> = DataHandlerContext<BlockData, Store> & {
  log: Logger
}
