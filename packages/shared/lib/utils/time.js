"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEndOfInterval = exports.toStartOfInterval = exports.toEndOfDay = exports.toStartOfDay = exports.toStartOfHour = exports.toStartOfMinute = exports.YEAR_MS = exports.DAY_MS = exports.HOUR_MS = exports.MINUTE_MS = exports.SECOND_MS = void 0;
exports.SECOND_MS = 1000;
exports.MINUTE_MS = 60 * exports.SECOND_MS;
exports.HOUR_MS = 60 * exports.MINUTE_MS;
exports.DAY_MS = 24 * exports.HOUR_MS;
exports.YEAR_MS = 365 * exports.DAY_MS;
function toStartOfMinute(timestamp) {
    return Math.floor(timestamp / exports.MINUTE_MS) * exports.MINUTE_MS;
}
exports.toStartOfMinute = toStartOfMinute;
function toStartOfHour(timestamp) {
    return toStartOfInterval(timestamp, exports.HOUR_MS);
}
exports.toStartOfHour = toStartOfHour;
function toStartOfDay(timestamp) {
    return toStartOfInterval(timestamp, exports.DAY_MS);
}
exports.toStartOfDay = toStartOfDay;
function toEndOfDay(timestamp) {
    return toEndOfInterval(timestamp, exports.DAY_MS);
}
exports.toEndOfDay = toEndOfDay;
function toStartOfInterval(timestamp, interval) {
    return Math.floor(timestamp / interval) * interval;
}
exports.toStartOfInterval = toStartOfInterval;
function toEndOfInterval(timestamp, interval) {
    return toStartOfInterval(timestamp + interval, interval) - 1;
}
exports.toEndOfInterval = toEndOfInterval;
//# sourceMappingURL=time.js.map