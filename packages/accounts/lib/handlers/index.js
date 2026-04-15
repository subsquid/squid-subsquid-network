"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlers = exports.processTemporaryHoldingUnlockQueue = exports.ensureTemporaryHoldingUnlockQueue = void 0;
const VestingCreated_handler_1 = require("./VestingCreated.handler");
const VestingTransferred_handler_1 = require("./VestingTransferred.handler");
const TemporaryHoldingCreated_handler_1 = require("./TemporaryHoldingCreated.handler");
var TemporaryHoldingCreated_handler_2 = require("./TemporaryHoldingCreated.handler");
Object.defineProperty(exports, "ensureTemporaryHoldingUnlockQueue", { enumerable: true, get: function () { return TemporaryHoldingCreated_handler_2.ensureTemporaryHoldingUnlockQueue; } });
Object.defineProperty(exports, "processTemporaryHoldingUnlockQueue", { enumerable: true, get: function () { return TemporaryHoldingCreated_handler_2.processTemporaryHoldingUnlockQueue; } });
exports.handlers = [
    VestingCreated_handler_1.handleVestingCreated,
    VestingTransferred_handler_1.handleVestingTransferred,
    TemporaryHoldingCreated_handler_1.handleTemporaryHoldingCreated,
];
//# sourceMappingURL=index.js.map