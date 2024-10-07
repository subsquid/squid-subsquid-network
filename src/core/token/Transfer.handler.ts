import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createAccount } from '../helpers/entities';
import { createAccountId } from '../helpers/ids';

import * as SQD from '~/abi/SQD';
import { network } from '~/config/network';
import { Account, Transfer, AccountTransfer, TransferDirection, AccountType } from '~/model';
import { toHumanSQD } from '~/utils/misc';

export const handleTransfer = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.SQD) && isLog(item) && SQD.events.Transfer.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = SQD.events.Transfer.decode(log);

    const fromId = createAccountId(event.from);
    const fromDeferred = ctx.store.defer(Account, fromId);

    const toId = createAccountId(event.to);
    const toDeferred = ctx.store.defer(Account, toId);

    return async () => {
      const from = await fromDeferred.getOrInsert((id) => {
        ctx.log.info(`created account(${id})`);
        return createAccount(id, { type: AccountType.USER });
      });
      const to = await toDeferred.getOrInsert((id) => {
        ctx.log.info(`created account(${id})`);
        return createAccount(id, { type: AccountType.USER });
      });

      if (from !== to) {
        from.balance -= event.value;
        to.balance += event.value;

        await ctx.store.upsert([from, to]);
      }

      const transfer = new Transfer({
        id: log.id,
        from: from,
        to: to,
        blockNumber: log.block.height,
        amount: event.value,
        timestamp: new Date(log.block.timestamp),
      });
      await ctx.store.insert(transfer);

      await ctx.store.insert([
        new AccountTransfer({
          id: `${transfer.id}-from`,
          direction: TransferDirection.FROM,
          account: from,
          transfer,
        }),
        new AccountTransfer({
          id: `${transfer.id}-to`,
          direction: TransferDirection.TO,
          account: to,
          transfer,
        }),
      ]);

      ctx.log.info(
        `account(${from.id}) transferred ${toHumanSQD(transfer.amount)} to account(${to.id})`,
      );
    };
  },
});
