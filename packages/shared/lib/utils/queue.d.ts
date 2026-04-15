import type { Awaitable } from './misc';
export type Task = () => Awaitable<void>;
export declare class TaskQueue {
    private tasks;
    add(fn: Task): void;
    run(): Promise<void>;
}
