import { isLog } from '../../item'
import { createHandler, timed } from '../base'
import { createAccountId } from '../helpers/ids'

import * as Vesting from '~/abi/SubsquidVesting'
import { VESTING_TEMPLATE_KEY } from '~/config/queries/vestings'
import { Account, TransferType } from '~/model'
import { findTransfer } from '../helpers/misc'
import { saveTransfer } from '../token/Transfer.handler'

export const handleVestingReleased = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Vesting.events.ERC20Released.is(item.value)) return
  if (!ctx.templates.has(VESTING_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const { value: log } = item

  const vestingDeferred = ctx.store.defer(Account, {
    id: createAccountId(log.address),
    relations: {
      owner: true,
    },
  })

  return timed(ctx, async (elapsed) => {
    const vesting = await vestingDeferred.getOrFail()

    const transfer = findTransfer(log.transaction?.logs ?? [], {
      from: vesting.id,
      to: vesting.owner?.id,
      logIndex: log.logIndex + 1,
    })
    if (!transfer) return

    await saveTransfer(ctx, transfer, {
      type: TransferType.RELEASE,
      vesting,
    })

    ctx.log.info(
      `released vesting(${vesting.id}) to account(${vesting.owner?.id}) (${elapsed()}ms)`,
    )
  })
})
