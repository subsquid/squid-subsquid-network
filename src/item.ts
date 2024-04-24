import { Log, Transaction, BlockData } from '~/config/processor';
import { normalizeAddress } from '~/utils/misc';

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

export function isContract(item: Item, address: string): boolean {
  return item.address === normalizeAddress(address);
}

export function isLog(item: Item): item is LogItem {
  return item.kind === 'log';
}

export function isTransaction(item: Item): item is TransactionItem {
  return item.kind === 'transaction';
}

export function sortItems(block: BlockData) {
  const items: Item[] = [];

  for (const transaction of block.transactions) {
    items.push({
      kind: 'transaction',
      address: transaction.to,
      value: transaction,
    });
  }

  for (const log of block.logs) {
    items.push({
      kind: 'log',
      address: log.address,
      value: log,
    });
  }

  items.sort((a, b) => {
    if (a.kind === 'log' && b.kind === 'log') {
      return a.value.logIndex - b.value.logIndex;
    } else if (a.kind === 'transaction' && b.kind === 'transaction') {
      return a.value.transactionIndex - b.value.transactionIndex;
    } else if (a.kind === 'log' && b.kind === 'transaction') {
      return a.value.transactionIndex - b.value.transactionIndex || 1; // transaction before logs
    } else if (a.kind === 'transaction' && b.kind === 'log') {
      return a.value.transactionIndex - b.value.transactionIndex || -1;
    } else {
      throw new Error('Unexpected case');
    }
  });

  return items;
}
