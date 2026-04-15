"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timed = exports.createHandler = exports.createHandlerOld = void 0;
function createHandlerOld({ filter, handle, }) {
    return (ctx, item) => {
        if (!filter || filter(ctx, item))
            return handle(ctx, item);
    };
}
exports.createHandlerOld = createHandlerOld;
function createHandler(fn) {
    return fn;
}
exports.createHandler = createHandler;
function timed(ctx, fn) {
    return async () => {
        const start = performance.now();
        await fn(() => Math.round((performance.now() - start) * 100) / 100);
    };
}
exports.timed = timed;
//# sourceMappingURL=base.js.map