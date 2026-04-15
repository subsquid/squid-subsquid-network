"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const rpc_client_1 = require("@subsquid/rpc-client");
const util_internal_1 = require("@subsquid/util-internal");
exports.client = new rpc_client_1.RpcClient({
    url: (0, util_internal_1.assertNotNull)(process.env.RPC_ENDPOINT),
});
//# sourceMappingURL=rpc-client.js.map