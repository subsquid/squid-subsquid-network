import type { StoreWithCache } from '@belopash/typeorm-store';
import type { Item } from './item';
import type { ProcessorContext } from './processor';
import type { Task } from './utils/queue';
export type MappingContext = ProcessorContext<StoreWithCache>;
export type Handler = (ctx: MappingContext, item: Item) => Task | undefined;
export declare function createHandlerOld<T extends Item = Item>({ filter, handle, }: {
    filter?: (ctx: MappingContext, item: Item) => item is T;
    handle: (ctx: MappingContext, item: T) => Task | undefined;
}): Handler;
export declare function createHandler(fn: Handler): Handler;
export declare function timed(ctx: MappingContext, fn: (elapsed: () => number) => Promise<void>): Task;
