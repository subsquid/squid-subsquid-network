import fs from 'fs'

import { DataSourceBuilder } from '@subsquid/evm-stream'

import { network } from '../network'

import * as Vesting from '~/abi/SubsquidVesting'
import * as VestingFactory from '~/abi/VestingFactory'

type VestingsMetadata = {
  height: number
  addresses: string[]
}

export function addVestingsQuery(builder: DataSourceBuilder) {
  const file = fs.readFileSync(`./assets/${network.name}/vestings.json`, 'utf-8')
  const vestings = JSON.parse(file) as VestingsMetadata

  builder.addLog({
    range: network.contracts.VestingFactory.range,
    where: {
      address: [network.contracts.VestingFactory.address],
      topic0: [VestingFactory.events.VestingCreated.topic],
    },
  })

  if (network.name === 'tethys') {
    builder
      .addLog({
        range: {
          from: 0,
          to: vestings.height,
        },
        where: {
          address: vestings.addresses,
          topic0: [Vesting.events.OwnershipTransferred.topic],
        },
      })
      .addLog({
        range: {
          from: vestings.height ?? 0,
        },
        where: {
          topic0: [Vesting.events.OwnershipTransferred.topic],
        },
      })
  }

  builder.addLog({
    range: {
      from: 0,
      to: vestings.height,
    },
    where: {
      address: vestings.addresses,
      topic0: [Vesting.events.ERC20Released.topic],
    },
  })
  builder.addLog({
    range: {
      from: vestings.height ?? 0,
    },
    where: {
      topic0: [Vesting.events.ERC20Released.topic],
    },
  })
}
