import { Context } from 'node:vm'
import { isContract, isLog, LogItem } from '../../item'
import { createHandlerOld } from '../base'
import { createAccount } from '../helpers/entities'
import { createAccountId } from '../helpers/ids'

import * as SQD from '~/abi/SQD'
import { network } from '~/config/network'
import {
  Account,
  Transfer,
  AccountTransfer,
  TransferDirection,
  AccountType,
  TransferType,
  Worker,
  Delegation,
  GatewayStake,
} from '~/model'
import { toHumanSQD } from '~/utils/misc'
import { Log } from '~/config/processor'
import { MappingContext } from 'src/types'

export const handleTransfer = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.SQD) && isLog(item) && SQD.events.Transfer.is(item.value)
    )
  },
  handle(ctx, { value: log }) {
    const event = SQD.events.Transfer.decode(log)

    const fromId = createAccountId(event.from)
    const from = ctx.store.defer(Account, fromId)

    const toId = createAccountId(event.to)
    const to = ctx.store.defer(Account, toId)

    ctx.store.defer(Transfer, { id: log.id, relations: { from: true, to: true } })

    return async () => {
      const transfer = await saveTransfer(ctx, { log, event })
      if (!transfer) return

      const { from, to } = transfer

      if (from.id !== to.id) {
        from.balance -= event.value
        to.balance += event.value

        await ctx.store.upsert([from, to])
      }

      await ctx.store.insert([
        new AccountTransfer({
          id: `${transfer.id}-from`,
          direction: TransferDirection.FROM,
          account: transfer.from,
          transfer,
          balance: from.balance,
        }),
        new AccountTransfer({
          id: `${transfer.id}-to`,
          direction: TransferDirection.TO,
          account: transfer.to,
          transfer,
          balance: to.balance,
        }),
      ])

      ctx.log.info(
        `account(${transfer.from.id}) transferred ${toHumanSQD(transfer.amount)} to account(${transfer.to.id})`,
      )
    }
  },
})

export async function saveTransfer(
  ctx: MappingContext,
  { log, event }: { log: Log; event: SQD.TransferEventArgs },
  extra?: {
    type?: TransferType
    worker?: Worker
    delegation?: Delegation
    gatewayStake?: GatewayStake
    vesting?: Account
  },
) {
  if (event.value === 0n) {
    return
  }

  let transfer = await ctx.store.get(Transfer, { id: log.id, relations: { from: true, to: true } })
  if (!extra && transfer) {
    return transfer
  }

  if (transfer) {
    transfer = new Transfer({
      ...transfer,
      ...extra,
    })

    await ctx.store.upsert(transfer)
  } else {
    const from = await ctx.store.getOrInsert(Account, event.from, (id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.USER })
    })
    const to = await ctx.store.getOrInsert(Account, event.to, (id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.USER })
    })

    transfer = new Transfer({
      id: log.id,
      from,
      to,
      blockNumber: log.block.height,
      amount: event.value,
      timestamp: new Date(log.block.timestamp),
      txHash: log.transactionHash,
      type: TransferType.TRANSFER,
      ...extra,
    })

    await ctx.store.insert(transfer)
  }

  return transfer
}
