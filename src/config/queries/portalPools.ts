import { DataSourceBuilder } from '@subsquid/evm-stream'

import { network } from '../network'

import * as PortalPoolFactory from '~/abi/PortalPoolFactory'
import * as PortalPoolImplementation from '~/abi/PortalPoolImplementation'

export const PORTAL_POOL_TEMPLATE_KEY = 'portal_pool'

const poolEventTopics = [
  PortalPoolImplementation.events.Deposited.topic,
  PortalPoolImplementation.events.Withdrawn.topic,
  PortalPoolImplementation.events.ExitClaimed.topic,
]

export function addPortalPoolsQuery(builder: DataSourceBuilder) {
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

  builder.addLog(PORTAL_POOL_TEMPLATE_KEY, {
    range: { from: network.contracts.PortalPoolFactory.range.from },
    where: { topic0: poolEventTopics },
    include: { transaction: true },
  })
}
