import {
  createBaseBuilder,
  addVestingsQuery,
  network,
} from '@subsquid-network/shared'
import * as TemporaryHoldingFactory from '@subsquid-network/shared/lib/abi/TemporaryHoldingFactory'

const builder = createBaseBuilder()

builder.addLog({
  range: network.contracts.TemporaryHoldingFactory.range,
  where: {
    address: [network.contracts.TemporaryHoldingFactory.address],
    topic0: [TemporaryHoldingFactory.events.TemporaryHoldingCreated.topic],
  },
  include: {
    transaction: true,
  },
})

addVestingsQuery(builder)

export const processor = builder.build()
