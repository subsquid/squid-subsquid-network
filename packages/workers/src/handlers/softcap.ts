import { BigDecimal } from '@subsquid/big-decimal'

/**
 * Local TypeScript port of `SoftCap.capedStake` from the on-chain contracts.
 *
 *   cap(x)        = (2/3)^((x − 1)^4) − 2/3
 *   stakingShare = stake / (stake + bond)
 *   capedStake   = ⌊cap(stakingShare) · bond⌋
 *
 * where:
 *   stake = router.staking().delegated(workerId)   ← `worker.totalDelegation`
 *   bond  = router.networkController().bondAmount() ← `settings.bondAmount`
 *
 * The result is bounded by ~bond / 3.
 *
 * Computed off-chain to avoid an `eth_call` (and the multicall round-trip)
 * per worker. `BigDecimal` is used only for the `stake / (stake + bond)`
 * ratio to avoid precision loss from `Number(bigint)`; the rest of the math
 * fits comfortably in IEEE-754 doubles since both `x` and `(x − 1)^4` lie
 * in `[0, 1]`.
 *
 * Kept as a standalone module (no ORM imports) so it can be unit-tested
 * against the Solidity reference without bootstrapping the schema.
 *
 * Reference: subsquid-network-contracts/packages/contracts/src/SoftCap.sol
 */
const CAP_BASE = 2 / 3

export function computeCapedDelegation(stake: bigint, bond: bigint): bigint {
  if (bond <= 0n || stake <= 0n) return 0n

  const total = stake + bond
  // Exact ratio in [0, 1); fits in a double without loss of precision.
  const x = Number(BigDecimal(stake).div(total).toString())
  const exponent = (1 - x) ** 4
  const capValue = Math.pow(CAP_BASE, exponent) - CAP_BASE
  if (capValue <= 0) return 0n

  // Floor to integer wei to match `convert(UD60x18) → uint256` in Solidity.
  return BigInt(BigDecimal(bond).mul(capValue).toFixed(0, 0))
}
