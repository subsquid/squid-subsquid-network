import { Item } from '../item';
import { Handler, MappingContext } from '../types';

import { Task } from '~/utils/queue';

export function createHandler<T extends Item>({
  filter,
  handle,
}: {
  filter: (ctx: MappingContext, item: Item) => item is T;
  handle: (ctx: MappingContext, item: T) => Task | undefined;
}): Handler {
  return (ctx, item) => {
    if (filter(ctx, item)) return handle(ctx, item);
  };
}
