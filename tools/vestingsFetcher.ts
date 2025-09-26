import { assertNotNull, EvmBatchProcessor } from '@subsquid/evm-processor'
import { Database, LocalDest } from '@subsquid/file-store'

import * as VestingFactory from '../src/abi/VestingFactory'
import { network } from '../src/config/network'

const OUTPUT_FILE = 'vestings.json'

const processor = new EvmBatchProcessor()
  .setPortal(assertNotNull(process.env.PORTAL_ENDPOINT))
  .setBlockRange(network.range)
  .setFields({
    log: {
      topics: true,
      data: true,
    },
  })
  .addLog({
    address: [network.contracts.VestingFactory.address],
    topic0: [VestingFactory.events.VestingCreated.topic],
  })

let vestings: string[] = []

type Metadata = {
  height: number
  hash: string
  addresses: string[]
}

let isInit = false

const db = new Database({
  tables: {},
  dest: new LocalDest(`./assets/${network.name}`),
  chunkSizeMb: Infinity,
  hooks: {
    async onStateRead(dest) {
      if (await dest.exists(OUTPUT_FILE)) {
        const { height, hash, addresses }: Metadata = await dest
          .readFile(OUTPUT_FILE)
          .then(JSON.parse)

        if (!isInit) {
          vestings = addresses
          isInit = true
        }

        return { height, hash }
      } else {
        return undefined
      }
    },
    async onStateUpdate(dest, info) {
      const metadata: Metadata = {
        ...info,
        addresses: vestings,
      }
      await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2))
    },
  },
})

processor.run(db, async (ctx) => {
  ctx.store.setForceFlush(true)

  for (const c of ctx.blocks) {
    for (const i of c.logs) {
      const { vesting } = VestingFactory.events.VestingCreated.decode(i)
      vestings.push(vesting)
    }
  }
})
