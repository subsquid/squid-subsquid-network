import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {Database, LocalDest} from '@subsquid/file-store'
import * as VestingFactory from '../src/abi/VestingFactory'

const OUTPUT_FILE='vestings.json'

const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://v2.archive.subsquid.io/network/arbitrum-sepolia',
    })
    .setBlockRange({
        from: 6_000_000,
    })
    .setFields({
        log: {
            topics: true,
            data: true,
        }
    })
    .addLog({
        address: ['0x0eD5FB811167De1928322a0fa30Ed7F3c8C370Ca'],
        topic0: [VestingFactory.events.VestingCreated.topic],
    })

let vestings: string[] = []

type Metadata = {
    height: number
    hash: string
    addresses: string[]
}

let isInit = false

let db = new Database({
    tables: {},
    dest: new LocalDest('./assets'),
    chunkSizeMb: Infinity,
    syncIntervalBlocks: 1,
    hooks: {
        async onStateRead(dest) {
            if (await dest.exists(OUTPUT_FILE)) {
                let {height, hash, addresses}: Metadata = await dest.readFile(OUTPUT_FILE).then(JSON.parse)

                if (!isInit) {
                    vestings = addresses
                    isInit = true
                }

                return {height, hash}
            } else {
                return undefined
            }
        },
        async onStateUpdate(dest, info) {
            let metadata: Metadata = {
                ...info,
                addresses: vestings,
            }
            await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata))
        },
    },
})

processor.run(db, async (ctx) => {
    ctx.store.setForceFlush(true)

    for (let c of ctx.blocks) {
        for (let i of c.logs) {
            let {vesting} = VestingFactory.events.VestingCreated.decode(i)
            vestings.push(vesting)
        }
    }
})
