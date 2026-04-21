import type { StoreWithCache } from '@belopash/typeorm-store'
import type { Item } from './item'
import type { ProcessorContext } from './processor'
import type { Awaitable } from './utils/misc'
import type { Task } from './utils/queue'

export type MappingContext = ProcessorContext<StoreWithCache>

export type Handler = (ctx: MappingContext, item: Item) => Task | undefined

export function createHandlerOld<T extends Item = Item>({
  filter,
  handle,
}: {
  filter?: (ctx: MappingContext, item: Item) => item is T
  handle: (ctx: MappingContext, item: T) => Task | undefined
}): Handler {
  return (ctx, item) => {
    if (!filter || filter(ctx, item)) return handle(ctx, item as T)
  }
}

export function createHandler(fn: Handler): Handler {
  return fn
}

export function timed(ctx: MappingContext, fn: (elapsed: () => number) => Promise<void>): Task {
  return async () => {
    const start = performance.now()
    await fn(() => Math.round((performance.now() - start) * 100) / 100)
  }
}
