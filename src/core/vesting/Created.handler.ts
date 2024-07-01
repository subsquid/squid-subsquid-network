import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createAccount } from '../helpers/entities';
import { createAccountId } from '../helpers/ids';

import { LogRecord } from '~/abi/abi.support';
import * as TemporaryHoldingFactory from '~/abi/TemporaryHoldingFactory';
import * as VestingFactory from '~/abi/VestingFactory';
import { network } from '~/config/network';
import { Account, AccountType } from '~/model';

export const handleVestingCreated = createHandler({
  filter(_, item): item is LogItem {
    if (!isLog(item)) return false;

    switch (item.address) {
      case network.contracts.VestingFactory.address:
        return VestingFactory.events.VestingCreated.is(item.value);
      case network.contracts.TemporaryHoldingFactory.address:
        return TemporaryHoldingFactory.events.TemporaryHoldingCreated.is(item.value);
      default:
        return false;
    }
  },
  handle(ctx, { value: log }) {
    const { vestingAddress, beneficiaryAddress } = decode(log);

    const ownerDeferred = ctx.store.defer(Account, createAccountId(beneficiaryAddress));
    const vestingDeferred = ctx.store.defer(Account, {
      id: createAccountId(vestingAddress),
      relations: { owner: true },
    });

    ctx.queue.add(async () => {
      const owner = await ownerDeferred.getOrInsert((id) => {
        ctx.log.info(`created account(${id})`);
        return createAccount(id, { type: AccountType.USER });
      });
      const vesting = await vestingDeferred.getOrInsert((id) => {
        ctx.log.info(`created account(${id})`);
        return createAccount(id, { type: AccountType.VESTING, owner });
      });

      if (vesting.type !== AccountType.VESTING || vesting.owner?.id !== owner.id) {
        vesting.type = AccountType.VESTING;
        vesting.owner = owner;

        await ctx.store.upsert(vesting);
      }

      ctx.log.info(`created vesting(${vesting.id}) for account(${owner.id})`);
    });
  },
});

function decode(log: LogRecord & { address: string }) {
  switch (log.address) {
    case network.contracts.VestingFactory.address: {
      const { beneficiary, vesting } = VestingFactory.events.VestingCreated.decode(log);
      return {
        vestingAddress: vesting,
        beneficiaryAddress: beneficiary,
      };
    }
    case network.contracts.TemporaryHoldingFactory.address: {
      const { beneficiaryAddress, vesting } =
        TemporaryHoldingFactory.events.TemporaryHoldingCreated.decode(log);
      return {
        vestingAddress: vesting,
        beneficiaryAddress,
      };
    }
    default:
      throw new Error(`Unexpected contract ${log.address}`);
  }
}
