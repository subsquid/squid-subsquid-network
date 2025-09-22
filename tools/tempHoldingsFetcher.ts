import { assertNotNull, EvmBatchProcessor } from '@subsquid/evm-processor'
import { Database, LocalDest } from '@subsquid/file-store'

import * as TemporaryHoldingFactory from '../src/abi/TemporaryHoldingFactory'
import { network } from '../src/config/network'

const OUTPUT_FILE = 'temp_holdings.json'

const processor = new EvmBatchProcessor()
  .setPortal(assertNotNull(process.env.PORTAL_ENDPOINT))
  .setBlockRange({
    from: 6_000_000,
  })
  .setFields({
    log: {
      topics: true,
      data: true,
    },
  })
  .addLog({
    address: [network.contracts.TemporaryHoldingFactory.address],
    topic0: [TemporaryHoldingFactory.events.TemporaryHoldingCreated.topic],
  })

let vestings: TemporaryHoldingData[] = []

type TemporaryHoldingData = {
  address: string
  beneficiary: string
  admin: string
  unlockTimestamp: number
}

type Metadata = {
  height: number
  hash: string
  data: TemporaryHoldingData[]
}

let isInit = false

const db = new Database({
  tables: {},
  dest: new LocalDest(`./assets/${network.name}`),
  chunkSizeMb: Infinity,
  hooks: {
    async onStateRead(dest) {
      if (await dest.exists(OUTPUT_FILE)) {
        const { height, hash, data }: Metadata = await dest.readFile(OUTPUT_FILE).then(JSON.parse)

        if (!isInit) {
          vestings = data
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
        data: vestings,
      }
      await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2))
    },
  },
})

processor.run(db, async (ctx) => {
  ctx.store.setForceFlush(true)

  for (const c of ctx.blocks) {
    for (const i of c.logs) {
      const { vesting, beneficiaryAddress, admin, unlockTimestamp } =
        TemporaryHoldingFactory.events.TemporaryHoldingCreated.decode(i)
      vestings.push({
        address: vesting,
        beneficiary: beneficiaryAddress,
        admin: admin,
        unlockTimestamp: Number(unlockTimestamp) * 1000,
      })
    }
  }
})
