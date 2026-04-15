"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_store_1 = require("@belopash/typeorm-store");
const batch_processor_1 = require("@subsquid/batch-processor");
const evm_objects_1 = require("@subsquid/evm-objects");
const logger_1 = require("@subsquid/logger");
const shared_1 = require("@subsquid-network/shared");
const processor_1 = require("./config/processor");
const handlers_1 = require("./handlers");
const logger = (0, logger_1.createLogger)('sqd:accounts');
(0, batch_processor_1.run)(processor_1.processor, new typeorm_store_1.TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
    const batchSw = (0, shared_1.stopwatch)();
    const ctx = {
        ..._ctx,
        blocks: _ctx.blocks.map(evm_objects_1.augmentBlock),
        log: logger,
    };
    const firstBlock = ctx.blocks[0].header;
    const lastBlock = (0, shared_1.last)(ctx.blocks).header;
    const tasks = [];
    tasks.push(async () => {
        await (0, handlers_1.ensureTemporaryHoldingUnlockQueue)(ctx);
    });
    let handlerTaskCount = 0;
    for (const block of ctx.blocks) {
        const items = (0, shared_1.sortItems)(block);
        tasks.push(async () => {
            await (0, handlers_1.processTemporaryHoldingUnlockQueue)(ctx, block.header);
        });
        for (const item of items) {
            for (const handler of handlers_1.handlers) {
                const task = handler(ctx, item);
                if (task) {
                    tasks.push(task);
                    handlerTaskCount++;
                }
            }
        }
    }
    const prepTime = batchSw.get();
    for (const task of tasks) {
        await task();
    }
    const execTime = batchSw.get();
    ctx.log.info(`batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`);
});
//# sourceMappingURL=main.js.map