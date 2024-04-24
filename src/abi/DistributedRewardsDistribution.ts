import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './DistributedRewardsDistribution.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approved: new LogEvent<([who: string, fromBlock: bigint, toBlock: bigint, commitment: string] & {who: string, fromBlock: bigint, toBlock: bigint, commitment: string})>(
        abi, '0x1718a64c060e83f86c815c1c1c305b016fd419f5d150962d0d6405761e74c5e4'
    ),
    ApprovesRequiredChanged: new LogEvent<([newApprovesRequired: bigint] & {newApprovesRequired: bigint})>(
        abi, '0x82128e565cfc8353e79f542d7a277dfa675daed9c90a8b5321cc0363ff8a7370'
    ),
    Claimed: new LogEvent<([by: string, worker: bigint, amount: bigint] & {by: string, worker: bigint, amount: bigint})>(
        abi, '0x987d620f307ff6b94d58743cb7a7509f24071586a77759b77c2d4e29f75a2f9a'
    ),
    Distributed: new LogEvent<([fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, stakerRewards: Array<bigint>] & {fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, stakerRewards: Array<bigint>})>(
        abi, '0xa4a6b2187ef1354bf92bcc14dc28e999e5ecb37642caa1a28205659068a104fa'
    ),
    DistributorAdded: new LogEvent<([distributor: string] & {distributor: string})>(
        abi, '0xddbf200aa634dc3fb81cfd68583dd1040d1c751d335e1d86b631bde3e977fea8'
    ),
    DistributorRemoved: new LogEvent<([distributor: string] & {distributor: string})>(
        abi, '0x126174f6cf49c81cdb4a9214c6b8f037bef55b4ec31e4fc776cea2a1c8a88d59'
    ),
    NewCommitment: new LogEvent<([who: string, fromBlock: bigint, toBlock: bigint, commitment: string] & {who: string, fromBlock: bigint, toBlock: bigint, commitment: string})>(
        abi, '0x3d0e20f31408b190e11fe8ac40c73e8aca970b3f47c98f626c110d9fe0199707'
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
    RoundRobinBlocksChanged: new LogEvent<([newRoundRobinBlocks: bigint] & {newRoundRobinBlocks: bigint})>(
        abi, '0xe3af6ab99586802d1ac3592654adaba57091ee99ae93a64a092c813552591aab'
    ),
    Unpaused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'
    ),
    WindowSizeChanged: new LogEvent<([newWindowSize: bigint] & {newWindowSize: bigint})>(
        abi, '0xea307e5ee57372fa76a40fce652eb46a4f9fb1d64e42c3af1128a56729d30f65'
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
    REWARDS_TREASURY_ROLE: new Func<[], {}, string>(
        abi, '0xb5b06781'
    ),
    addDistributor: new Func<[distributor: string], {distributor: string}, []>(
        abi, '0x7250e224'
    ),
    alreadyApproved: new Func<[commitment: string, distributor: string], {commitment: string, distributor: string}, boolean>(
        abi, '0x406e3090'
    ),
    approve: new Func<[fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, _stakerRewards: Array<bigint>], {fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, _stakerRewards: Array<bigint>}, []>(
        abi, '0x565b756a'
    ),
    approves: new Func<[fromBlock: bigint, toBlock: bigint], {fromBlock: bigint, toBlock: bigint}, number>(
        abi, '0x773b68c9'
    ),
    canApprove: new Func<[who: string, fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, _stakerRewards: Array<bigint>], {who: string, fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, _stakerRewards: Array<bigint>}, boolean>(
        abi, '0x42bef350'
    ),
    canCommit: new Func<[who: string], {who: string}, boolean>(
        abi, '0xb278e358'
    ),
    claim: new Func<[who: string], {who: string}, bigint>(
        abi, '0x1e83409a'
    ),
    claimable: new Func<[who: string], {who: string}, bigint>(
        abi, '0x402914f5'
    ),
    commit: new Func<[fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, _stakerRewards: Array<bigint>], {fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, _stakerRewards: Array<bigint>}, []>(
        abi, '0x6957bc60'
    ),
    commitments: new Func<[fromBlock: bigint, toBlock: bigint], {fromBlock: bigint, toBlock: bigint}, string>(
        abi, '0xd13e2e60'
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
    lastBlockRewarded: new Func<[], {}, bigint>(
        abi, '0xeadf1f39'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    removeDistributor: new Func<[distributor: string], {distributor: string}, []>(
        abi, '0x57c1f9e2'
    ),
    renounceRole: new Func<[role: string, callerConfirmation: string], {role: string, callerConfirmation: string}, []>(
        abi, '0x36568abe'
    ),
    requiredApproves: new Func<[], {}, bigint>(
        abi, '0x75ddfa41'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    roundRobinBlocks: new Func<[], {}, bigint>(
        abi, '0x75a32da6'
    ),
    router: new Func<[], {}, string>(
        abi, '0xf887ea40'
    ),
    setApprovesRequired: new Func<[_approvesRequired: bigint], {_approvesRequired: bigint}, []>(
        abi, '0x6a0bb81c'
    ),
    setRoundRobinBlocks: new Func<[_roundRobinBlocks: bigint], {_roundRobinBlocks: bigint}, []>(
        abi, '0x0d6cf7b0'
    ),
    setWindowSize: new Func<[_windowSize: bigint], {_windowSize: bigint}, []>(
        abi, '0xaaabc315'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    windowSize: new Func<[], {}, bigint>(
        abi, '0x8a14117a'
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

    REWARDS_TREASURY_ROLE(): Promise<string> {
        return this.eth_call(functions.REWARDS_TREASURY_ROLE, [])
    }

    alreadyApproved(commitment: string, distributor: string): Promise<boolean> {
        return this.eth_call(functions.alreadyApproved, [commitment, distributor])
    }

    approves(fromBlock: bigint, toBlock: bigint): Promise<number> {
        return this.eth_call(functions.approves, [fromBlock, toBlock])
    }

    canApprove(who: string, fromBlock: bigint, toBlock: bigint, recipients: Array<bigint>, workerRewards: Array<bigint>, _stakerRewards: Array<bigint>): Promise<boolean> {
        return this.eth_call(functions.canApprove, [who, fromBlock, toBlock, recipients, workerRewards, _stakerRewards])
    }

    canCommit(who: string): Promise<boolean> {
        return this.eth_call(functions.canCommit, [who])
    }

    claimable(who: string): Promise<bigint> {
        return this.eth_call(functions.claimable, [who])
    }

    commitments(fromBlock: bigint, toBlock: bigint): Promise<string> {
        return this.eth_call(functions.commitments, [fromBlock, toBlock])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    lastBlockRewarded(): Promise<bigint> {
        return this.eth_call(functions.lastBlockRewarded, [])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    requiredApproves(): Promise<bigint> {
        return this.eth_call(functions.requiredApproves, [])
    }

    roundRobinBlocks(): Promise<bigint> {
        return this.eth_call(functions.roundRobinBlocks, [])
    }

    router(): Promise<string> {
        return this.eth_call(functions.router, [])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    windowSize(): Promise<bigint> {
        return this.eth_call(functions.windowSize, [])
    }
}
