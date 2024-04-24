import { normalizeAddress } from '~/utils/misc';

export function createWorkerStatusId(workerId: string, blockNumber: number | bigint) {
  return `${blockNumber}-${workerId}`;
}

export function createWorkerId(workerIndex: bigint) {
  return workerIndex.toString();
}

export function createAccountId(address: string) {
  return normalizeAddress(address);
}

export function createGatewayOperatorId(address: string) {
  return createAccountId(address);
}

export function createDelegationId(workerId: string, accountId: string) {
  return `${workerId}-${accountId}`;
}

export function createCommitmentId(from: number | bigint, to: number | bigint) {
  return `${from.toString().padStart(10, '0')}-${to.toString().padStart(10, '0')}`;
}

export function createWorkerSnapshotId(workerId: string, snapshotIndex: number) {
  return `${workerId.padStart(5, '0')}-${String(snapshotIndex).padStart(10, '0')}`;
}

export function createEpochId(epochNumber: number) {
  return `${String(epochNumber).padStart(10, '0')}`;
}

export function createGatewayStakeId(operatorId: string, stakeIndex: number | bigint) {
  return `${operatorId}-${stakeIndex.toString().padStart(5, '0')}`;
}
