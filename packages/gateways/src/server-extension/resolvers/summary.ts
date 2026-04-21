import assert from 'assert'

import { BigInteger } from '@subsquid/graphql-server'
import { Field, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'

@ObjectType()
export class GatewaysSummary {
  @Field(() => BigInteger, { nullable: false })
  totalGatewayStake!: bigint

  @Field(() => BigInteger, { nullable: false })
  totalPortalPoolTvl!: bigint

  @Field(() => Number, { nullable: false })
  gatewayStakeCount!: number

  @Field(() => Number, { nullable: false })
  portalPoolCount!: number

  constructor(props: Partial<GatewaysSummary>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class GatewaysSummaryResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => GatewaysSummary)
  async gatewaysSummary(): Promise<GatewaysSummary> {
    const manager = await this.tx()

    return await manager
      .query(
        `
        SELECT
          COALESCE((SELECT SUM(amount) FROM gateway_stake), 0) as "totalGatewayStake",
          COALESCE((SELECT SUM(tvl_total) FROM portal_pool WHERE closed_at IS NULL), 0) as "totalPortalPoolTvl",
          COALESCE((SELECT COUNT(*) FROM gateway_stake), 0) as "gatewayStakeCount",
          COALESCE((SELECT COUNT(*) FROM portal_pool WHERE closed_at IS NULL), 0) as "portalPoolCount"
        `,
      )
      .then((r) => {
        assert(r.length === 1)
        return new GatewaysSummary(r[0])
      })
  }
}
