import { toNextEpochStart } from '@sqd/shared'

export type DelegationLock = {
  locked: boolean
  lockStart: number
  lockEnd: number
}

/**
 * The lock that `Staking.deposit` puts on a delegator's whole stake on one worker.
 *
 * On-chain the unlock block is `nextEpoch() + epochLength * epochsLockedAfterStake`, written on
 * every deposit regardless of the amount. This assumes `epochsLockedAfterStake == 1`; if it
 * changes on-chain (via `Staking.EpochsLockChanged`), this calculation will diverge.
 */
export function computeDelegationLock(
  l1BlockNumber: number,
  settings: { epochLength?: number | null; lockPeriod?: number | null },
): DelegationLock {
  if (!settings.epochLength) {
    return { locked: false, lockStart: l1BlockNumber, lockEnd: l1BlockNumber }
  }

  const lockStart = toNextEpochStart(l1BlockNumber, settings.epochLength)
  return {
    locked: true,
    lockStart,
    lockEnd: lockStart + (settings.lockPeriod ?? settings.epochLength),
  }
}
