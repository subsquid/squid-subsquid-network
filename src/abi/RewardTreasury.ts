import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './RewardTreasury.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Claimed: new LogEvent<([by: string, receiver: string, amount: bigint] & {by: string, receiver: string, amount: bigint})>(
        abi, '0xf7a40077ff7a04c7e61f6f26fb13774259ddf1b6bce9ecf26a8276cdd3992683'
    ),
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
    WhitelistedDistributorSet: new LogEvent<([distributor: string, isWhitelisted: boolean] & {distributor: string, isWhitelisted: boolean})>(
        abi, '0x79420e21e204bc31262bc1cf3cde02641e2f25da501557d80f399b32dad50c17'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    PAUSER_ROLE: new Func<[], {}, string>(
        abi, '0xe63ab1e9'
    ),
    claim: new Func<[rewardDistribution: string], {rewardDistribution: string}, []>(
        abi, '0x1e83409a'
    ),
    claimFor: new Func<[rewardDistribution: string, receiver: string], {rewardDistribution: string, receiver: string}, []>(
        abi, '0xb4ba9e11'
    ),
    claimable: new Func<[rewardDistribution: string, sender: string], {rewardDistribution: string, sender: string}, bigint>(
        abi, '0xd4570c1c'
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
    isWhitelistedDistributor: new Func<[_: string], {}, boolean>(
        abi, '0xcbccc3e0'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    reclaimFunds: new Func<[], {}, []>(
        abi, '0xcce4bd52'
    ),
    renounceRole: new Func<[role: string, callerConfirmation: string], {role: string, callerConfirmation: string}, []>(
        abi, '0x36568abe'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    rewardToken: new Func<[], {}, string>(
        abi, '0xf7c618c1'
    ),
    setWhitelistedDistributor: new Func<[distributor: string, isWhitelisted: boolean], {distributor: string, isWhitelisted: boolean}, []>(
        abi, '0xb53c69b6'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
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

    claimable(rewardDistribution: string, sender: string): Promise<bigint> {
        return this.eth_call(functions.claimable, [rewardDistribution, sender])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    isWhitelistedDistributor(arg0: string): Promise<boolean> {
        return this.eth_call(functions.isWhitelistedDistributor, [arg0])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    rewardToken(): Promise<string> {
        return this.eth_call(functions.rewardToken, [])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }
}
