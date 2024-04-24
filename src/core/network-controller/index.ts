import { handleBondAmountUpdated } from './BondAmountUpdated.handler';
// import { handleDelegationLimitCoefficientUpdated } from './DelegationLimitCoefficienUpdated.handler';
import { handleEpochLengthUpdated } from './EpochLengthUpdated.handler';

export const handlers = [
  handleBondAmountUpdated,
  // handleDelegationLimitCoefficientUpdated,
  handleEpochLengthUpdated,
];
