import { BigDecimal } from '@subsquid/big-decimal';
import { keyBy } from 'lodash';
import { In, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm';

import { isContract, isLog, LogItem } from '../../item';
import { Events, MappingContext } from '../../types';
import { createHandler } from '../base';
import { createCommitment } from '../helpers/entities';
import { createCommitmentId, createWorkerId } from '../helpers/ids';

import * as RewardsDistribution from '~/abi/DistributedRewardsDistribution';
import { network } from '~/config/network';
import { Log } from '~/config/processor';
import {
  Worker,
  Block,
  Delegation,
  DelegationReward,
  WorkerReward,
  WorkerStatus,
  Commitment,
  CommitmentRecipient,
} from '~/model';
import { toPercent } from '~/utils/misc';
import { DAY_MS, YEAR_MS } from '~/utils/time';

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

    const recipientIds = event.recipients.map((r) => createWorkerId(r));

    ctx.queue.add(async () => {
      if (recipientIds.length === 0) {
        ctx.log.info(`nothing to reward`);
        return;
      }

      const fromBlock = await ctx.store.findOne(Block, {
        where: { l1BlockNumber: LessThanOrEqual(Number(event.fromBlock)) },
        order: { height: 'DESC' },
      });

      const toBlock = await ctx.store.findOne(Block, {
        where: { l1BlockNumber: MoreThanOrEqual(Number(event.toBlock)) },
        order: { height: 'ASC' },
      });

      const activeWorkers = await ctx.store.find(Worker, {
        where: { status: In([WorkerStatus.ACTIVE, WorkerStatus.DEREGISTERING]) },
      });

      const payments = keyBy(
        recipientIds.map((workerId, i) => ({
          workerId,
          workerReward: event.workerRewards[i],
          workerApr: 0,
          stakerReward: event.stakerRewards[i],
          stakerApr: 0,
        })),
        (r) => r.workerId,
      );

      let delegationRewardsCount = 0;
      for (const worker of activeWorkers) {
        let payment = payments[worker.id];
        if (!payment) {
          payment = {
            workerId: worker.id,
            workerReward: 0n,
            workerApr: 0,
            stakerReward: 0n,
            stakerApr: 0,
          };
          payments[worker.id] = payment;
        }

        if (fromBlock && toBlock) {
          const interval = toBlock.timestamp.getTime() - fromBlock.timestamp.getTime();
          payment.workerApr = worker.bond
            ? toPercent(
                BigDecimal(payment.workerReward)
                  .div(interval)
                  .mul(YEAR_MS)
                  .div(worker.bond)
                  .toNumber(),
                true,
              )
            : 0;
          payment.stakerApr = worker.totalDelegation
            ? toPercent(
                BigDecimal(payment.stakerReward)
                  .div(interval)
                  .mul(YEAR_MS)
                  .div(worker.totalDelegation)
                  .toNumber(),
                true,
              )
            : 0;
        }

        worker.claimableReward += payment.workerReward;
        await ctx.store.upsert(worker);

        if (payment.workerReward > 0) {
          const reward = new WorkerReward({
            id: `${log.id}-${worker.id.padStart(5, '0')}`,
            blockNumber: log.block.height,
            timestamp: new Date(log.block.timestamp),
            worker,
            amount: payment.workerReward,
            stakersReward: payment.stakerReward,
          });

          await ctx.store.insert(reward);
        }

        if (payment.stakerReward > 0) {
          const rewardsPerShare = (payment.stakerReward * 10n ** 18n) / worker.totalDelegation;

          const count = await distributeReward(ctx, log, {
            workerId: worker.id,
            rewardsPerShare,
            offset: delegationRewardsCount,
          });
          delegationRewardsCount += count;
        }
      }

      await ctx.store.insert(
        new Commitment({
          id: createCommitmentId(event.fromBlock, event.toBlock),
          from: Number(event.fromBlock),
          to: Number(event.toBlock),
          recipients: Object.values(payments).map((p) => new CommitmentRecipient(p)),
        }),
      );

      await ctx.events.emit(Events.RewardsDistibuted, log.block);

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
