import {
  createHandler,
  timed,
  isLog,
  createAccountId,
  VESTING_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as SubsquidVesting from '@subsquid-network/shared/lib/abi/SubsquidVesting'
import { Vesting } from '~/model'

export const handleVestingTransferred = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!SubsquidVesting.events.OwnershipTransferred.is(item.value)) return
  if (item.value.topics.length !== 3) return
  if (!ctx.templates.has(VESTING_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const { newOwner } = SubsquidVesting.events.OwnershipTransferred.decode(item.value)

  const vestingId = createAccountId(item.address)
  ctx.store.defer(Vesting, vestingId)

  return timed(ctx, async (elapsed) => {
    const vesting = await ctx.store.get(Vesting, vestingId)
    if (!vesting) return

    vesting.beneficiary = createAccountId(newOwner)

    ctx.log.info(`transferred vesting(${vesting.id}) to ${vesting.beneficiary} (${elapsed()}ms)`)
  })
})
