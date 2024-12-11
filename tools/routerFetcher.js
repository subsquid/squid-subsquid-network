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
const Router = __importStar(require("../src/abi/Router"));
const network_1 = require("../src/config/network");
const router_1 = require("~/config/queries/router");
const OUTPUT_FILE = 'router.json';
const processor = new evm_processor_1.EvmBatchProcessor()
    .setPortal((0, evm_processor_1.assertNotNull)(process.env.PORTAL_ENDPOINT))
    .setBlockRange({
    from: network_1.network.contracts.Router.range.from,
})
    .setFields({
    log: {
        topics: true,
        data: true,
    },
});
(0, router_1.addRouterQuery)(processor);
let networkController, rewardCalculation, rewardTreasury, workerRegistration, staking;
let isInit = false;
const db = new file_store_1.Database({
    tables: {},
    dest: new file_store_1.LocalDest(`./assets/${network_1.network.name}`),
    chunkSizeMb: Infinity,
    hooks: {
        async onStateRead(dest) {
            if (await dest.exists(OUTPUT_FILE)) {
                const { height, hash, ...metadata } = await dest
                    .readFile(OUTPUT_FILE)
                    .then(JSON.parse);
                if (!isInit) {
                    networkController = metadata.networkController || [
                        {
                            address: network_1.network.defaultRouterContracts.networkController,
                            range: { from: network_1.network.contracts.Router.range.from },
                        },
                    ];
                    rewardCalculation = metadata.rewardCalculation || [
                        {
                            address: network_1.network.defaultRouterContracts.rewardCalculation,
                            range: { from: network_1.network.contracts.Router.range.from },
                        },
                    ];
                    rewardTreasury = metadata.rewardTreasury || [
                        {
                            address: network_1.network.defaultRouterContracts.rewardTreasury,
                            range: { from: network_1.network.contracts.Router.range.from },
                        },
                    ];
                    workerRegistration = metadata.workerRegistration || [
                        {
                            address: network_1.network.defaultRouterContracts.workerRegistration,
                            range: { from: network_1.network.contracts.Router.range.from },
                        },
                    ];
                    staking = metadata.staking || [
                        {
                            address: network_1.network.defaultRouterContracts.staking,
                            range: { from: network_1.network.contracts.Router.range.from },
                        },
                    ];
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
                networkController,
                rewardCalculation,
                rewardTreasury,
                workerRegistration,
                staking,
            };
            await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
        },
    },
});
processor.run(db, async (ctx) => {
    ctx.store.setForceFlush(true);
    for (const c of ctx.blocks) {
        for (const i of c.logs) {
            switch (i.topics[0]) {
                case Router.events.NetworkControllerSet.topic:
                    {
                        const event = Router.events.NetworkControllerSet.decode(i);
                        if (networkController.length > 0) {
                            networkController[networkController.length - 1].range.to = i.block.height - 1;
                        }
                        networkController.push({
                            address: event.networkController,
                            range: { from: i.block.height },
                        });
                    }
                    break;
                case Router.events.RewardCalculationSet.topic:
                    {
                        const event = Router.events.RewardCalculationSet.decode(i);
                        if (rewardCalculation.length > 0) {
                            rewardCalculation[rewardCalculation.length - 1].range.to = i.block.height - 1;
                        }
                        rewardCalculation.push({
                            address: event.rewardCalculation,
                            range: { from: i.block.height },
                        });
                    }
                    break;
                case Router.events.RewardTreasurySet.topic:
                    {
                        const event = Router.events.RewardTreasurySet.decode(i);
                        if (rewardTreasury.length > 0) {
                            rewardTreasury[rewardTreasury.length - 1].range.to = i.block.height - 1;
                        }
                        rewardTreasury.push({
                            address: event.rewardTreasury,
                            range: { from: i.block.height },
                        });
                    }
                    break;
                case Router.events.WorkerRegistrationSet.topic:
                    {
                        const event = Router.events.WorkerRegistrationSet.decode(i);
                        if (workerRegistration.length > 0) {
                            workerRegistration[workerRegistration.length - 1].range.to = i.block.height - 1;
                        }
                        workerRegistration.push({
                            address: event.workerRegistration,
                            range: { from: i.block.height },
                        });
                    }
                    break;
                case Router.events.StakingSet.topic: {
                    const event = Router.events.StakingSet.decode(i);
                    if (staking.length > 0) {
                        staking[staking.length - 1].range.to = i.block.height - 1;
                    }
                    staking.push({
                        address: event.staking,
                        range: { from: i.block.height },
                    });
                }
            }
        }
    }
});
//# sourceMappingURL=routerFetcher.js.map