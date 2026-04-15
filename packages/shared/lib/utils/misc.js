"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopwatch = exports.last = exports.toHumanSQD = exports.joinUrl = exports.toEpochStart = exports.toNextEpochStart = exports.normalizeAddress = exports.toPercent = exports.parseGatewayMetadata = exports.parseWorkerMetadata = exports.parsePeerId = void 0;
const big_decimal_1 = require("@subsquid/big-decimal");
const bs58_1 = __importDefault(require("bs58"));
function parsePeerId(peerId) {
    return bs58_1.default.encode(Buffer.from(peerId.slice(2), 'hex'));
}
exports.parsePeerId = parsePeerId;
function parseWorkerMetadata(ctx, rawMetadata) {
    const metadata = {
        name: null,
        website: null,
        description: null,
        email: null,
    };
    try {
        const parsed = JSON.parse(rawMetadata);
        for (const prop in metadata) {
            if (parsed[prop]) {
                metadata[prop] = parsed[prop];
            }
        }
        metadata.email = null;
        return metadata;
    }
    catch (e) {
        ctx.log.warn(`unable to parse worker metadata "${rawMetadata}": ${e}`);
        return metadata;
    }
}
exports.parseWorkerMetadata = parseWorkerMetadata;
function parseGatewayMetadata(ctx, rawMetadata) {
    const metadata = {
        name: null,
        website: null,
        description: null,
        email: null,
        endpointUrl: null,
    };
    try {
        const parsed = JSON.parse(rawMetadata);
        for (const prop in metadata) {
            if (parsed[prop]) {
                metadata[prop] = parsed[prop];
            }
        }
        return metadata;
    }
    catch (e) {
        ctx.log.warn(`unable to parse gateway metadata "${rawMetadata}": ${e}`);
        return metadata;
    }
}
exports.parseGatewayMetadata = parseGatewayMetadata;
function toPercent(value, overflow) {
    const p = value * 100;
    return overflow ? p : Math.min(p, 100);
}
exports.toPercent = toPercent;
function normalizeAddress(address) {
    return address.toLowerCase();
}
exports.normalizeAddress = normalizeAddress;
function toNextEpochStart(block, length) {
    return toEpochStart(block, length) + length;
}
exports.toNextEpochStart = toNextEpochStart;
function toEpochStart(block, length) {
    return Math.floor(block / length) * length;
}
exports.toEpochStart = toEpochStart;
function joinUrl(...args) {
    const resultArray = [];
    if (args.length === 0) {
        return '';
    }
    if (typeof args[0] !== 'string') {
        throw new TypeError('Url must be a string. Received ' + args[0]);
    }
    if (args[0].match(/^[^/:]+:\/*$/) && args.length > 1) {
        const first = args.shift();
        args[0] = first + args[0];
    }
    if (args[0].match(/^file:\/\/\//)) {
        args[0] = args[0].replace(/^([^/:]+):\/*/, '$1:///');
    }
    else {
        args[0] = args[0].replace(/^([^/:]+):\/*/, '$1://');
    }
    for (let i = 0; i < args.length; i++) {
        let component = args[i];
        if (typeof component !== 'string') {
            throw new TypeError('Url must be a string. Received ' + component);
        }
        if (component === '') {
            continue;
        }
        if (i > 0) {
            component = component.replace(/^[\/]+/, '');
        }
        if (i < args.length - 1) {
            component = component.replace(/[\/]+$/, '');
        }
        else {
            component = component.replace(/[\/]+$/, '/');
        }
        resultArray.push(component);
    }
    let str = resultArray.join('/');
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
    const parts = str.split('?');
    str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');
    return str;
}
exports.joinUrl = joinUrl;
function toHumanSQD(value) {
    return (0, big_decimal_1.BigDecimal)(value, 18).toFixed(18) + ' SQD';
}
exports.toHumanSQD = toHumanSQD;
function last(array) {
    return array[array.length - 1];
}
exports.last = last;
function stopwatch() {
    let start = process.hrtime.bigint();
    return {
        get: () => {
            const t = process.hrtime.bigint();
            const res = (t - start) / 1000000n;
            start = t;
            return res;
        },
    };
}
exports.stopwatch = stopwatch;
//# sourceMappingURL=misc.js.map