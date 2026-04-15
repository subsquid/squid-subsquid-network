"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
class TaskQueue {
    constructor() {
        this.tasks = [];
    }
    add(fn) {
        this.tasks.push(fn);
    }
    async run() {
        while (this.tasks.length > 0) {
            const task = this.tasks.shift();
            await task();
        }
    }
}
exports.TaskQueue = TaskQueue;
//# sourceMappingURL=queue.js.map