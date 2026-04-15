import type { BlockData, Log, Transaction } from './processor';
export type LogItem = {
    kind: 'log';
    address: string;
    value: Log;
};
export type TransactionItem = {
    kind: 'transaction';
    address: string | undefined;
    value: Transaction;
};
export type Item = LogItem | TransactionItem;
export declare function isContract(item: Item, contract: string | {
    address: string;
}): boolean;
export declare function isLog(item: Item): item is LogItem;
export declare function isTransaction(item: Item): item is TransactionItem;
export declare function sortItems(block: BlockData): Item[];
