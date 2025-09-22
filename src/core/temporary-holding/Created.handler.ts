import { isLog } from '../../item'
import { createHandler } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId } from '../helpers/ids'

import * as TemporaryHoldingFactory from '~/abi/TemporaryHoldingFactory'
import { network } from '~/config/network'
import { Account, AccountType, TemporaryHoldingData } from '~/model'
import { addToTemporaryHoldingUnlockQueue } from './CheckTempHoldingUnlock.listener'

export const handleTemporaryHoldingCreated = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (item.address !== network.contracts.TemporaryHoldingFactory.address) return
  if (!TemporaryHoldingFactory.events.TemporaryHoldingCreated.is(item.value)) return

  const {
    vesting: vestingAddress,
    beneficiaryAddress,
    admin: adminAddress,
    unlockTimestamp,
  } = TemporaryHoldingFactory.events.TemporaryHoldingCreated.decode(item.value)

  const ownerDeferred = ctx.store.defer(Account, createAccountId(beneficiaryAddress))
  const vestingDeferred = ctx.store.defer(Account, {
    id: createAccountId(vestingAddress),
    relations: { owner: true },
  })
  const adminDeferred = ctx.store.defer(Account, createAccountId(adminAddress))

  return async () => {
    const beneficiary = await ownerDeferred.getOrInsert((id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.USER })
    })
    const vesting = await vestingDeferred.getOrInsert((id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.TEMPORARY_HOLDING, owner: beneficiary })
    })
    const admin = await adminDeferred.getOrInsert((id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.USER })
    })

    if (vesting.type !== AccountType.TEMPORARY_HOLDING || vesting.owner?.id !== beneficiary.id) {
      vesting.type = AccountType.TEMPORARY_HOLDING
      vesting.owner = beneficiary

      await ctx.store.upsert(vesting)
    }

    await ctx.store.insert(
      new TemporaryHoldingData({
        id: vesting.id,
        account: vesting,
        beneficiary,
        admin,
        unlockedAt: new Date(Number(unlockTimestamp) * 1000),
        locked: true,
      }),
    )

    ctx.log.info(`created temporary_holding(${vesting.id}) for account(${beneficiary.id})`)

    await addToTemporaryHoldingUnlockQueue(ctx, vesting.id)
  }
})
