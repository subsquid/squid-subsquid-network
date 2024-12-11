import { isContract, isLog, LogItem } from '../../item'
import { createHandlerOld } from '../base'
import { createWorkerId } from '../helpers/ids'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import { network } from '~/config/network'
import { Settings, Worker } from '~/model'
import { parseWorkerMetadata } from '~/utils/misc'

export const handleMetadataUpdated = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.MetadataUpdated.is(item.value)
  },
  handle(ctx, { value: log }) {
    const { workerId: workerIndex, metadata: metadataRaw } =
      WorkerRegistry.events.MetadataUpdated.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, workerId)

    return async () => {
      const settings = await ctx.store.getOrFail(Settings, network.name)
      if (log.address !== settings.contracts.workerRegistration) return

      const metadata = parseWorkerMetadata(ctx, metadataRaw)

      const worker = await workerDeferred.getOrFail()
      worker.name = metadata.name
      worker.description = metadata.description
      worker.website = metadata.website
      await ctx.store.upsert(worker)

      ctx.log.info(`updated metadata of worker(${worker.id}) `)
    }
  },
})
