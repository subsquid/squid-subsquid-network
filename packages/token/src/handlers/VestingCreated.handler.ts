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

import { Account, AccountType, Vesting } from '~/model'

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

  ctx.store.defer(Account, createAccountId(beneficiaryAddress))
  const vestingId = createAccountId(vestingAddress)
  ctx.store.defer(Account, {
    id: vestingId,
    relations: { owner: true },
  })
  ctx.store.defer(Vesting, vestingId)

  return timed(ctx, async (elapsed) => {
    const owner = await ctx.store.getOrCreate(
      Account,
      createAccountId(beneficiaryAddress),
      (id) => {
        ctx.log.info(`created account(${id})`)
        return createAccount(id, { type: AccountType.USER })
      },
    )
    const vestingAccount = await ctx.store.getOrCreate(
      Account,
      { id: vestingId, relations: { owner: true } },
      (id) => {
        ctx.log.info(`created account(${id})`)
        return createAccount(id, { type: AccountType.VESTING, owner })
      },
    )

    if (
      vestingAccount.type !== AccountType.VESTING ||
      vestingAccount.owner?.id !== owner.id
    ) {
      vestingAccount.type = AccountType.VESTING
      vestingAccount.owner = owner
    }

    ctx.templates.add(
      VESTING_TEMPLATE_KEY,
      normalizeAddress(vestingAddress),
      item.value.block.height,
    )

    const vestingRow = await ctx.store.getOrCreate(Vesting, vestingId, (id) => {
      return new Vesting({
        id,
        beneficiary: createAccountId(beneficiaryAddress),
        createdAt: new Date(item.value.block.timestamp),
      })
    })
    vestingRow.beneficiary = createAccountId(beneficiaryAddress)

    ctx.log.info(
      `created vesting(${vestingAccount.id}) for account(${owner.id}) (${elapsed()}ms)`,
    )
  })
})
