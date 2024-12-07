import { assertNotNull } from '@subsquid/evm-processor';

import { isContract, isLog, LogItem } from '../../item';
import { createHandlerOld } from '../base';
import { createWorkerStatusId } from '../helpers/ids';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { Gateway, GatewayStatus, GatewayStatusChange } from '~/model';
import { parsePeerId } from '~/utils/misc';

export const handleUnregistered = createHandlerOld({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      GatewayRegistry.events.Unregistered.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = GatewayRegistry.events.Unregistered.decode(log);

    const gatewayId = parsePeerId(event.peerId);
    const gatewayDeferred = ctx.store.defer(Gateway, {
      id: gatewayId,
      relations: { owner: true },
    });

    return async () => {
      const gateway = await gatewayDeferred.getOrFail();
      const owner = assertNotNull(gateway.owner);

      const statusChange = new GatewayStatusChange({
        id: createWorkerStatusId(gatewayId, log.block.height),
        blockNumber: log.block.height,
        gateway,
        status: GatewayStatus.DEREGISTERED,
        timestamp: new Date(log.block.timestamp),
      });
      await ctx.store.insert(statusChange);

      gateway.status = statusChange.status;
      await ctx.store.upsert(gateway);

      ctx.log.info(`account(${owner.id}) deregistered gateway(${gatewayId})`);
    };
  },
});
