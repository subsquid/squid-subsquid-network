import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './SQD.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    allowance: new Func<[owner: string, spender: string], {owner: string, spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, value: bigint], {spender: string, value: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[account: string], {account: string}, bigint>(
        abi, '0x70a08231'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    isArbitrumEnabled: new Func<[], {}, number>(
        abi, '0x8e5f5ad1'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    registerTokenOnL2: new Func<[l2CustomTokenAddress: string, maxSubmissionCostForCustomGateway: bigint, maxSubmissionCostForRouter: bigint, maxGasForCustomGateway: bigint, maxGasForRouter: bigint, gasPriceBid: bigint, valueForGateway: bigint, valueForRouter: bigint, creditBackAddress: string], {l2CustomTokenAddress: string, maxSubmissionCostForCustomGateway: bigint, maxSubmissionCostForRouter: bigint, maxGasForCustomGateway: bigint, maxGasForRouter: bigint, gasPriceBid: bigint, valueForGateway: bigint, valueForRouter: bigint, creditBackAddress: string}, []>(
        abi, '0xfc792d8e'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[to: string, value: bigint], {to: string, value: bigint}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[from: string, to: string, value: bigint], {from: string, to: string, value: bigint}, boolean>(
        abi, '0x23b872dd'
    ),
}

export class Contract extends ContractBase {

    allowance(owner: string, spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [owner, spender])
    }

    balanceOf(account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [account])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    isArbitrumEnabled(): Promise<number> {
        return this.eth_call(functions.isArbitrumEnabled, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
