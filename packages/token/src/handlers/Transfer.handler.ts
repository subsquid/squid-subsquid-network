import {
  type LogItem,
  isContract,
  isLog,
  createHandlerOld,
  timed,
  createAccountId,
  toHumanSQD,
  network,
  type MappingContext,
  type Log,
} from '@subsquid-network/shared'
import * as SQD from '@subsquid-network/shared/lib/abi/SQD'

import {
  Account,
  AccountTransfer,
  AccountType,
  Transfer,
  TransferDirection,
  TransferType,
} from '~/model'

export const handleTransfer = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.SQD) && isLog(item) && SQD.events.Transfer.is(item.value)
    )
  },
  handle(ctx, { value: log }) {
    const event = SQD.events.Transfer.decode(log)

    const fromId = createAccountId(event.from)
    ctx.store.defer(Account, fromId)

    const toId = createAccountId(event.to)
    ctx.store.defer(Account, toId)

    ctx.store.defer(Transfer, { id: log.id, relations: { from: true, to: true } })

    return timed(ctx, async (elapsed) => {
      const transfer = await saveTransfer(ctx, { log, event })
      if (!transfer) return

      const { from, to } = transfer

      if (from.id !== to.id) {
        from.balance -= event.value
        to.balance += event.value
      }

      await ctx.store.track([
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
        `account(${transfer.from.id}) transferred ${toHumanSQD(transfer.amount)} to account(${transfer.to.id}) (${elapsed()}ms)`,
      )
    })
  },
})

function createAccount(id: string, opts?: { owner?: Account; type?: AccountType }) {
  return new Account({
    id,
    balance: 0n,
    claimableDelegationCount: 0,
    type: AccountType.USER,
    ...opts,
  })
}

export async function saveTransfer(
  ctx: MappingContext,
  { log, event }: { log: Log; event: SQD.TransferEventArgs },
  extra?: {
    type?: TransferType
    workerId?: string
    delegationId?: string
    gatewayStakeId?: string
    vestingId?: string
    portalPoolId?: string
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
    Object.assign(transfer, extra)
  } else {
    const from = await ctx.store.getOrCreate(Account, event.from, (id) => {
      ctx.log.info(`created account(${id})`)
      return createAccount(id, { type: AccountType.USER })
    })
    const to = await ctx.store.getOrCreate(Account, event.to, (id) => {
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

    await ctx.store.track(transfer)
  }

  return transfer
}
