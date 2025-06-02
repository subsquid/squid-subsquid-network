import * as Gateway from './gateway'
import * as NetworkController from './network-controller'
import * as RewardsDistributor from './rewards-distributor'
import * as Router from './router'
import * as Staking from './staking'
import * as Token from './token'
import * as TemporaryHolding from './temporary-holding'
import * as Vesting from './vesting'
import * as Worker from './worker'

export const handlers = [
  ...NetworkController.handlers,
  ...RewardsDistributor.handlers,
  ...Staking.handlers,
  ...Token.handlers,
  ...Vesting.handlers,
  ...Worker.handlers,
  ...Gateway.handlers,
  ...Router.handlers,
  ...TemporaryHolding.handlers,
]
