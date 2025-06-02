import { isLog } from '../../item'
import { createHandler } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId } from '../helpers/ids'

import * as TemporaryHoldingFactory from '~/abi/TemporaryHoldingFactory'
import { network } from '~/config/network'
import { Account, AccountType } from '~/model'

export const handleTemporaryHoldingCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.TemporaryHoldingFactory.address) return
  if (!TemporaryHoldingFactory.events.TemporaryHoldingCreated.is(item.value)) return

  const { vesting: vestingAddress, beneficiaryAddress } =
    TemporaryHoldingFactory.events.TemporaryHoldingCreated.decode(item.value)

  const ownerDeferred = ctx.store.defer(Account, createAccountId(beneficiaryAddress))
  const vestingDeferred = ctx.store.defer(Account, {
    id: createAccountId(vestingAddress),
    relations: { owner: true },
  })

  return async () => {
    const owner = await ownerDeferred.getOrInsert((id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.USER })
    })
    const vesting = await vestingDeferred.getOrInsert((id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.TEMPORARY_HOLDING, owner })
    })

    if (vesting.type !== AccountType.TEMPORARY_HOLDING || vesting.owner?.id !== owner.id) {
      vesting.type = AccountType.TEMPORARY_HOLDING
      vesting.owner = owner

      await ctx.store.upsert(vesting)
    }

    ctx.log.info(`created temporary_holding(${vesting.id}) for account(${owner.id})`)
  }
})
