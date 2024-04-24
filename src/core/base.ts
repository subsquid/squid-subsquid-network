import { Item } from '../item';
import { Handler, MappingContext } from '../types';

export function createHandler<T extends Item>({
  filter,
  handle,
}: {
  filter: (ctx: MappingContext, item: Item) => item is T;
  handle: (ctx: MappingContext, item: T) => void;
}): Handler {
  return (ctx, item) => {
    if (filter(ctx, item)) return handle(ctx, item);
  };
}
