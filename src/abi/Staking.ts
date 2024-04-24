import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './Staking.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Claimed: new LogEvent<([staker: string, amount: bigint, workerIds: Array<bigint>] & {staker: string, amount: bigint, workerIds: Array<bigint>})>(
        abi, '0xa6836ed9f6b0bfa430c6b744cac7cc781c2a5b5be98f6e7ca42d32fd16bc6af3'
    ),
    Deposited: new LogEvent<([worker: bigint, staker: string, amount: bigint] & {worker: bigint, staker: string, amount: bigint})>(
        abi, '0x1599c0fcf897af5babc2bfcf707f5dc050f841b044d97c3251ecec35b9abf80b'
    ),
    Distributed: new LogEvent<([epoch: bigint] & {epoch: bigint})>(
        abi, '0xddc9c30275a04c48091f24199f9c405765de34d979d6847f5b9798a57232d2e5'
    ),
    EpochsLockChanged: new LogEvent<([epochsLock: bigint] & {epochsLock: bigint})>(
        abi, '0x6d1a1e80fd96834b1293514ebab21ebac9637f9ad7ab1a533a05e4c6929bdd0a'
    ),
    MaxDelegationsChanged: new LogEvent<([maxDelegations: bigint] & {maxDelegations: bigint})>(
        abi, '0x8c59f6213d7200a03c81eac511632ea48656d94e2bc3b07730bab2e04f5f5286'
    ),
    Paused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'
    ),
    Rewarded: new LogEvent<([workerId: bigint, staker: string, amount: bigint] & {workerId: bigint, staker: string, amount: bigint})>(
        abi, '0x6d46424d7308d93179bbc5c8c01e098e8353dad13aff9809fd8a881a69feaa3a'
    ),
    RoleAdminChanged: new LogEvent<([role: string, previousAdminRole: string, newAdminRole: string] & {role: string, previousAdminRole: string, newAdminRole: string})>(
        abi, '0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff'
    ),
    RoleGranted: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'
    ),
    RoleRevoked: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b'
    ),
    Unpaused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'
    ),
    Withdrawn: new LogEvent<([worker: bigint, staker: string, amount: bigint] & {worker: bigint, staker: string, amount: bigint})>(
        abi, '0xcf7d23a3cbe4e8b36ff82fd1b05b1b17373dc7804b4ebbd6e2356716ef202372'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    PAUSER_ROLE: new Func<[], {}, string>(
        abi, '0xe63ab1e9'
    ),
    REWARDS_DISTRIBUTOR_ROLE: new Func<[], {}, string>(
        abi, '0xc34c2289'
    ),
    claim: new Func<[staker: string], {staker: string}, bigint>(
        abi, '0x1e83409a'
    ),
    claimable: new Func<[staker: string], {staker: string}, bigint>(
        abi, '0x402914f5'
    ),
    delegated: new Func<[worker: bigint], {worker: bigint}, bigint>(
        abi, '0x18e44a49'
    ),
    delegates: new Func<[staker: string], {staker: string}, Array<bigint>>(
        abi, '0x587cde1e'
    ),
    deposit: new Func<[worker: bigint, amount: bigint], {worker: bigint, amount: bigint}, []>(
        abi, '0xe2bbb158'
    ),
    distribute: new Func<[workers: Array<bigint>, amounts: Array<bigint>], {workers: Array<bigint>, amounts: Array<bigint>}, []>(
        abi, '0x8e1b57c5'
    ),
    epochsLockedAfterStake: new Func<[], {}, bigint>(
        abi, '0x31603b62'
    ),
    getDeposit: new Func<[staker: string, worker: bigint], {staker: string, worker: bigint}, ([depositAmount: bigint, withdrawAllowed: bigint] & {depositAmount: bigint, withdrawAllowed: bigint})>(
        abi, '0x2726b506'
    ),
    getRoleAdmin: new Func<[role: string], {role: string}, string>(
        abi, '0x248a9ca3'
    ),
    grantRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x2f2ff15d'
    ),
    hasRole: new Func<[role: string, account: string], {role: string, account: string}, boolean>(
        abi, '0x91d14854'
    ),
    lastEpochRewarded: new Func<[], {}, bigint>(
        abi, '0xd760cdd8'
    ),
    lockLengthBlocks: new Func<[], {}, bigint>(
        abi, '0xc7ad6dd9'
    ),
    maxDelegations: new Func<[], {}, bigint>(
        abi, '0x5612a838'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    renounceRole: new Func<[role: string, callerConfirmation: string], {role: string, callerConfirmation: string}, []>(
        abi, '0x36568abe'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    router: new Func<[], {}, string>(
        abi, '0xf887ea40'
    ),
    setEpochsLock: new Func<[_epochsLock: bigint], {_epochsLock: bigint}, []>(
        abi, '0xe03f56e4'
    ),
    setMaxDelegations: new Func<[_maxDelegations: bigint], {_maxDelegations: bigint}, []>(
        abi, '0xe2ef0024'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    token: new Func<[], {}, string>(
        abi, '0xfc0c546a'
    ),
    totalStakedPerWorker: new Func<[workers: Array<bigint>], {workers: Array<bigint>}, Array<bigint>>(
        abi, '0x5f2c3ffe'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    withdraw: new Func<[worker: bigint, amount: bigint], {worker: bigint, amount: bigint}, []>(
        abi, '0x441a3e70'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    PAUSER_ROLE(): Promise<string> {
        return this.eth_call(functions.PAUSER_ROLE, [])
    }

    REWARDS_DISTRIBUTOR_ROLE(): Promise<string> {
        return this.eth_call(functions.REWARDS_DISTRIBUTOR_ROLE, [])
    }

    claimable(staker: string): Promise<bigint> {
        return this.eth_call(functions.claimable, [staker])
    }

    delegated(worker: bigint): Promise<bigint> {
        return this.eth_call(functions.delegated, [worker])
    }

    delegates(staker: string): Promise<Array<bigint>> {
        return this.eth_call(functions.delegates, [staker])
    }

    epochsLockedAfterStake(): Promise<bigint> {
        return this.eth_call(functions.epochsLockedAfterStake, [])
    }

    getDeposit(staker: string, worker: bigint): Promise<([depositAmount: bigint, withdrawAllowed: bigint] & {depositAmount: bigint, withdrawAllowed: bigint})> {
        return this.eth_call(functions.getDeposit, [staker, worker])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    lastEpochRewarded(): Promise<bigint> {
        return this.eth_call(functions.lastEpochRewarded, [])
    }

    lockLengthBlocks(): Promise<bigint> {
        return this.eth_call(functions.lockLengthBlocks, [])
    }

    maxDelegations(): Promise<bigint> {
        return this.eth_call(functions.maxDelegations, [])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    router(): Promise<string> {
        return this.eth_call(functions.router, [])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    token(): Promise<string> {
        return this.eth_call(functions.token, [])
    }

    totalStakedPerWorker(workers: Array<bigint>): Promise<Array<bigint>> {
        return this.eth_call(functions.totalStakedPerWorker, [workers])
    }
}
