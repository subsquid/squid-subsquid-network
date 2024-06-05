import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createAccount, unwrapAccount } from '../helpers/entities';
import { createAccountId, createGatewayOperatorId, createWorkerStatusId } from '../helpers/ids';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import {
  Account,
  Gateway,
  GatewayOperator,
  GatewayStatus,
  GatewayStatusChange,
  Settings,
} from '~/model';
import { parsePeerId } from '~/utils/misc';

export const handleRegistered = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      GatewayRegistry.events.Registered.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = GatewayRegistry.events.Registered.decode(log);

    const accountId = createAccountId(event.gatewayOperator);
    const accountDeferred = ctx.store.defer(Account, {
      id: accountId,
      relations: { owner: true },
    });

    const operatorId = createGatewayOperatorId(event.gatewayOperator);
    const operatorDeferred = ctx.store.defer(GatewayOperator, {
      id: operatorId,
    });

    const gatewayId = parsePeerId(event.peerId);
    const gatewayDeferred = ctx.store.defer(Gateway, gatewayId);

    ctx.queue.add(async () => {
      const account = await accountDeferred.getOrInsert((id) => createAccount(id));

      const operator = await operatorDeferred.getOrInsert(async (id) => {
        return new GatewayOperator({
          id,
          account,
          autoExtension: false,
        });
      });

      const gateway = await gatewayDeferred.getOrInsert((id) => {
        ctx.log.info(`created gateway(${id})`);

        return new Gateway({
          id,
          status: GatewayStatus.UNKNOWN,
          createdAt: new Date(log.block.timestamp),
        });
      });

      const statusChange = new GatewayStatusChange({
        id: createWorkerStatusId(gatewayId, log.block.l1BlockNumber),
        blockNumber: log.block.height,
        gateway,
        status: GatewayStatus.REGISTERED,
        timestamp: new Date(log.block.timestamp),
      });
      await ctx.store.insert(statusChange);

      gateway.operator = operator;
      gateway.owner = unwrapAccount(account);
      gateway.status = statusChange.status;
      await ctx.store.upsert(gateway);

      ctx.log.info(`account(${gateway.owner.id}) registered gateway(${gatewayId})`);
    });
  },
});
