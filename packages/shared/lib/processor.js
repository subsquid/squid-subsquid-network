"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseBuilder = exports.DataSourceBuilder = void 0;
const evm_stream_1 = require("@subsquid/evm-stream");
Object.defineProperty(exports, "DataSourceBuilder", { enumerable: true, get: function () { return evm_stream_1.DataSourceBuilder; } });
const util_internal_1 = require("@subsquid/util-internal");
const network_1 = require("./config/network");
function createBaseBuilder() {
    const builder = new evm_stream_1.DataSourceBuilder()
        .setFields({
        block: {
            timestamp: true,
            l1BlockNumber: true,
        },
        log: {
            address: true,
            topics: true,
            data: true,
            transactionHash: true,
        },
    })
        .includeAllBlocks()
        .setBlockRange(network_1.network.range);
    if (process.env.PORTAL_ENDPOINT) {
        builder.setPortal({
            url: (0, util_internal_1.assertNotNull)(process.env.PORTAL_ENDPOINT),
            minBytes: 40 * 1024 * 1024,
        });
    }
    return builder;
}
exports.createBaseBuilder = createBaseBuilder;
//# sourceMappingURL=processor.js.map