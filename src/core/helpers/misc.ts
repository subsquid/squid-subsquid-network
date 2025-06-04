import { network } from '~/config/network'
import { Log } from '~/config/processor'

import * as SQD from '~/abi/SQD'

export function findTransfer(logs: Log[], filter: { from?: string; to?: string; amount?: bigint }) {
  for (const log of logs) {
    if (log.address !== network.contracts.SQD.address) continue
    if (!SQD.events.Transfer.is(log)) continue

    const event = SQD.events.Transfer.decode(log)
    if (filter.from != null && event.from !== filter.from) continue
    if (filter.to != null && event.to !== filter.to) continue
    if (filter.amount != null && event.value !== filter.amount) continue

    return { log, event }
  }
}
