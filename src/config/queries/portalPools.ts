import { DataSourceBuilder } from '@subsquid/evm-stream'

import { network } from '../network'

import { loadPreindexFile } from './loadPreindex'

import * as PortalPoolFactory from '~/abi/PortalPoolFactory'
import * as PortalPoolImplementation from '~/abi/PortalPoolImplementation'

type PortalPoolsMetadata = {
  height: number
  addresses: string[]
}

export function addPortalPoolsQuery(builder: DataSourceBuilder) {
  const metadata = loadPreindexFile<PortalPoolsMetadata>(
    `./assets/${network.name}/portal_pools.json`,
  )

  builder.addLog({
    range: network.contracts.PortalPoolFactory.range,
    where: {
      address: [network.contracts.PortalPoolFactory.address],
      topic0: [PortalPoolFactory.events.PoolCreated.topic],
    },
    include: {
      transaction: true,
    },
  })

  const poolEventTopics = [
    PortalPoolImplementation.events.Deposited.topic,
    PortalPoolImplementation.events.Withdrawn.topic,
    PortalPoolImplementation.events.ExitClaimed.topic,
  ]

  if (metadata && metadata.addresses.length > 0) {
    builder.addLog({
      range: {
        from: network.contracts.PortalPoolFactory.range.from,
        to: metadata.height,
      },
      where: {
        address: metadata.addresses,
        topic0: poolEventTopics,
      },
      include: {
        transaction: true,
      },
    })
  }

  builder.addLog({
    range: {
      from: metadata ? metadata.height + 1 : network.contracts.PortalPoolFactory.range.from,
    },
    where: {
      topic0: poolEventTopics,
    },
  })
}
