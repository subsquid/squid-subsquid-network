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
exports.addVestingsQuery = exports.VESTING_TEMPLATE_KEY = void 0;
const Vesting = __importStar(require("../../abi/SubsquidVesting"));
const VestingFactory = __importStar(require("../../abi/VestingFactory"));
const network_1 = require("../network");
exports.VESTING_TEMPLATE_KEY = 'vesting';
function addVestingsQuery(builder) {
    builder.addLog({
        range: network_1.network.contracts.VestingFactory.range,
        where: {
            address: [network_1.network.contracts.VestingFactory.address],
            topic0: [VestingFactory.events.VestingCreated.topic],
        },
    });
    if (network_1.network.name === 'tethys') {
        builder.addLog(exports.VESTING_TEMPLATE_KEY, {
            range: { from: network_1.network.range.from },
            where: { topic0: [Vesting.events.OwnershipTransferred.topic] },
        });
    }
    builder.addLog(exports.VESTING_TEMPLATE_KEY, {
        range: { from: network_1.network.range.from },
        where: { topic0: [Vesting.events.ERC20Released.topic] },
    });
}
exports.addVestingsQuery = addVestingsQuery;
//# sourceMappingURL=vestings.js.map