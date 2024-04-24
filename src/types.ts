import { StoreWithCache } from '@belopash/typeorm-store';

import { Block, ProcessorContext } from './config/processor';
import { Item } from './item';
import { EventEmitter } from './utils/events';
import { Awaitable } from './utils/misc';
import { TaskQueue } from './utils/queue';

export enum Events {
  Initialization = 'initialization',
  Finalization = 'finalization',
  BlockStart = 'block_start',
  BlockEnd = 'block_end',
  EpochStart = 'epoch_start',
  EpochEnd = 'epoch_end',
}

export type EventMap = {
  [Events.Initialization]: () => Awaitable<void>;
  [Events.Finalization]: () => Awaitable<void>;
  [Events.BlockStart]: (block: Block) => Awaitable<void>;
  [Events.BlockEnd]: (block: Block) => Awaitable<void>;
  [Events.EpochStart]: (block: Block, epochId: string) => Awaitable<void>;
  [Events.EpochEnd]: (block: Block, epochId: string) => Awaitable<void>;
};

export type MappingContext = ProcessorContext<StoreWithCache> & {
  queue: TaskQueue;
  events: EventEmitter<EventMap>;
};

export type Handler = (ctx: MappingContext, item: Item) => void;
