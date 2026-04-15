"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortItems = exports.isTransaction = exports.isLog = exports.isContract = void 0;
const misc_1 = require("./utils/misc");
function isContract(item, contract) {
    return (item.address === (0, misc_1.normalizeAddress)(typeof contract === 'string' ? contract : contract.address));
}
exports.isContract = isContract;
function isLog(item) {
    return item.kind === 'log';
}
exports.isLog = isLog;
function isTransaction(item) {
    return item.kind === 'transaction';
}
exports.isTransaction = isTransaction;
function sortItems(block) {
    const items = [];
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
        }
        else if (a.kind === 'transaction' && b.kind === 'transaction') {
            return a.value.transactionIndex - b.value.transactionIndex;
        }
        else if (a.kind === 'log' && b.kind === 'transaction') {
            return a.value.transactionIndex - b.value.transactionIndex || 1;
        }
        else if (a.kind === 'transaction' && b.kind === 'log') {
            return a.value.transactionIndex - b.value.transactionIndex || -1;
        }
        else {
            throw new Error('Unexpected case');
        }
    });
    return items;
}
exports.sortItems = sortItems;
//# sourceMappingURL=item.js.map