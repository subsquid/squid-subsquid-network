import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId } from '../helpers/ids'

import * as VestingFactory from '~/abi/VestingFactory'
import { network } from '~/config/network'
import { VESTING_TEMPLATE_KEY } from '~/config/queries/vestings'
import { Account, AccountType } from '~/model'
import { normalizeAddress } from '~/utils/misc'

export const handleVestingCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.VestingFactory.address) return
  if (!VestingFactory.events.VestingCreated.is(item.value)) return

  const { vesting: vestingAddress, beneficiary: beneficiaryAddress } =
    VestingFactory.events.VestingCreated.decode(item.value)

  const ownerDeferred = ctx.store.defer(Account, createAccountId(beneficiaryAddress))
  const vestingDeferred = ctx.store.defer(Account, {
    id: createAccountId(vestingAddress),
    relations: { owner: true },
  })

  return timed(ctx, async (elapsed) => {
    const owner = await ctx.store.getOrCreate(
      Account,
      createAccountId(beneficiaryAddress),
      (id) => {
        ctx.log.info(`created account(${id})`)
        return createAccount(id, { type: AccountType.USER })
      },
    )
    const vesting = await ctx.store.getOrCreate(
      Account,
      { id: createAccountId(vestingAddress), relations: { owner: true } },
      (id) => {
        ctx.log.info(`created account(${id})`)
        return createAccount(id, { type: AccountType.VESTING, owner })
      },
    )

    if (vesting.type !== AccountType.VESTING || vesting.owner?.id !== owner.id) {
      vesting.type = AccountType.VESTING
      vesting.owner = owner
    }

    ctx.templates.add(
      VESTING_TEMPLATE_KEY,
      normalizeAddress(vestingAddress),
      item.value.block.height,
    )

    ctx.log.info(`created vesting(${vesting.id}) for account(${owner.id}) (${elapsed()}ms)`)
  })
})
