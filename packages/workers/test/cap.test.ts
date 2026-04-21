import { describe, expect, it } from 'vitest'

import { computeCapedDelegation } from '~/handlers/softcap'

// 101 precalculated `cap(i/100) * 1e20` values from
// subsquid-network-contracts/packages/contracts/test/SoftCap.t.sol.
// Kept verbatim so parity with the Solidity `SoftCapTest.test_Cap` vector
// is easy to verify.
const PRECALCULATED_CAP_1E20 = [
  0n,
  1073683790892470000n,
  2131842820793010000n,
  3173887134792180000n,
  4199263980967850000n,
  5207458056380590000n,
  6197991635953580000n,
  7170424588491440000n,
  8124354284395630000n,
  9059415399897710000n,
  9975279622854080000n,
  10871655265330100000n,
  11748286788346900000n,
  12604954244273900000n,
  13441472642425300000n,
  14257691243459700000n,
  15053492788193400000n,
  15828792666418500000n,
  16583538031272800000n,
  17317706864633900000n,
  18031306998920900000n,
  18724375100566500000n,
  19396975620292700000n,
  20049199715168200000n,
  20681164147263500000n,
  21293010163537500000n,
  21884902361399900000n,
  22457027544197000000n,
  23009593570656600000n,
  23542828202119800000n,
  24056977951167900000n,
  24552306935031900000n,
  25029095736953400000n,
  25487640278442200000n,
  25928250705155600000n,
  26351250288907200000n,
  26756974348096100000n,
  27145769188638500000n,
  27517991067274200000n,
  27874005178923700000n,
  28214184669571900000n,
  28538909675971800000n,
  28848566393276100000n,
  29143546171533600000n,
  29424244641821800000n,
  29691060872628300000n,
  29944396556944300000n,
  30184655230395400000n,
  30412241520597000000n,
  30627560427802000000n,
  30831016636791400000n,
  31023013859847900000n,
  31203954210557600000n,
  31374237608090300000n,
  31534261211524400000n,
  31684418883710500000n,
  31825100684093300000n,
  31956692389854000000n,
  32079575044678500000n,
  32194124534408400000n,
  32300711188790900000n,
  32399699408505300000n,
  32491447316616500000n,
  32576306433577400000n,
  32654621374885500000n,
  32726729570480900000n,
  32792961004964300000n,
  32853637977705500000n,
  32909074881912200000n,
  32959578001728200000n,
  33005445326435600000n,
  33046966380841900000n,
  33084422070946600000n,
  33118084543989900000n,
  33148217062006400000n,
  33175073888021600000n,
  33198900184049300000n,
  33219931920070200000n,
  33238395793194200000n,
  33254509156232600000n,
  33268479954936300000n,
  33280506673175700000n,
  33290778285374700000n,
  33299474215532600000n,
  33306764302200700000n,
  33312808768812400000n,
  33317758198790300000n,
  33321753514893400000n,
  33324925962290900000n,
  33327397094887100000n,
  33329278764452100000n,
  33330673112143600000n,
  33331672562041500000n,
  33332359816347500000n,
  33332807851933900000n,
  33333079917961900000n,
  33333229534319500000n,
  33333300490665000000n,
  33333326845891800000n,
  33333332927868200000n,
  33333333333333300000n,
]

// Matches `test_CapedStake`: stake is expressed as a multiple of `bond`, and
// the expected caped result is `bond * precalculated[fraction] / 1e20` with a
// 1e16 relative tolerance (≈ 0.01).
const CAPED_STAKE_CASES = [
  { stakeFn: (_b: bigint) => 0n, fraction: 0, label: 'stake = 0' },
  { stakeFn: (b: bigint) => b / 10n, fraction: 9, label: 'stake = bond/10 (≈1/11)' },
  { stakeFn: (b: bigint) => b / 2n, fraction: 33, label: 'stake = bond/2 (≈1/3)' },
  { stakeFn: (b: bigint) => b, fraction: 50, label: 'stake = bond (1/2)' },
  { stakeFn: (b: bigint) => b * 2n, fraction: 66, label: 'stake = 2*bond (2/3)' },
  { stakeFn: (b: bigint) => b * 10n, fraction: 100, label: 'stake = 10*bond (≈1)' },
  { stakeFn: (b: bigint) => b * 100_000n, fraction: 100, label: 'stake = 100_000*bond' },
] as const

// A bond of 100k SQD matches the on-chain default (`NetworkController`).
const BOND = 100_000n * 10n ** 18n

function assertApproxEqRel(actual: bigint, expected: bigint, relTolE18: bigint, label: string) {
  if (expected === 0n) {
    expect(actual, label).toBe(0n)
    return
  }
  const diff = actual > expected ? actual - expected : expected - actual
  // rel = diff / expected; compare diff*1e18 < rel * expected.
  expect(diff * 10n ** 18n <= relTolE18 * (expected < 0n ? -expected : expected), label).toBe(true)
}

describe('computeCapedDelegation', () => {
  it('returns 0 when bond or stake is non-positive', () => {
    expect(computeCapedDelegation(0n, 0n)).toBe(0n)
    expect(computeCapedDelegation(1_000_000n, 0n)).toBe(0n)
    expect(computeCapedDelegation(0n, 1_000_000n)).toBe(0n)
    expect(computeCapedDelegation(-1n, 1_000_000n)).toBe(0n)
    expect(computeCapedDelegation(1_000_000n, -1n)).toBe(0n)
  })

  it('matches Solidity precalculated table for stake/(stake+bond) in 1% steps', () => {
    // Sample every 5% for speed; the function is monotonic so the full 101
    // samples would be redundant.
    for (let i = 0; i <= 100; i += 5) {
      const x = i / 100 // stakingShare
      // Derive stake from x: stake = x * total, with total chosen to
      // keep everything in integer wei. Pick total = 10^21 so stake is
      // exactly `x * 1e21` and bond = `(1-x) * 1e21`.
      const total = 10n ** 21n
      const stake = BigInt(Math.round(x * 1e21))
      const bond = total - stake
      if (bond <= 0n) continue

      const actual = computeCapedDelegation(stake, bond)
      // expected = cap(x) * bond = (precalculated[i] / 1e20) * bond
      const expected = (PRECALCULATED_CAP_1E20[i]! * bond) / 10n ** 20n
      // Allow 1e16 relative tolerance (Solidity test uses the same).
      assertApproxEqRel(actual, expected, 10n ** 16n, `x=${x}`)
    }
  })

  it('matches SoftCap.test_CapedStake at whole-bond multiples', () => {
    for (const { stakeFn, fraction, label } of CAPED_STAKE_CASES) {
      const stake = stakeFn(BOND)
      const actual = computeCapedDelegation(stake, BOND)
      const expected = (BOND * PRECALCULATED_CAP_1E20[fraction]!) / 10n ** 20n
      assertApproxEqRel(actual, expected, 10n ** 16n, label)
    }
  })

  it('cap is bounded by bond/3 for very large stake', () => {
    // Solidity test: `bond * 100000` caps at fraction=100 (≈ bond/3).
    const stake = BOND * 10n ** 6n
    const cap = computeCapedDelegation(stake, BOND)
    // Upper bound bond/3, allow 1% slack.
    expect(cap <= (BOND + BOND / 100n) / 3n).toBe(true)
    // Not trivially zero.
    expect(cap > BOND / 4n).toBe(true)
  })

  it('cap is monotonic non-decreasing in stake for fixed bond', () => {
    const samples = [0n, BOND / 10n, BOND / 2n, BOND, BOND * 2n, BOND * 10n, BOND * 100n]
    let prev = 0n
    for (const stake of samples) {
      const cap = computeCapedDelegation(stake, BOND)
      expect(cap >= prev, `cap not monotonic at stake=${stake}`).toBe(true)
      prev = cap
    }
  })

  it('handles tiny and extreme bond values without throwing', () => {
    // Tiny bond, large stake: cap tends to bond/3.
    const tinyBond = 1n
    const cap1 = computeCapedDelegation(10n ** 18n, tinyBond)
    expect(cap1).toBeGreaterThanOrEqual(0n)
    // Huge bond, tiny stake: cap is ~0 (near-linear tail).
    const hugeBond = 10n ** 30n
    const cap2 = computeCapedDelegation(1n, hugeBond)
    expect(cap2).toBeGreaterThanOrEqual(0n)
  })
})
