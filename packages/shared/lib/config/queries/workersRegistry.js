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
exports.addWorkersRegistryQuery = exports.WORKER_REGISTRATION_TEMPLATE_KEY = void 0;
const WorkerRegistry = __importStar(require("../../abi/WorkerRegistration"));
const network_1 = require("../network");
exports.WORKER_REGISTRATION_TEMPLATE_KEY = 'worker_registration';
function addWorkersRegistryQuery(builder) {
    builder.addLog(exports.WORKER_REGISTRATION_TEMPLATE_KEY, {
        range: { from: network_1.network.range.from },
        where: {
            topic0: [
                WorkerRegistry.events.WorkerRegistered.topic,
                WorkerRegistry.events.WorkerDeregistered.topic,
                WorkerRegistry.events.WorkerWithdrawn.topic,
                WorkerRegistry.events.MetadataUpdated.topic,
                WorkerRegistry.events.ExcessiveBondReturned.topic,
            ],
        },
    });
}
exports.addWorkersRegistryQuery = addWorkersRegistryQuery;
//# sourceMappingURL=workersRegistry.js.map