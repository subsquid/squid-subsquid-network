import { assertNotNull, EvmBatchProcessor } from '@subsquid/evm-processor';
import { Database, LocalDest } from '@subsquid/file-store';

import * as Router from '../src/abi/Router';
import { ContractConfig, network } from '../src/config/network';

import { NetworkControllerMetadata } from '~/config/queries/networkController';
import { RewardCalculationMetadata } from '~/config/queries/rewardCalculation';
import { RewardTreasuryMetadata } from '~/config/queries/rewardTreasury';
import { addRouterQuery } from '~/config/queries/router';
import { StakingMetadata } from '~/config/queries/staking';
import { WorkerRegistryMetadata } from '~/config/queries/workersRegistry';

const OUTPUT_FILE = 'router.json';

const DEFAULTS =
  process.env.NETWORK === 'mainnet'
    ? {
        networkController: '0x4cf58097d790b193d22ed633bf8b15c9bc4f0da7',
        rewardCalculation: '0xd3d2c185a30484641c07b60e7d952d7b85516eb5',
        rewardTreasury: '0x237abf43bc51fd5c50d0d598a1a4c26e56a8a2a0',
        workerRegistration: '0x36e2b147db67e76ab67a4d07c293670ebefcae4e',
        staking: '0xb31a0d39d2c69ed4b28d96e12cbf52c5f9ac9a51',
      }
    : {
        networkController: '0x68fc7e375945d8c8dfb0050c337ff09e962d976d',
        rewardCalculation: '0x93d16d5210122c804de9931b41b3c6fa2649ce3f',
        rewardTreasury: '0x785136e611e15d532c36502aabdfe8e35008c7ca',
        workerRegistration: '0xcd8e983f8c4202b0085825cf21833927d1e2b6dc',
        staking: '0x347e326b8b4ea27c87d5ca291e708cdec6d65eb5',
      };

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
  });

addRouterQuery(processor);

type Metadata = WorkerRegistryMetadata &
  StakingMetadata &
  RewardCalculationMetadata &
  NetworkControllerMetadata &
  RewardTreasuryMetadata & { hash: string };

let networkController: ContractConfig[],
  rewardCalculation: ContractConfig[],
  rewardTreasury: ContractConfig[],
  workerRegistration: ContractConfig[],
  staking: ContractConfig[];

let isInit = false;

const db = new Database({
  tables: {},
  dest: new LocalDest(`./assets/${network.name}`),
  chunkSizeMb: Infinity,
  hooks: {
    async onStateRead(dest) {
      if (await dest.exists(OUTPUT_FILE)) {
        const { height, hash, ...metadata }: Metadata = await dest
          .readFile(OUTPUT_FILE)
          .then(JSON.parse);

        if (!isInit) {
          networkController = metadata.networkController || [
            {
              address: DEFAULTS.networkController,
              range: { from: network.contracts.Router.range.from },
            },
          ];
          rewardCalculation = metadata.rewardCalculation || [
            {
              address: DEFAULTS.rewardCalculation,
              range: { from: network.contracts.Router.range.from },
            },
          ];
          rewardTreasury = metadata.rewardTreasury || [
            {
              address: DEFAULTS.rewardTreasury,
              range: { from: network.contracts.Router.range.from },
            },
          ];
          workerRegistration = metadata.workerRegistration || [
            {
              address: DEFAULTS.workerRegistration,
              range: { from: network.contracts.Router.range.from },
            },
          ];
          staking = metadata.staking || [
            {
              address: DEFAULTS.staking,
              range: { from: network.contracts.Router.range.from },
            },
          ];
          isInit = true;
        }

        return { height, hash };
      } else {
        return undefined;
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
      };
      await dest.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
    },
  },
});

processor.run(db, async (ctx) => {
  ctx.store.setForceFlush(true);

  for (const c of ctx.blocks) {
    for (const i of c.logs) {
      switch (i.topics[0]) {
        case Router.events.NetworkControllerSet.topic:
          {
            const event = Router.events.NetworkControllerSet.decode(i);
            if (networkController.length > 0) {
              networkController[networkController.length - 1].range.to = i.block.height - 1;
            }
            networkController.push({
              address: event.networkController,
              range: { from: i.block.height },
            });
          }
          break;
        case Router.events.RewardCalculationSet.topic:
          {
            const event = Router.events.RewardCalculationSet.decode(i);
            if (rewardCalculation.length > 0) {
              rewardCalculation[rewardCalculation.length - 1].range.to = i.block.height - 1;
            }
            rewardCalculation.push({
              address: event.rewardCalculation,
              range: { from: i.block.height },
            });
          }
          break;
        case Router.events.RewardTreasurySet.topic:
          {
            const event = Router.events.RewardTreasurySet.decode(i);
            if (rewardTreasury.length > 0) {
              rewardTreasury[rewardTreasury.length - 1].range.to = i.block.height - 1;
            }
            rewardTreasury.push({
              address: event.rewardTreasury,
              range: { from: i.block.height },
            });
          }
          break;
        case Router.events.WorkerRegistrationSet.topic:
          {
            const event = Router.events.WorkerRegistrationSet.decode(i);
            if (workerRegistration.length > 0) {
              workerRegistration[workerRegistration.length - 1].range.to = i.block.height - 1;
            }
            workerRegistration.push({
              address: event.workerRegistration,
              range: { from: i.block.height },
            });
          }
          break;
        case Router.events.StakingSet.topic: {
          const event = Router.events.StakingSet.decode(i);
          if (staking.length > 0) {
            staking[staking.length - 1].range.to = i.block.height - 1;
          }
          staking.push({
            address: event.staking,
            range: { from: i.block.height },
          });
        }
      }
    }
  }
});
