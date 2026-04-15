import {
  isContract,
  isLog,
  createHandler,
  network,
  STAKING_TEMPLATE_KEY,
  WORKER_REGISTRATION_TEMPLATE_KEY,
  REWARD_TREASURY_TEMPLATE_KEY,
} from '@subsquid-network/shared'
import * as Router from '@subsquid-network/shared/lib/abi/Router'

export const stakingSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.StakingSet.is(item.value)) return

  const { staking } = Router.events.StakingSet.decode(item.value)
  const blockHeight = item.value.block.height

  return async () => {
    ctx.templates.add(STAKING_TEMPLATE_KEY, staking, blockHeight)
    ctx.log.info(`token: staking contract set to ${staking}`)
  }
})

export const workerRegistrationSetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.WorkerRegistrationSet.is(item.value)) return

  const { workerRegistration } = Router.events.WorkerRegistrationSet.decode(item.value)
  const blockHeight = item.value.block.height

  return async () => {
    ctx.templates.add(WORKER_REGISTRATION_TEMPLATE_KEY, workerRegistration, blockHeight)
    ctx.log.info(`token: worker registration contract set to ${workerRegistration}`)
  }
})

export const rewardTreasurySetHandler = createHandler((ctx, item) => {
  if (!isContract(item, network.contracts.Router)) return
  if (!isLog(item)) return
  if (!Router.events.RewardTreasurySet.is(item.value)) return

  const { rewardTreasury } = Router.events.RewardTreasurySet.decode(item.value)
  const blockHeight = item.value.block.height

  return async () => {
    ctx.templates.add(REWARD_TREASURY_TEMPLATE_KEY, rewardTreasury, blockHeight)
    ctx.log.info(`token: reward treasury contract set to ${rewardTreasury}`)
  }
})
