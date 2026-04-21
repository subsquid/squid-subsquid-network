import {
  createGatewayOperatorId,
  createHandler,
  isContract,
  isLog,
  network,
  timed,
} from '@sqd/shared'
import * as GatewayRegistry from '@sqd/shared/lib/abi/GatewayRegistry'

import { GatewayStake } from '~/model'
import {
  addToGatewayStakeUnlockQueue,
  removeFromGatewayStakeUnlockQueue,
} from './StakeUnlock.queue'
import { INT32_MAX } from './Staked.handler'

export const autoExtensionChangedHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.GatewayRegistry)) return
  if (!isLog(item)) return
  if (
    !GatewayRegistry.events.AutoextensionEnabled.is(item.value) &&
    !GatewayRegistry.events.AutoextensionDisabled.is(item.value)
  )
    return

  const log = item.value

  let gatewayOperator: string, lockEnd: number | null, autoExtension: boolean
  if (GatewayRegistry.events.AutoextensionEnabled.is(log)) {
    const data = GatewayRegistry.events.AutoextensionEnabled.decode(log)
    gatewayOperator = data.gatewayOperator
    lockEnd = INT32_MAX
    autoExtension = true
  } else {
    const data = GatewayRegistry.events.AutoextensionDisabled.decode(log)
    gatewayOperator = data.gatewayOperator
    lockEnd = Number(data.lockEnd)
    autoExtension = false
  }

  const stakeId = createGatewayOperatorId(gatewayOperator)
  const stakeDeferred = ctx.store.defer(GatewayStake, stakeId)

  return timed(ctx, async (elapsed) => {
    const stake = await stakeDeferred.get()
    if (!stake) {
      ctx.log.info(
        `skipped AutoExtensionChanged: no stake for operator ${stakeId} (${elapsed()}ms)`,
      )
      return
    }

    stake.autoExtension = autoExtension
    stake.locked = true
    stake.lockEnd = lockEnd

    if (lockEnd) {
      await removeFromGatewayStakeUnlockQueue(ctx, stake.id)
      ctx.log.info(`stake(${stake.id}) auto-extension enabled (${elapsed()}ms)`)
    } else {
      await addToGatewayStakeUnlockQueue(ctx, stake.id)
      ctx.log.info(
        `stake(${stake.id}) auto-extension disabled [${stake.lockStart}, ${stake.lockEnd}] (${elapsed()}ms)`,
      )
    }
  })
})
