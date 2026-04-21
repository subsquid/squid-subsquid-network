import { DataHandlerContext, type TemplateManager } from '@subsquid/batch-processor'
import {
  Block as _BlockData,
  BlockHeader as _BlockHeader,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-objects'
import { DataSourceBuilder, type FieldSelection } from '@subsquid/evm-stream'
import type { Logger } from '@subsquid/logger'

export { DataSourceBuilder }
export type { FieldSelection }

type DefaultFields = {
  block: { timestamp: true; l1BlockNumber: true }
  log: { address: true; topics: true; data: true; transactionHash: true }
}

export type BlockData = _BlockData<DefaultFields>
export type BlockHeader = _BlockHeader<DefaultFields>
export type Log = _Log<DefaultFields>
export type Transaction = _Transaction<DefaultFields>

export type { TemplateManager }

export type ProcessorContext<Store> = DataHandlerContext<BlockData, Store> & {
  log: Logger
}
