import {
  VESTING_TEMPLATE_KEY,
  createAccountId,
  createHandler,
  isLog,
  network,
  normalizeAddress,
  timed,
} from '@sqd/shared'
import * as VestingFactory from '@sqd/shared/lib/abi/VestingFactory'
import { Vesting } from '~/model'

export const handleVestingCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.VestingFactory.address) return
  if (!VestingFactory.events.VestingCreated.is(item.value)) return

  const { vesting: vestingAddress, beneficiary: beneficiaryAddress } =
    VestingFactory.events.VestingCreated.decode(item.value)

  const vestingId = createAccountId(vestingAddress)
  ctx.store.defer(Vesting, vestingId)

  return timed(ctx, async (elapsed) => {
    const vesting = await ctx.store.getOrCreate(Vesting, vestingId, (id) => {
      return new Vesting({
        id,
        beneficiary: createAccountId(beneficiaryAddress),
        createdAt: new Date(item.value.block.timestamp),
      })
    })

    vesting.beneficiary = createAccountId(beneficiaryAddress)

    ctx.templates.add(
      VESTING_TEMPLATE_KEY,
      normalizeAddress(vestingAddress),
      item.value.block.height,
    )

    ctx.log.info(`created vesting(${vesting.id}) for ${vesting.beneficiary} (${elapsed()}ms)`)
  })
})
