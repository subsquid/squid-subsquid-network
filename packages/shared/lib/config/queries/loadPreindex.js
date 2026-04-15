"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPreindexFile = void 0;
const fs_1 = __importDefault(require("fs"));
function loadPreindexFile(path) {
    try {
        return JSON.parse(fs_1.default.readFileSync(path, 'utf-8'));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[config/queries] failed to load preindex file ${path}: ${message}`);
        return undefined;
    }
}
exports.loadPreindexFile = loadPreindexFile;
//# sourceMappingURL=loadPreindex.js.map