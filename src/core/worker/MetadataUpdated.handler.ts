import { LogItem, isLog } from '../../item'
import { createHandlerOld, timed } from '../base'
import { createWorkerId } from '../helpers/ids'

import * as WorkerRegistry from '~/abi/WorkerRegistration'
import { network } from '~/config/network'
import { WORKER_REGISTRATION_TEMPLATE_KEY } from '~/config/queries/workersRegistry'
import { Settings, Worker } from '~/model'
import { parseWorkerMetadata } from '~/utils/misc'

export const handleMetadataUpdated = createHandlerOld({
  filter(_, item): item is LogItem {
    return isLog(item) && WorkerRegistry.events.MetadataUpdated.is(item.value)
  },
  handle(ctx, { value: log }) {
    if (!ctx.templates.has(WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return

    const { workerId: workerIndex, metadata: metadataRaw } =
      WorkerRegistry.events.MetadataUpdated.decode(log)

    const workerId = createWorkerId(workerIndex)
    const workerDeferred = ctx.store.defer(Worker, workerId)

    return timed(ctx, async (elapsed) => {
      const metadata = parseWorkerMetadata(ctx, metadataRaw)

      const worker = await workerDeferred.getOrFail()
      worker.name = metadata.name
      worker.description = metadata.description
      worker.website = metadata.website

      ctx.log.info(`updated metadata of worker(${worker.id}) (${elapsed()}ms)`)
    })
  },
})
