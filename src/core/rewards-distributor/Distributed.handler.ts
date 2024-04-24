import { BigDecimal } from '@subsquid/big-decimal';
import { keyBy } from 'lodash';
import { In, MoreThan } from 'typeorm';

import { isContract, isLog, LogItem } from '../../item';
import { MappingContext } from '../../types';
import { createHandler } from '../base';
import { createCommitment } from '../helpers/entities';
import { createCommitmentId, createWorkerId } from '../helpers/ids';

import * as RewardsDistribution from '~/abi/DistributedRewardsDistribution';
import { network } from '~/config/network';
import { Log } from '~/config/processor';
import { Worker, Block, Delegation, DelegationReward, WorkerReward, WorkerStatus } from '~/model';
import { toPercent } from '~/utils/misc';
import { DAY_MS } from '~/utils/time';

export const handleDistributed = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.RewardsDistibution) &&
      isLog(item) &&
      RewardsDistribution.events.Distributed.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = RewardsDistribution.events.Distributed.decode(log);

    const commitmentId = createCommitmentId(event.fromBlock, event.toBlock);

    const recipientIds = event.recipients.map((r) => createWorkerId(r));

    ctx.queue.add(async () => {
      const commitment = createCommitment(commitmentId, {
        from: event.fromBlock,
        to: event.toBlock,
        recipientIds,
        workerRewards: event.workerRewards,
        stakerRewards: event.stakerRewards,
      });
      await ctx.store.insert(commitment);

      if (recipientIds.length === 0) {
        ctx.log.info(`nothing to reward`);
        return;
      }

      const fromBlock = await ctx.store.findOne(Block, {
        where: { l1BlockNumber: Number(event.fromBlock) },
        order: { height: 'ASC' },
      });

      const toBlock = await ctx.store.findOne(Block, {
        where: { l1BlockNumber: Number(event.toBlock) },
        order: { height: 'ASC' },
      });

      const activeWorkers = await ctx.store.find(Worker, {
        where: { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
      });

      const payments = keyBy(
        recipientIds.map((workerId, i) => ({
          workerId,
          worker: event.workerRewards[i],
          staker: event.stakerRewards[i],
        })),
        (r) => r.workerId,
      );

      let delegationRewardsCount = 0;
      for (const worker of activeWorkers) {
        const payment = payments[worker.id] || { workerId: worker.id, worker: 0n, staker: 0n };

        worker.claimableReward += payment.worker;
        if (fromBlock && toBlock) {
          const interval = toBlock.timestamp.getTime() - fromBlock.timestamp.getTime();
          worker.apr = worker.bond
            ? toPercent(
                BigDecimal(payment.worker)
                  .div(interval)
                  .mul(365 * DAY_MS)
                  .div(worker.bond)
                  .toNumber(),
                true,
              )
            : 0;
          worker.stakerApr = worker.totalDelegation
            ? toPercent(
                BigDecimal(payment.staker)
                  .div(interval)
                  .mul(365 * DAY_MS)
                  .div(worker.totalDelegation)
                  .toNumber(),
                true,
              )
            : 0;
        }
        await ctx.store.upsert(worker);

        if (payment.worker > 0) {
          const reward = new WorkerReward({
            id: `${log.id}-${worker.id.padStart(5, '0')}`,
            blockNumber: log.block.height,
            timestamp: new Date(log.block.timestamp),
            worker,
            amount: payment.worker,
            stakersReward: payment.staker,
          });

          await ctx.store.insert(reward);
        }

        if (payment.staker > 0) {
          const rewardsPerShare = (payment.staker * 10n ** 18n) / worker.totalDelegation;

          const count = await distributeReward(ctx, log, {
            workerId: worker.id,
            rewardsPerShare,
            offset: delegationRewardsCount,
          });
          delegationRewardsCount += count;
        }
      }

      ctx.log.info(
        `rewarded ${recipientIds.length} workers and ${delegationRewardsCount} delegations`,
      );
    });
  },
});

async function distributeReward(
  ctx: MappingContext,
  log: Log,
  {
    workerId,
    rewardsPerShare,
    offset,
  }: {
    workerId: string;
    rewardsPerShare: bigint;
    offset: number;
  },
) {
  const delegations = await ctx.store.find(Delegation, {
    where: { worker: { id: workerId }, deposit: MoreThan(0n) },
    relations: { owner: true },
  });
  if (delegations.length === 0) {
    ctx.log.warn(`missing delegation for worker(${workerId})`);
  }

  for (let i = 0; i < delegations.length; i++) {
    const delegation = delegations[i];

    const amount = (delegation.deposit * rewardsPerShare) / 10n ** 18n;
    delegation.claimableReward += amount;

    await ctx.store.upsert(delegation);

    if (delegation.claimableReward === amount) {
      const owner = delegation.owner;
      owner.claimableDelegationCount += 1;
      await ctx.store.upsert(owner);
    }

    const reward = new DelegationReward({
      id: `${log.id}-${String(offset + i).padStart(5, '0')}`,
      blockNumber: log.block.height,
      timestamp: new Date(log.block.timestamp),
      delegation,
      amount,
    });

    await ctx.store.insert(reward);
  }

  return delegations.length;
}
