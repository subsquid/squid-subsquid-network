import fs from 'fs'

import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { network } from '../network'

import * as Vesting from '~/abi/SubsquidVesting'
import * as VestingFactory from '~/abi/VestingFactory'

type VestingsMetadata = {
  height: number
  addresses: string[]
}

export function addVestingsQuery(processor: EvmBatchProcessor) {
  const file = fs.readFileSync(`./assets/${network.name}/vestings.json`, 'utf-8')
  const vestings = JSON.parse(file) as VestingsMetadata

  processor.addLog({
    address: [network.contracts.VestingFactory.address],
    range: network.contracts.VestingFactory.range,
    topic0: [VestingFactory.events.VestingCreated.topic],
  })

  if (network.name === 'tethys') {
    processor
      .addLog({
        address: vestings.addresses,
        topic0: [Vesting.events.OwnershipTransferred.topic],
        range: {
          from: 0,
          to: vestings.height,
        },
      })
      .addLog({
        topic0: [Vesting.events.OwnershipTransferred.topic],
        range: {
          from: vestings.height ?? 0,
        },
      })
  }

  processor.addLog({
    address: vestings.addresses,
    topic0: [Vesting.events.ERC20Released.topic],
    range: {
      from: 0,
      to: vestings.height,
    },
  })
  processor.addLog({
    topic0: [Vesting.events.ERC20Released.topic],
    range: {
      from: vestings.height ?? 0,
    },
  })
}
