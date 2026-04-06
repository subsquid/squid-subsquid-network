import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId } from '../helpers/ids'

import * as Vesting from '~/abi/SubsquidVesting'
import { VESTING_TEMPLATE_KEY } from '~/config/queries/vestings'
import { Account, AccountType, Delegation, Worker } from '~/model'

export const handleVestingTransfered = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Vesting.events.OwnershipTransferred.is(item.value)) return
  if (item.value.topics.length !== 3) return
  if (!ctx.templates.has(VESTING_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const { newOwner } = Vesting.events.OwnershipTransferred.decode(item.value)

  const ownerDeferred = ctx.store.defer(Account, createAccountId(newOwner))
  const vestingDeferred = ctx.store.defer(Account, {
    id: createAccountId(item.address),
  })

  return timed(ctx, async (elapsed) => {
    const vesting = await vestingDeferred.get()
    if (!vesting) return

    const owner = await ownerDeferred.getOrCreate((id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.USER })
    })

    vesting.owner = owner

    const workers = await ctx.store.find(Worker, {
      where: { owner: { id: vesting.id } },
    })
    for (const worker of workers) {
      worker.realOwner = owner
    }

    const delegations = await ctx.store.find(Delegation, {
      where: { worker: { owner: { id: vesting.id } } },
    })
    for (const delegation of delegations) {
      delegation.realOwner = owner
    }

    ctx.log.info(`transferred vesting(${vesting.id}) to account(${owner.id}) (${elapsed()}ms)`)
  })
})
