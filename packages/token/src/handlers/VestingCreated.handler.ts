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

import { Account, AccountType } from '~/model'

function createAccount(id: string, opts?: { owner?: Account; type?: AccountType }) {
  return new Account({
    id,
    balance: 0n,
    claimableDelegationCount: 0,
    type: AccountType.USER,
    ...opts,
  })
}

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
