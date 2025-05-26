import { assertNotNull, EvmBatchProcessor } from '@subsquid/evm-processor'
import { Database, LocalDest } from '@subsquid/file-store'

import * as Router from '../src/abi/Router'
import { ContractConfig, network } from '../src/config/network'

import { NetworkControllerMetadata } from '~/config/queries/networkController'
import { RewardCalculationMetadata } from '~/config/queries/rewardCalculation'
import { RewardTreasuryMetadata } from '~/config/queries/rewardTreasury'
import { addRouterQuery } from '~/config/queries/router'
import { StakingMetadata } from '~/config/queries/staking'
import { WorkerRegistryMetadata } from '~/config/queries/workersRegistry'

const OUTPUT_FILE = 'router.json'

const processor = new EvmBatchProcessor()
  .setPortal(assertNotNull(process.env.PORTAL_ENDPOINT))
  .setBlockRange({
    from: network.contracts.Router.range.from,
  })
  .setFields({
    log: {
      topics: true,
      data: true,
    },
  })

addRouterQuery(processor)

type Metadata = WorkerRegistryMetadata &
  StakingMetadata &
  RewardCalculationMetadata &
  NetworkControllerMetadata &
  RewardTreasuryMetadata & { hash: string }

let networkController: ContractConfig[],
  rewardCalculation: ContractConfig[],
  rewardTreasury: ContractConfig[],
  workerRegistration: ContractConfig[],
  staking: ContractConfig[]

let isInit = false

const db = new Database({
  tables: {},
  dest: new LocalDest(`./assets/${network.name}`),
  chunkSizeMb: Infinity,
  hooks: {
    async onStateRead(dest) {
      if (await dest.exists(OUTPUT_FILE)) {
        const { height, hash, ...metadata }: Metadata = await dest
          .readFile(OUTPUT_FILE)
          .then(JSON.parse)

        if (!isInit) {
          networkController = metadata.networkController || [
            {
              address: network.defaultRouterContracts.networkController,
              range: { from: network.contracts.Router.range.from },
            },
          ]
          rewardCalculation = metadata.rewardCalculation || [
            {
              address: network.defaultRouterContracts.rewardCalculation,
              range: { from: network.contracts.Router.range.from },
            },
          ]
          rewardTreasury = metadata.rewardTreasury || [
            {
              address: network.defaultRouterContracts.rewardTreasury,
              range: { from: network.contracts.Router.range.from },
            },
          ]
          workerRegistration = metadata.workerRegistration || [
            {
              address: network.defaultRouterContracts.workerRegistration,
              range: { from: network.contracts.Router.range.from },
            },
          ]
          staking = metadata.staking || [
            {
              address: network.defaultRouterContracts.staking,
              range: { from: network.contracts.Router.range.from },
            },
          ]
          isInit = true
        }

        return { height, hash }
      } else {
        return undefined
      }
    },
    async onStateUpdate(dest, info) {
      const metadata: Metadata = {
        ...info,
        networkController,
        rewardCalculation,
        rewardTreasury,
        workerRegistration,
        staking,
      }
      await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2))
    },
  },
})

processor.run(db, async (ctx) => {
  ctx.store.setForceFlush(true)

  for (const c of ctx.blocks) {
    for (const i of c.logs) {
      switch (i.topics[0]) {
        case Router.events.NetworkControllerSet.topic:
          {
            const event = Router.events.NetworkControllerSet.decode(i)
            if (networkController.length > 0) {
              networkController[networkController.length - 1].range.to = i.block.height - 1
            }
            networkController.push({
              address: event.networkController,
              range: { from: i.block.height },
            })
          }
          break
        case Router.events.RewardCalculationSet.topic:
          {
            const event = Router.events.RewardCalculationSet.decode(i)
            if (rewardCalculation.length > 0) {
              rewardCalculation[rewardCalculation.length - 1].range.to = i.block.height - 1
            }
            rewardCalculation.push({
              address: event.rewardCalculation,
              range: { from: i.block.height },
            })
          }
          break
        case Router.events.RewardTreasurySet.topic:
          {
            const event = Router.events.RewardTreasurySet.decode(i)
            if (rewardTreasury.length > 0) {
              rewardTreasury[rewardTreasury.length - 1].range.to = i.block.height - 1
            }
            rewardTreasury.push({
              address: event.rewardTreasury,
              range: { from: i.block.height },
            })
          }
          break
        case Router.events.WorkerRegistrationSet.topic:
          {
            const event = Router.events.WorkerRegistrationSet.decode(i)
            if (workerRegistration.length > 0) {
              workerRegistration[workerRegistration.length - 1].range.to = i.block.height - 1
            }
            workerRegistration.push({
              address: event.workerRegistration,
              range: { from: i.block.height },
            })
          }
          break
        case Router.events.StakingSet.topic: {
          const event = Router.events.StakingSet.decode(i)
          if (staking.length > 0) {
            staking[staking.length - 1].range.to = i.block.height - 1
          }
          staking.push({
            address: event.staking,
            range: { from: i.block.height },
          })
        }
      }
    }
  }
})
