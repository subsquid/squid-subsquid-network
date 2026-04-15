import { DataSourceBuilder } from '@subsquid/evm-stream'
import * as Vesting from '../../abi/SubsquidVesting'
import * as VestingFactory from '../../abi/VestingFactory'
import { network } from '../network'

export const VESTING_TEMPLATE_KEY = 'vesting'

export function addVestingsQuery(builder: DataSourceBuilder) {
  builder.addLog({
    range: network.contracts.VestingFactory.range,
    where: {
      address: [network.contracts.VestingFactory.address],
      topic0: [VestingFactory.events.VestingCreated.topic],
    },
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
}
