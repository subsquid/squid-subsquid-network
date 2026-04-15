import { VESTING_TEMPLATE_KEY, network } from '@sqd/shared'
import * as Vesting from '@sqd/shared/lib/abi/SubsquidVesting'
import * as TemporaryHoldingFactory from '@sqd/shared/lib/abi/TemporaryHoldingFactory'
import * as VestingFactory from '@sqd/shared/lib/abi/VestingFactory'
import { DataSourceBuilder } from '@subsquid/evm-stream'
import { assertNotNull } from '@subsquid/util-internal'

const builder = new DataSourceBuilder()
  .setFields({
    block: {
      timestamp: true,
      l1BlockNumber: true,
    },
    log: {
      address: true,
      topics: true,
      data: true,
      transactionHash: true,
    },
  })
  .setBlockRange(network.range)
  .includeAllBlocks()

if (process.env.PORTAL_ENDPOINT) {
  builder.setPortal({
    url: assertNotNull(process.env.PORTAL_ENDPOINT),
    minBytes: 40 * 1024 * 1024,
  })
}

builder.addLog({
  range: network.contracts.VestingFactory.range,
  where: {
    address: [network.contracts.VestingFactory.address],
    topic0: [VestingFactory.events.VestingCreated.topic],
  },
})

builder.addLog({
  range: network.contracts.TemporaryHoldingFactory.range,
  where: {
    address: [network.contracts.TemporaryHoldingFactory.address],
    topic0: [TemporaryHoldingFactory.events.TemporaryHoldingCreated.topic],
  },
  include: { transaction: true },
})

if (network.name === 'tethys') {
  builder.addLog(VESTING_TEMPLATE_KEY, {
    range: { from: network.range.from },
    where: { topic0: [Vesting.events.OwnershipTransferred.topic] },
  })
}

builder.addLog(VESTING_TEMPLATE_KEY, {
  range: { from: network.range.from },
  where: { topic0: [Vesting.events.ERC20Released.topic] },
})

export const processor = builder.build()
