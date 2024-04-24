import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createAccount } from '../helpers/entities';
import { createAccountId } from '../helpers/ids';

import * as VestingFactory from '~/abi/VestingFactory';
import { network } from '~/config/network';
import { Account, AccountType } from '~/model';

export const handleVestingCreated = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.VestingFactory) &&
      isLog(item) &&
      VestingFactory.events.VestingCreated.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const { vesting: vestingAddress, beneficiary } =
      VestingFactory.events.VestingCreated.decode(log);

    const ownerDeferred = ctx.store.defer(Account, createAccountId(beneficiary));
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
