import {
  Block,
  BlockHeader as _BlockHeader,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-objects'
import type { GetDataSourceBlock, Block as StreamBlock } from '@subsquid/evm-stream'
import type { processor } from './config/processor'

type Processor = typeof processor
type StreamBlockData = GetDataSourceBlock<Processor>
type Fields = StreamBlockData extends StreamBlock<infer F> ? F : never

export type BlockData = Block<Fields>
export type BlockHeader = _BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
