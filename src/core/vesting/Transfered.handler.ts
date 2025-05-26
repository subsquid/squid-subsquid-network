import { isLog, LogItem } from '../../item'
import { createHandlerOld } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId } from '../helpers/ids'

import * as Vesting from '~/abi/SubsquidVesting'
import { Account, AccountType, Delegation, Worker } from '~/model'

export const handleVestingTransfered = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isLog(item) &&
      Vesting.events.OwnershipTransferred.is(item.value) &&
      item.value.topics.length === 3
    )
  },
  handle(ctx, { value: log }) {
    const { newOwner } = Vesting.events.OwnershipTransferred.decode(log)

    const ownerDeferred = ctx.store.defer(Account, createAccountId(newOwner))
    const vestingDeferred = ctx.store.defer(Account, {
      id: createAccountId(log.address),
    })

    return async () => {
      const vesting = await vestingDeferred.get()
      if (!vesting) return // not our vesting

      const owner = await ownerDeferred.getOrInsert((id) => {
        ctx.log.info(`created account(${id})`)
        return createAccount(id, { type: AccountType.USER })
      })

      vesting.owner = owner

      await ctx.store.upsert(vesting)

      const workers = await ctx.store.findBy(Worker, { owner: { id: vesting.id } }, false)
      for (const worker of workers) {
        worker.realOwner = owner
      }
      await ctx.store.upsert(workers)

      const delegations = await ctx.store.findBy(Delegation, { owner: { id: vesting.id } }, false)
      for (const delegation of delegations) {
        delegation.realOwner = owner
      }
      await ctx.store.upsert(delegations)

      ctx.log.info(`transferred vesting(${vesting.id}) to account(${owner.id})`)
    }
  },
})
