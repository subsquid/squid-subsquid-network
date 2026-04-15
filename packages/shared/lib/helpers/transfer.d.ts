import type { Log } from '../processor';
export declare function findTransfer(logs: Log[], filter: {
    from?: string;
    to?: string;
    amount?: bigint;
    logIndex: number;
}): {
    log: Log;
    event: {
        readonly from: string;
        readonly to: string;
        readonly value: bigint;
    };
} | undefined;
export declare function findTransferInTx(logs: Log[], filter: {
    from?: string;
    to?: string;
    amount?: bigint;
}): {
    log: Log;
    event: {
        readonly from: string;
        readonly to: string;
        readonly value: bigint;
    };
} | undefined;
