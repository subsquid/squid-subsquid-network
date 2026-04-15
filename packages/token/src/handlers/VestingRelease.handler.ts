import {
  VESTING_TEMPLATE_KEY,
  createAccountId,
  createHandler,
  findTransfer,
  isLog,
  timed,
} from '@sqd/shared'
import * as Vesting from '@sqd/shared/lib/abi/SubsquidVesting'

import { Account, TransferType } from '~/model'
import { saveTransfer } from './Transfer.handler'

export const handleVestingReleased = createHandler((ctx, item) => {
  if (!isLog(item)) return
  if (!Vesting.events.ERC20Released.is(item.value)) return
  if (!ctx.templates.has(VESTING_TEMPLATE_KEY, item.address, item.value.block.height)) return

  const { value: log } = item

  const vestingId = createAccountId(log.address)
  const vestingDeferred = ctx.store.defer(Account, {
    id: vestingId,
    relations: { owner: true },
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
      vestingId: vesting.id,
    })

    ctx.log.info(
      `released vesting(${vesting.id}) to account(${vesting.owner?.id}) (${elapsed()}ms)`,
    )
  })
})
