"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGatewayStakeId = exports.createEpochId = exports.createWorkerSnapshotId = exports.createCommitmentId = exports.createDelegationId = exports.createGatewayOperatorId = exports.createAccountId = exports.createWorkerId = exports.createDelegationStatusChangeId = exports.createWorkerStatusId = void 0;
const misc_1 = require("../utils/misc");
function createWorkerStatusId(workerId, blockNumber) {
    return `${blockNumber}-${workerId}`;
}
exports.createWorkerStatusId = createWorkerStatusId;
function createDelegationStatusChangeId(delegationId, blockNumber) {
    return `${blockNumber}-${delegationId}`;
}
exports.createDelegationStatusChangeId = createDelegationStatusChangeId;
function createWorkerId(workerIndex) {
    return workerIndex.toString();
}
exports.createWorkerId = createWorkerId;
function createAccountId(address) {
    return (0, misc_1.normalizeAddress)(address);
}
exports.createAccountId = createAccountId;
function createGatewayOperatorId(address) {
    return createAccountId(address);
}
exports.createGatewayOperatorId = createGatewayOperatorId;
function createDelegationId(workerId, accountId) {
    return `${workerId}-${accountId}`;
}
exports.createDelegationId = createDelegationId;
function createCommitmentId(from, to) {
    return `${from.toString().padStart(10, '0')}-${to.toString().padStart(10, '0')}`;
}
exports.createCommitmentId = createCommitmentId;
function createWorkerSnapshotId(workerId, snapshotIndex) {
    return `${workerId.padStart(5, '0')}-${String(snapshotIndex).padStart(10, '0')}`;
}
exports.createWorkerSnapshotId = createWorkerSnapshotId;
function createEpochId(epochNumber) {
    return `${String(epochNumber).padStart(10, '0')}`;
}
exports.createEpochId = createEpochId;
function createGatewayStakeId(operatorId, stakeIndex) {
    return `${operatorId}-${stakeIndex.toString().padStart(5, '0')}`;
}
exports.createGatewayStakeId = createGatewayStakeId;
//# sourceMappingURL=ids.js.map