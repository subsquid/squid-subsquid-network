import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './VestingFactory.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Paused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'
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
    VestingCreated: new LogEvent<([vesting: string, beneficiary: string, startTimestamp: bigint, durationSeconds: bigint, expectedTotalAmount: bigint] & {vesting: string, beneficiary: string, startTimestamp: bigint, durationSeconds: bigint, expectedTotalAmount: bigint})>(
        abi, '0xba477ae50ac3a59d5a6eadd2b0775d90074a7d6bc7a737f2ae874e66dab607f1'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    PAUSER_ROLE: new Func<[], {}, string>(
        abi, '0xe63ab1e9'
    ),
    VESTING_CREATOR_ROLE: new Func<[], {}, string>(
        abi, '0xe9a7fb54'
    ),
    createVesting: new Func<[beneficiaryAddress: string, startTimestamp: bigint, durationSeconds: bigint, immediateReleaseBIP: bigint, expectedTotalAmount: bigint], {beneficiaryAddress: string, startTimestamp: bigint, durationSeconds: bigint, immediateReleaseBIP: bigint, expectedTotalAmount: bigint}, string>(
        abi, '0xc623c479'
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
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    token: new Func<[], {}, string>(
        abi, '0xfc0c546a'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    PAUSER_ROLE(): Promise<string> {
        return this.eth_call(functions.PAUSER_ROLE, [])
    }

    VESTING_CREATOR_ROLE(): Promise<string> {
        return this.eth_call(functions.VESTING_CREATOR_ROLE, [])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
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
}
