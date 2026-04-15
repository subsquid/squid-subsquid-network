import type { WorkerMetadata } from '@sqd/shared'
import { Block, Delegation, Settings, Worker, WorkerStatus } from '~/model'

export function createWorker(
  id: string,
  {
    ownerId,
    metadata,
    peerId,
    createdAt,
  }: {
    ownerId: string
    metadata: WorkerMetadata
    peerId: string
    createdAt: Date
  },
) {
  const worker = new Worker({
    id,
    bond: 0n,
    ownerId,
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
  })

  resetWorkerStats(worker)

  return worker
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
  } satisfies Partial<Worker>)
}

export function createDelegation(id: string, opts: { ownerId: string; worker: Worker }) {
  return new Delegation({
    id,
    deposit: 0n,
    claimableReward: 0n,
    claimedReward: 0n,
    ...opts,
  })
}

export function createSettings(id: string) {
  return new Settings({
    id,
    utilizedStake: 0n,
    baseApr: 0,
    delegationLimitCoefficient: 0.2,
    bondAmount: 10n ** 23n,
  })
}

export function createBlock(block: {
  id: string
  hash: string
  height: number
  timestamp: number
  l1BlockNumber?: number
}) {
  return new Block({
    id: block.id,
    hash: block.hash,
    height: block.height,
    timestamp: new Date(block.timestamp),
    l1BlockNumber: block.l1BlockNumber ?? undefined,
  })
}
