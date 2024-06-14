import { assertNotNull } from '@subsquid/evm-processor';

import { Block as _Block } from '~/config/processor';
import {
  Account,
  AccountType,
  Block,
  Commitment,
  CommitmentRecipient,
  Delegation,
  Settings,
  Worker,
  WorkerStatus,
} from '~/model';
import { WorkerMetadata } from '~/utils/misc';

export function createAccount(id: string, opts?: { owner?: Account; type?: AccountType }) {
  return new Account({
    id,
    balance: 0n,
    claimableDelegationCount: 0,
    type: AccountType.USER,
    ...opts,
  });
}

export function createSettings(id: string) {
  return new Settings({
    id,
  });
}

export function createDelegation(
  id: string,
  { realOwner, ...opts }: { owner: Account; realOwner?: Account; worker: Worker },
) {
  return new Delegation({
    id,
    deposit: 0n,
    claimableReward: 0n,
    claimedReward: 0n,
    ...opts,
    realOwner: realOwner ? realOwner : opts.owner,
  });
}

// export function createCommitment(
//   id: string,
//   {
//     from,
//     to,
//     recipientIds,
//     workerRewards,
//     stakerRewards,
//   }: {
//     from: number | bigint;
//     to: number | bigint;
//     recipientIds: string[];
//     workerRewards: bigint[];
//     stakerRewards: bigint[];
//   },
// ) {
//   return new Commitment({
//     id,
//     from: Number(from),
//     to: Number(to),
//     recipients: recipientIds.map(
//       (workerId, i) =>
//         new CommitmentRecipient({
//           workerId,
//           workerReward: workerRewards[i],
//           stakerReward: stakerRewards[i],
//         }),
//     ),
//   });
// }

export function createBlock(block: _Block) {
  const { timestamp, ...props } = block;
  return new Block({
    timestamp: new Date(timestamp),
    ...props,
  });
}

export function unwrapAccount(account: Account) {
  switch (account.type) {
    case AccountType.USER:
      return account;
    case AccountType.VESTING:
      return assertNotNull(account.owner);
  }
}
export function createWorker(
  id: string,
  {
    owner,
    realOwner,
    metadata,
    peerId,
    createdAt,
  }: {
    owner: Account;
    realOwner: Account;
    metadata: WorkerMetadata;
    peerId: string;
    createdAt: Date;
  },
) {
  const worker = new Worker({
    id,
    bond: 0n,
    owner,
    realOwner,
    peerId,
    createdAt,
    claimableReward: 0n,
    claimedReward: 0n,
    totalDelegation: 0n,
    delegationCount: 0,
    capedDelegation: 0n,
    totalDelegationRewards: 0n,
    status: WorkerStatus.UNKNOWN,
    locked: null,
    lockStart: null,
    lockEnd: null,
    ...metadata,
  });

  resetWorkerStats(worker);

  return worker;
}

export function resetWorkerStats(worker: Worker) {
  Object.assign(worker, {
    online: null,
    dialOk: null,
    jailed: null,
    storedData: null,
    queries24Hours: null,
    queries90Days: null,
    scannedData24Hours: null,
    scannedData90Days: null,
    servedData24Hours: null,
    servedData90Days: null,
    uptime24Hours: null,
    uptime90Days: null,
    version: null,
    apr: null,
    stakerApr: null,
  } satisfies Partial<Worker>);
}
