import {
  type LogItem,
  isLog,
  createHandlerOld,
  timed,
  createWorkerId,
  parseWorkerMetadata,
  WORKER_REGISTRATION_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as WorkerRegistry from '@subsquid-network/shared/lib/abi/WorkerRegistration'

import { Worker } from '~/model'

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
