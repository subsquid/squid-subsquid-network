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
} from '~/model';

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

export function createCommitment(
  id: string,
  {
    from,
    to,
    recipientIds,
    workerRewards,
    stakerRewards,
  }: {
    from: number | bigint;
    to: number | bigint;
    recipientIds: string[];
    workerRewards: bigint[];
    stakerRewards: bigint[];
  },
) {
  return new Commitment({
    id,
    from: Number(from),
    to: Number(to),
    recipients: recipientIds.map(
      (workerId, i) =>
        new CommitmentRecipient({
          workerId,
          workerReward: workerRewards[i],
          stakerReward: stakerRewards[i],
        }),
    ),
  });
}

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
