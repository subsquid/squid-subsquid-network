import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './NetworkController.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AllowedVestedTargetUpdated: new LogEvent<([target: string, isAllowed: boolean] & {target: string, isAllowed: boolean})>(
        abi, '0x13077507c996c414a31510046627495d92322309f93e988a33cedb8108f2747f'
    ),
    BondAmountUpdated: new LogEvent<([bondAmount: bigint] & {bondAmount: bigint})>(
        abi, '0xa15246e54ef77ae7edbf99b267138a83931b938b03e9f853067299eddb4099a7'
    ),
    EpochLengthUpdated: new LogEvent<([epochLength: bigint] & {epochLength: bigint})>(
        abi, '0xbddf13f72535a30b09d184d523d014c36ebb18c3fcbdefca337707cd3a14731d'
    ),
    RewardCoefficientUpdated: new LogEvent<([coefficient: bigint] & {coefficient: bigint})>(
        abi, '0xd5eee2f0795409a39ce32b09109addf49185c076a0a1f860b71eef53f6859a15'
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
    StakingDeadlockUpdated: new LogEvent<([stakingDeadlock: bigint] & {stakingDeadlock: bigint})>(
        abi, '0x188ac85a2477b360c1360199e1cc6200bc87dc4e640848bb7fb10476d2850761'
    ),
    StoragePerWorkerInGbUpdated: new LogEvent<([storagePerWorkerInGb: bigint] & {storagePerWorkerInGb: bigint})>(
        abi, '0xf014b48e4917612e4346d196ad58d0a8a1c465b3cf12c32079bad77d0de205fa'
    ),
    TargetCapacityUpdated: new LogEvent<([target: bigint] & {target: bigint})>(
        abi, '0x9b533265fa62d942c09baea98ca07a219597ec12534a0e0ed84e45f40bdb3b33'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    bondAmount: new Func<[], {}, bigint>(
        abi, '0x80f323a7'
    ),
    epochLength: new Func<[], {}, bigint>(
        abi, '0x57d775f8'
    ),
    epochNumber: new Func<[], {}, bigint>(
        abi, '0xf4145a83'
    ),
    firstEpochBlock: new Func<[], {}, bigint>(
        abi, '0x578e2a85'
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
    isAllowedVestedTarget: new Func<[_: string], {}, boolean>(
        abi, '0x9425d1f4'
    ),
    nextEpoch: new Func<[], {}, bigint>(
        abi, '0xaea0e78b'
    ),
    renounceRole: new Func<[role: string, callerConfirmation: string], {role: string, callerConfirmation: string}, []>(
        abi, '0x36568abe'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    setAllowedVestedTarget: new Func<[target: string, isAllowed: boolean], {target: string, isAllowed: boolean}, []>(
        abi, '0x02ac6b6c'
    ),
    setBondAmount: new Func<[_bondAmount: bigint], {_bondAmount: bigint}, []>(
        abi, '0x28f9f3e6'
    ),
    setEpochLength: new Func<[_epochLength: bigint], {_epochLength: bigint}, []>(
        abi, '0x0d8d840b'
    ),
    setStakingDeadlock: new Func<[_newDeadlock: bigint], {_newDeadlock: bigint}, []>(
        abi, '0x6214e299'
    ),
    setStoragePerWorkerInGb: new Func<[_storagePerWorkerInGb: bigint], {_storagePerWorkerInGb: bigint}, []>(
        abi, '0x7e9d6b0a'
    ),
    setTargetCapacity: new Func<[target: bigint], {target: bigint}, []>(
        abi, '0xe10e9d60'
    ),
    setYearlyRewardCapCoefficient: new Func<[coefficient: bigint], {coefficient: bigint}, []>(
        abi, '0xbdf97dc9'
    ),
    stakingDeadlock: new Func<[], {}, bigint>(
        abi, '0x5b446c44'
    ),
    storagePerWorkerInGb: new Func<[], {}, bigint>(
        abi, '0x2b5d1529'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    targetCapacityGb: new Func<[], {}, bigint>(
        abi, '0x17395c74'
    ),
    yearlyRewardCapCoefficient: new Func<[], {}, bigint>(
        abi, '0x1cb34cb6'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    bondAmount(): Promise<bigint> {
        return this.eth_call(functions.bondAmount, [])
    }

    epochLength(): Promise<bigint> {
        return this.eth_call(functions.epochLength, [])
    }

    epochNumber(): Promise<bigint> {
        return this.eth_call(functions.epochNumber, [])
    }

    firstEpochBlock(): Promise<bigint> {
        return this.eth_call(functions.firstEpochBlock, [])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    isAllowedVestedTarget(arg0: string): Promise<boolean> {
        return this.eth_call(functions.isAllowedVestedTarget, [arg0])
    }

    nextEpoch(): Promise<bigint> {
        return this.eth_call(functions.nextEpoch, [])
    }

    stakingDeadlock(): Promise<bigint> {
        return this.eth_call(functions.stakingDeadlock, [])
    }

    storagePerWorkerInGb(): Promise<bigint> {
        return this.eth_call(functions.storagePerWorkerInGb, [])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    targetCapacityGb(): Promise<bigint> {
        return this.eth_call(functions.targetCapacityGb, [])
    }

    yearlyRewardCapCoefficient(): Promise<bigint> {
        return this.eth_call(functions.yearlyRewardCapCoefficient, [])
    }
}
