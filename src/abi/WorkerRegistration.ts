import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './WorkerRegistration.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    ExcessiveBondReturned: new LogEvent<([workerId: bigint, amount: bigint] & {workerId: bigint, amount: bigint})>(
        abi, '0x54ebfb2891f338e31ae38698df33da34d539ea1aa57fa0a1900a3b9d845d4f54'
    ),
    MetadataUpdated: new LogEvent<([workerId: bigint, metadata: string] & {workerId: bigint, metadata: string})>(
        abi, '0x459157ba24c7ab9878b165ef465fa6ae2ab42bcd8445f576be378768b0c47309'
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
    WorkerDeregistered: new LogEvent<([workerId: bigint, account: string, deregistedAt: bigint] & {workerId: bigint, account: string, deregistedAt: bigint})>(
        abi, '0x4a7ca6c9178181481ac5c6e9ed0965213ae489c4aaf53323bd5e1f318a9d77c3'
    ),
    WorkerRegistered: new LogEvent<([workerId: bigint, peerId: string, registrar: string, registeredAt: bigint, metadata: string] & {workerId: bigint, peerId: string, registrar: string, registeredAt: bigint, metadata: string})>(
        abi, '0xa7a0c37f13c7accf7ec7771a2531c06e0183a37162a8e036039b241eab784156'
    ),
    WorkerWithdrawn: new LogEvent<([workerId: bigint, account: string] & {workerId: bigint, account: string})>(
        abi, '0xb6ee3a0ef8982f0f296a13a075fe56e5fd8c1bc2282a3c5b54f12d514ed7a956'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    PAUSER_ROLE: new Func<[], {}, string>(
        abi, '0xe63ab1e9'
    ),
    SQD: new Func<[], {}, string>(
        abi, '0x6aa54679'
    ),
    bondAmount: new Func<[], {}, bigint>(
        abi, '0x80f323a7'
    ),
    deregister: new Func<[peerId: string], {peerId: string}, []>(
        abi, '0xb4d0a564'
    ),
    epochLength: new Func<[], {}, bigint>(
        abi, '0x57d775f8'
    ),
    getActiveWorkerCount: new Func<[], {}, bigint>(
        abi, '0x3e556827'
    ),
    getActiveWorkerIds: new Func<[], {}, Array<bigint>>(
        abi, '0xc0a0d6cf'
    ),
    getActiveWorkers: new Func<[], {}, Array<([creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string] & {creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string})>>(
        abi, '0x393bc3d9'
    ),
    getAllWorkersCount: new Func<[], {}, bigint>(
        abi, '0xf905aaf6'
    ),
    getMetadata: new Func<[peerId: string], {peerId: string}, string>(
        abi, '0x75734be8'
    ),
    getOwnedWorkers: new Func<[owner: string], {owner: string}, Array<bigint>>(
        abi, '0x75b80f11'
    ),
    getRoleAdmin: new Func<[role: string], {role: string}, string>(
        abi, '0x248a9ca3'
    ),
    getWorker: new Func<[workerId: bigint], {workerId: bigint}, ([creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string] & {creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string})>(
        abi, '0xa39dbdb9'
    ),
    grantRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x2f2ff15d'
    ),
    hasRole: new Func<[role: string, account: string], {role: string, account: string}, boolean>(
        abi, '0x91d14854'
    ),
    isWorkerActive: new Func<[workerId: bigint], {workerId: bigint}, boolean>(
        abi, '0xb036482f'
    ),
    lockPeriod: new Func<[], {}, bigint>(
        abi, '0x3fd8b02f'
    ),
    nextEpoch: new Func<[], {}, bigint>(
        abi, '0xaea0e78b'
    ),
    nextWorkerId: new Func<[], {}, bigint>(
        abi, '0xc84a4922'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    'register(bytes)': new Func<[peerId: string], {peerId: string}, []>(
        abi, '0x82fbdc9c'
    ),
    'register(bytes,string)': new Func<[peerId: string, metadata: string], {peerId: string, metadata: string}, []>(
        abi, '0x92255fbf'
    ),
    renounceRole: new Func<[role: string, callerConfirmation: string], {role: string, callerConfirmation: string}, []>(
        abi, '0x36568abe'
    ),
    returnExcessiveBond: new Func<[peerId: string], {peerId: string}, []>(
        abi, '0xe4e33692'
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
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    updateMetadata: new Func<[peerId: string, metadata: string], {peerId: string, metadata: string}, []>(
        abi, '0xddc651c3'
    ),
    withdraw: new Func<[peerId: string], {peerId: string}, []>(
        abi, '0x0968f264'
    ),
    workerIds: new Func<[peerId: string], {peerId: string}, bigint>(
        abi, '0x7a39cb2b'
    ),
    workers: new Func<[_: bigint], {}, ([creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string] & {creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string})>(
        abi, '0xf1a22dc2'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    PAUSER_ROLE(): Promise<string> {
        return this.eth_call(functions.PAUSER_ROLE, [])
    }

    SQD(): Promise<string> {
        return this.eth_call(functions.SQD, [])
    }

    bondAmount(): Promise<bigint> {
        return this.eth_call(functions.bondAmount, [])
    }

    epochLength(): Promise<bigint> {
        return this.eth_call(functions.epochLength, [])
    }

    getActiveWorkerCount(): Promise<bigint> {
        return this.eth_call(functions.getActiveWorkerCount, [])
    }

    getActiveWorkerIds(): Promise<Array<bigint>> {
        return this.eth_call(functions.getActiveWorkerIds, [])
    }

    getActiveWorkers(): Promise<Array<([creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string] & {creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string})>> {
        return this.eth_call(functions.getActiveWorkers, [])
    }

    getAllWorkersCount(): Promise<bigint> {
        return this.eth_call(functions.getAllWorkersCount, [])
    }

    getMetadata(peerId: string): Promise<string> {
        return this.eth_call(functions.getMetadata, [peerId])
    }

    getOwnedWorkers(owner: string): Promise<Array<bigint>> {
        return this.eth_call(functions.getOwnedWorkers, [owner])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    getWorker(workerId: bigint): Promise<([creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string] & {creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string})> {
        return this.eth_call(functions.getWorker, [workerId])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    isWorkerActive(workerId: bigint): Promise<boolean> {
        return this.eth_call(functions.isWorkerActive, [workerId])
    }

    lockPeriod(): Promise<bigint> {
        return this.eth_call(functions.lockPeriod, [])
    }

    nextEpoch(): Promise<bigint> {
        return this.eth_call(functions.nextEpoch, [])
    }

    nextWorkerId(): Promise<bigint> {
        return this.eth_call(functions.nextWorkerId, [])
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

    workerIds(peerId: string): Promise<bigint> {
        return this.eth_call(functions.workerIds, [peerId])
    }

    workers(arg0: bigint): Promise<([creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string] & {creator: string, peerId: string, bond: bigint, registeredAt: bigint, deregisteredAt: bigint, metadata: string})> {
        return this.eth_call(functions.workers, [arg0])
    }
}
