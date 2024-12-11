import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const functions = {
    cap: viewFun("0xff2ad8e4", "cap(uint256)", {"x": p.uint256}, p.uint256),
    capedStake: viewFun("0xebe88e2e", "capedStake(uint256)", {"workerId": p.uint256}, p.uint256),
    capedStakeAfterDelegation: viewFun("0x7385ddcb", "capedStakeAfterDelegation(uint256,int256)", {"workerId": p.uint256, "delegationAmount": p.int256}, p.uint256),
    router: viewFun("0xf887ea40", "router()", {}, p.address),
}

export class Contract extends ContractBase {

    cap(x: CapParams["x"]) {
        return this.eth_call(functions.cap, {x})
    }

    capedStake(workerId: CapedStakeParams["workerId"]) {
        return this.eth_call(functions.capedStake, {workerId})
    }

    capedStakeAfterDelegation(workerId: CapedStakeAfterDelegationParams["workerId"], delegationAmount: CapedStakeAfterDelegationParams["delegationAmount"]) {
        return this.eth_call(functions.capedStakeAfterDelegation, {workerId, delegationAmount})
    }

    router() {
        return this.eth_call(functions.router, {})
    }
}

/// Function types
export type CapParams = FunctionArguments<typeof functions.cap>
export type CapReturn = FunctionReturn<typeof functions.cap>

export type CapedStakeParams = FunctionArguments<typeof functions.capedStake>
export type CapedStakeReturn = FunctionReturn<typeof functions.capedStake>

export type CapedStakeAfterDelegationParams = FunctionArguments<typeof functions.capedStakeAfterDelegation>
export type CapedStakeAfterDelegationReturn = FunctionReturn<typeof functions.capedStakeAfterDelegation>

export type RouterParams = FunctionArguments<typeof functions.router>
export type RouterReturn = FunctionReturn<typeof functions.router>

