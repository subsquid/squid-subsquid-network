import { StoreWithCache } from '@belopash/typeorm-store';

import { BlockHeader, ProcessorContext } from './config/processor';
import { Item } from './item';
import { EventEmitter } from './utils/events';
import { Awaitable } from './utils/misc';
import { Task, TaskQueue } from './utils/queue';

export enum Events {
  Initialization = 'initialization',
  Finalization = 'finalization',
  BlockStart = 'block_start',
  BlockEnd = 'block_end',
  EpochStart = 'epoch_start',
  EpochEnd = 'epoch_end',
  RewardsDistributed = 'rewards_distributed',
}

export type EventMap = {
  [Events.Initialization]: (block: BlockHeader) => Awaitable<void>;
  [Events.Finalization]: (block: BlockHeader) => Awaitable<void>;
  [Events.BlockStart]: (block: BlockHeader) => Awaitable<void>;
  [Events.BlockEnd]: (block: BlockHeader) => Awaitable<void>;
  [Events.EpochStart]: (block: BlockHeader, epochId: string) => Awaitable<void>;
  [Events.EpochEnd]: (block: BlockHeader, epochId: string) => Awaitable<void>;
  [Events.RewardsDistributed]: (block: BlockHeader) => Awaitable<void>;
};

export type MappingContext = ProcessorContext<StoreWithCache> & {
  // tasks: TaskQueue;
  // events: EventEmitter<EventMap>;
  delegatedWorkers: Set<string>; // TODO: need better solution for tracking workers with updated stakes
};

export type Handler = (ctx: MappingContext, item: Item) => Task | undefined;
