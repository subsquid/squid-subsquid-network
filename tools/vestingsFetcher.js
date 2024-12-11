"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const evm_processor_1 = require("@subsquid/evm-processor");
const file_store_1 = require("@subsquid/file-store");
const VestingFactory = __importStar(require("../src/abi/VestingFactory"));
const network_1 = require("../src/config/network");
const OUTPUT_FILE = 'vestings.json';
const processor = new evm_processor_1.EvmBatchProcessor()
    .setPortal((0, evm_processor_1.assertNotNull)(process.env.PORTAL_ENDPOINT))
    .setBlockRange({
    from: 6000000,
})
    .setFields({
    log: {
        topics: true,
        data: true,
    },
})
    .addLog({
    address: [network_1.network.contracts.VestingFactory.address],
    topic0: [VestingFactory.events.VestingCreated.topic],
});
let vestings = [];
let isInit = false;
const db = new file_store_1.Database({
    tables: {},
    dest: new file_store_1.LocalDest(`./assets/${network_1.network.name}`),
    chunkSizeMb: Infinity,
    hooks: {
        async onStateRead(dest) {
            if (await dest.exists(OUTPUT_FILE)) {
                const { height, hash, addresses } = await dest
                    .readFile(OUTPUT_FILE)
                    .then(JSON.parse);
                if (!isInit) {
                    vestings = addresses;
                    isInit = true;
                }
                return { height, hash };
            }
            else {
                return undefined;
            }
        },
        async onStateUpdate(dest, info) {
            const metadata = {
                ...info,
                addresses: vestings,
            };
            await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
        },
    },
});
processor.run(db, async (ctx) => {
    ctx.store.setForceFlush(true);
    for (const c of ctx.blocks) {
        for (const i of c.logs) {
            const { vesting } = VestingFactory.events.VestingCreated.decode(i);
            vestings.push(vesting);
        }
    }
});
//# sourceMappingURL=vestingsFetcher.js.map