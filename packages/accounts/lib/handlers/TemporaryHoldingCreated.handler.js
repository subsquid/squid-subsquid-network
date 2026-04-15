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
exports.processTemporaryHoldingUnlockQueue = exports.ensureTemporaryHoldingUnlockQueue = exports.handleTemporaryHoldingCreated = exports.TEMPORARY_HOLDING_UNLOCK_QUEUE = void 0;
const shared_1 = require("@subsquid-network/shared");
const TemporaryHoldingFactory = __importStar(require("@subsquid-network/shared/lib/abi/TemporaryHoldingFactory"));
const model_1 = require("../model");
exports.TEMPORARY_HOLDING_UNLOCK_QUEUE = 'temporary-holding-unlock';
exports.handleTemporaryHoldingCreated = (0, shared_1.createHandler)((ctx, item) => {
    if (!(0, shared_1.isLog)(item))
        return;
    if (item.address !== shared_1.network.contracts.TemporaryHoldingFactory.address)
        return;
    if (!TemporaryHoldingFactory.events.TemporaryHoldingCreated.is(item.value))
        return;
    const { vesting: holdingAddress, beneficiaryAddress, admin: adminAddress, unlockTimestamp, } = TemporaryHoldingFactory.events.TemporaryHoldingCreated.decode(item.value);
    const holdingId = (0, shared_1.createAccountId)(holdingAddress);
    ctx.store.defer(model_1.TemporaryHolding, holdingId);
    return (0, shared_1.timed)(ctx, async (elapsed) => {
        const holding = await ctx.store.getOrCreate(model_1.TemporaryHolding, holdingId, (id) => {
            return new model_1.TemporaryHolding({
                id,
                beneficiary: (0, shared_1.createAccountId)(beneficiaryAddress),
                admin: (0, shared_1.createAccountId)(adminAddress),
                unlockedAt: new Date(Number(unlockTimestamp) * 1000),
                locked: true,
            });
        });
        ctx.log.info(`created temporary_holding(${holding.id}) for ${holding.beneficiary} (${elapsed()}ms)`);
        await addToTemporaryHoldingUnlockQueue(ctx, holding.id);
    });
});
async function addToTemporaryHoldingUnlockQueue(ctx, id) {
    const queue = await ctx.store.getOrFail((model_1.Queue), exports.TEMPORARY_HOLDING_UNLOCK_QUEUE);
    if (queue.tasks.some((task) => task.id === id))
        return;
    queue.tasks = [...queue.tasks, { id }];
}
async function ensureTemporaryHoldingUnlockQueue(ctx) {
    const queue = await ctx.store.getOrCreate((model_1.Queue), exports.TEMPORARY_HOLDING_UNLOCK_QUEUE, (id) => new model_1.Queue({ id, tasks: [] }));
    for (const task of queue.tasks) {
        ctx.store.defer(model_1.TemporaryHolding, task.id);
    }
}
exports.ensureTemporaryHoldingUnlockQueue = ensureTemporaryHoldingUnlockQueue;
async function processTemporaryHoldingUnlockQueue(ctx, block) {
    const queue = await ctx.store.getOrFail((model_1.Queue), exports.TEMPORARY_HOLDING_UNLOCK_QUEUE);
    if (queue.tasks.length === 0)
        return;
    const start = performance.now();
    const total = queue.tasks.length;
    let processed = 0;
    const tasks = [];
    for (const task of queue.tasks) {
        const holding = await ctx.store.getOrFail(model_1.TemporaryHolding, task.id);
        if (holding.unlockedAt.getTime() > block.timestamp) {
            tasks.push(task);
            continue;
        }
        holding.locked = false;
        processed++;
        ctx.log.info(`temporary_holding(${holding.id}) unlocked`);
    }
    queue.tasks = tasks;
    if (processed > 0) {
        ctx.log.info(`temporary-holding-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`);
    }
}
exports.processTemporaryHoldingUnlockQueue = processTemporaryHoldingUnlockQueue;
//# sourceMappingURL=TemporaryHoldingCreated.handler.js.map