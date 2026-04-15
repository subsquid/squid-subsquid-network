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
exports.handleVestingTransferred = void 0;
const shared_1 = require("@subsquid-network/shared");
const SubsquidVesting = __importStar(require("@subsquid-network/shared/lib/abi/SubsquidVesting"));
const model_1 = require("../model");
exports.handleVestingTransferred = (0, shared_1.createHandler)((ctx, item) => {
    if (!(0, shared_1.isLog)(item))
        return;
    if (!SubsquidVesting.events.OwnershipTransferred.is(item.value))
        return;
    if (item.value.topics.length !== 3)
        return;
    if (!ctx.templates.has(shared_1.VESTING_TEMPLATE_KEY, item.address, item.value.block.height))
        return;
    const { newOwner } = SubsquidVesting.events.OwnershipTransferred.decode(item.value);
    const vestingId = (0, shared_1.createAccountId)(item.address);
    ctx.store.defer(model_1.Vesting, vestingId);
    return (0, shared_1.timed)(ctx, async (elapsed) => {
        const vesting = await ctx.store.get(model_1.Vesting, vestingId);
        if (!vesting)
            return;
        vesting.beneficiary = (0, shared_1.createAccountId)(newOwner);
        ctx.log.info(`transferred vesting(${vesting.id}) to ${vesting.beneficiary} (${elapsed()}ms)`);
    });
});
//# sourceMappingURL=VestingTransferred.handler.js.map