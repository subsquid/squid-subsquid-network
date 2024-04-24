// import { isContract, isLog } from '../../item';
// import { LogItem } from '../../item';
// import { createHandler } from '../base';

// import * as NetworkController from '~/abi/NetworkController';
// import { network } from '~/config/network';
// import { Settings } from '~/model';

// export const handleDelegationLimitCoefficientUpdated = createHandler({
//   check(_, item): item is LogItem {
//     return (
//       isContract(item, network.contracts.NetworkController) &&
//       isLog(item) &&
//       NetworkController.events.DelegationLimitCoefficientInBPUpdated.is(item.value)
//     );
//   },
//   handle(ctx, { value: log }) {
//     const { newDelegationLimitCoefficientInBP } =
//       NetworkController.events.DelegationLimitCoefficientInBPUpdated.decode(log);

//     const settingsDeferred = ctx.store.defer(Settings, network.name);

//     ctx.queue.add(async () => {
//       const settings = await settingsDeferred.getOrFail();

//       settings.delegationLimitCoefficient = Number(newDelegationLimitCoefficientInBP) / 10_000;

//       await ctx.store.upsert(settings);

//       ctx.log.debug(`set delegation limit coefficient ${settings.delegationLimitCoefficient}`);
//     });
//   },
// });
