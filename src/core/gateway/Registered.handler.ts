import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';
import { createAccount, createGatewayStake, unwrapAccount } from '../helpers/entities';
import { createAccountId, createGatewayOperatorId, createWorkerStatusId } from '../helpers/ids';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { Account, Gateway, GatewayStake, GatewayStatus, GatewayStatusChange } from '~/model';
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

    const stakeId = createGatewayOperatorId(event.gatewayOperator);
    const stakeDeferred = ctx.store.defer(GatewayStake, {
      id: stakeId,
    });

    const gatewayId = parsePeerId(event.peerId);

    return async () => {
      const account = await accountDeferred.getOrInsert((id) => createAccount(id));

      const stake = await stakeDeferred.getOrInsert(async (id) =>
        createGatewayStake(id, {
          owner: account,
          realOwner: unwrapAccount(account),
        }),
      );

      const gateway = new Gateway({
        id: gatewayId,
        status: GatewayStatus.UNKNOWN,
        createdAt: new Date(log.block.timestamp),
        owner: account,
        realOwner: unwrapAccount(account),
        stake,
        description: null,
        email: null,
        endpointUrl: null,
        name: null,
        website: null,
      });

      const statusChange = new GatewayStatusChange({
        id: createWorkerStatusId(gatewayId, log.block.l1BlockNumber),
        blockNumber: log.block.height,
        gateway,
        status: GatewayStatus.REGISTERED,
        timestamp: new Date(log.block.timestamp),
      });
      await ctx.store.insert(statusChange);

      gateway.status = statusChange.status;
      await ctx.store.upsert(gateway);

      ctx.log.info(`account(${gateway.owner.id}) registered gateway(${gatewayId})`);
    };
  },
});
