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
exports.handleVestingCreated = void 0;
const shared_1 = require("@subsquid-network/shared");
const VestingFactory = __importStar(require("@subsquid-network/shared/lib/abi/VestingFactory"));
const model_1 = require("../model");
exports.handleVestingCreated = (0, shared_1.createHandler)((ctx, item) => {
    if (!(0, shared_1.isLog)(item))
        return;
    if (item.address !== shared_1.network.contracts.VestingFactory.address)
        return;
    if (!VestingFactory.events.VestingCreated.is(item.value))
        return;
    const { vesting: vestingAddress, beneficiary: beneficiaryAddress } = VestingFactory.events.VestingCreated.decode(item.value);
    const vestingId = (0, shared_1.createAccountId)(vestingAddress);
    ctx.store.defer(model_1.Vesting, vestingId);
    return (0, shared_1.timed)(ctx, async (elapsed) => {
        const vesting = await ctx.store.getOrCreate(model_1.Vesting, vestingId, (id) => {
            return new model_1.Vesting({
                id,
                beneficiary: (0, shared_1.createAccountId)(beneficiaryAddress),
                createdAt: new Date(item.value.block.timestamp),
            });
        });
        vesting.beneficiary = (0, shared_1.createAccountId)(beneficiaryAddress);
        ctx.templates.add(shared_1.VESTING_TEMPLATE_KEY, (0, shared_1.normalizeAddress)(vestingAddress), item.value.block.height);
        ctx.log.info(`created vesting(${vesting.id}) for ${vesting.beneficiary} (${elapsed()}ms)`);
    });
});
//# sourceMappingURL=VestingCreated.handler.js.map