import 'reflect-metadata';
import { Arg, Query, Resolver, Subscription } from 'type-graphql';
import { Raw, type EntityManager } from 'typeorm';

import { CollectionsEth, CollectionsShib } from '../model';

import { CollectionResult } from './types/collection.input';

@Resolver()
export class CollectionsResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [CollectionResult])
  @Subscription(() => [CollectionResult]
  async collections(): Promise<{ hello: string }> {
    return { hello: 'world' };
  }
}
