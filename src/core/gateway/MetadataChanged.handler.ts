import { assertNotNull } from '@subsquid/evm-processor';

import { isContract, isLog, LogItem } from '../../item';
import { createHandler } from '../base';

import * as GatewayRegistry from '~/abi/GatewayRegistry';
import { network } from '~/config/network';
import { Gateway, GatewayStatus } from '~/model';
import { parseGatewayMetadata, parsePeerId } from '~/utils/misc';

export const handleMetadataChanged = createHandler({
  filter(_, item): item is LogItem {
    return (
      isContract(item, network.contracts.GatewayRegistry) &&
      isLog(item) &&
      GatewayRegistry.events.MetadataChanged.is(item.value)
    );
  },
  handle(ctx, { value: log }) {
    const event = GatewayRegistry.events.MetadataChanged.decode(log);

    const gatewayId = parsePeerId(event.peerId);
    const gatewayDeferred = ctx.store.defer(Gateway, {
      id: gatewayId,
      relations: { owner: true },
    });

    ctx.queue.add(async () => {
      const gateway = await gatewayDeferred.getOrFail();

      const metadata = parseGatewayMetadata(ctx, event.metadata);
      gateway.name = metadata.name;
      gateway.website = metadata.website;
      gateway.description = metadata.description;
      gateway.email = metadata.email;
      gateway.endpointUrl = metadata.endpointUrl;

      await ctx.store.upsert(gateway);

      ctx.log.info(`updated metadata of gateway(${gatewayId}) `);
    });
  },
});
