export declare function parsePeerId(peerId: string): string;
export type WorkerMetadata = {
    name?: string | null;
    website?: string | null;
    description?: string | null;
    email?: string | null;
};
export declare function parseWorkerMetadata(ctx: {
    log: any;
}, rawMetadata: string): WorkerMetadata;
export type GatewayMetadata = {
    name: string | null;
    website: string | null;
    description: string | null;
    email: string | null;
    endpointUrl: string | null;
};
export declare function parseGatewayMetadata(ctx: {
    log: any;
}, rawMetadata: string): GatewayMetadata;
export declare function toPercent(value: number, overflow?: boolean): number;
export declare function normalizeAddress(address: string): string;
export declare function toNextEpochStart(block: number, length: number): number;
export declare function toEpochStart(block: number, length: number): number;
export type Awaitable<T> = T | Promise<T>;
export declare function joinUrl(...args: string[]): string;
export declare function toHumanSQD(value: bigint): string;
export declare function last<T>(array: T[]): T | undefined;
export declare function stopwatch(): {
    get: () => bigint;
};
