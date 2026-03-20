import { run } from '@subsquid/batch-processor'
import { DataSourceBuilder } from '@subsquid/evm-stream'
import { Database, LocalDest } from '@subsquid/file-store'
import { assertNotNull } from '@subsquid/util-internal'

import * as PortalPoolFactory from '../src/abi/PortalPoolFactory'
import { network } from '../src/config/network'

const OUTPUT_FILE = 'portal_pools.json'

const source = new DataSourceBuilder()
  .setPortal(assertNotNull(process.env.PORTAL_ENDPOINT))
  .setBlockRange(network.contracts.PortalPoolFactory.range)
  .setFields({
    log: {
      topics: true,
      data: true,
    },
  })
  .addLog({
    where: {
      address: [network.contracts.PortalPoolFactory.address],
      topic0: [PortalPoolFactory.events.PoolCreated.topic],
    },
  })
  .build()

let pools: string[] = []

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
          pools = addresses
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
        addresses: pools,
      }
      await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2))
    },
  },
})

run(source, db, async (ctx) => {
  ctx.store.setForceFlush(true)

  for (const c of ctx.blocks) {
    for (const i of c.logs) {
      const { portal } = PortalPoolFactory.events.PoolCreated.decode(i)
      pools.push(portal.toLowerCase())
    }
  }
})
