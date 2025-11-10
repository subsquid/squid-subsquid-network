import { isLog } from '../../item'
import { createHandler } from '../base'
import { createAccountId } from '../helpers/ids'

import * as Vesting from '~/abi/SubsquidVesting'
import { Account, TransferType } from '~/model'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleVestingReleased = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Vesting.events.ERC20Released.is(item.value)) return

  const { value: log } = item

  const vestingDeferred = ctx.store.defer(Account, {
    id: createAccountId(log.address),
    relations: {
      owner: true,
    },
  })

  return async () => {
    const vesting = await vestingDeferred.get()
    if (!vesting) return // not our vesting

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: vesting.id,
      to: vesting.owner?.id,
      logIndex: log.logIndex + 1
    })
    if (!transfer) return

    await saveTransfer(ctx, transfer, {
      type: TransferType.RELEASE,
      vesting,
    })

    ctx.log.info(`released vesting(${vesting.id}) to account(${vesting.owner?.id})`)
  }
})
