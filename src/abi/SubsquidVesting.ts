import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ERC20Released: event("0xc0e523490dd523c33b1878c9eb14ff46991e3f5b2cd33710918618f2a39cba1b", {"token": indexed(p.address), "amount": p.uint256}),
    EtherReleased: event("0xda9d4e5f101b8b9b1c5b76d0c5a9f7923571acfc02376aa076b75a8c080c956b", {"amount": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
}

export const functions = {
    SQD: fun("0x6aa54679", {}, p.address),
    balanceOf: fun("0x70a08231", {"token": p.address}, p.uint256),
    depositedIntoProtocol: fun("0x23144c82", {}, p.uint256),
    duration: fun("0x0fb5a6b4", {}, p.uint256),
    end: fun("0xefbe1c1c", {}, p.uint256),
    "execute(address,bytes)": fun("0x1cff79cd", {"to": p.address, "data": p.bytes}, ),
    "execute(address,bytes,uint256)": fun("0xa04a0908", {"to": p.address, "data": p.bytes, "requiredApprove": p.uint256}, p.bytes),
    expectedTotalAmount: fun("0xa7190da5", {}, p.uint256),
    immediateReleaseBIP: fun("0xd13d0f2c", {}, p.uint256),
    owner: fun("0x8da5cb5b", {}, p.address),
    "releasable(address)": fun("0xa3f8eace", {"token": p.address}, p.uint256),
    "releasable()": fun("0xfbccedae", {}, p.uint256),
    "release(address)": fun("0x19165587", {"token": p.address}, ),
    "release()": fun("0x86d1a69f", {}, ),
    "released()": fun("0x96132521", {}, p.uint256),
    "released(address)": fun("0x9852595c", {"token": p.address}, p.uint256),
    renounceOwnership: fun("0x715018a6", {}, ),
    router: fun("0xf887ea40", {}, p.address),
    start: fun("0xbe9a6555", {}, p.uint256),
    transferOwnership: fun("0xf2fde38b", {"newOwner": p.address}, ),
    "vestedAmount(uint64)": fun("0x0a17b06b", {"timestamp": p.uint64}, p.uint256),
    "vestedAmount(address,uint64)": fun("0x810ec23b", {"token": p.address, "timestamp": p.uint64}, p.uint256),
}

export class Contract extends ContractBase {

    SQD() {
        return this.eth_call(functions.SQD, {})
    }

    balanceOf(token: BalanceOfParams["token"]) {
        return this.eth_call(functions.balanceOf, {token})
    }

    depositedIntoProtocol() {
        return this.eth_call(functions.depositedIntoProtocol, {})
    }

    duration() {
        return this.eth_call(functions.duration, {})
    }

    end() {
        return this.eth_call(functions.end, {})
    }

    expectedTotalAmount() {
        return this.eth_call(functions.expectedTotalAmount, {})
    }

    immediateReleaseBIP() {
        return this.eth_call(functions.immediateReleaseBIP, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    "releasable(address)"(token: ReleasableParams_0["token"]) {
        return this.eth_call(functions["releasable(address)"], {token})
    }

    "releasable()"() {
        return this.eth_call(functions["releasable()"], {})
    }

    "released()"() {
        return this.eth_call(functions["released()"], {})
    }

    "released(address)"(token: ReleasedParams_1["token"]) {
        return this.eth_call(functions["released(address)"], {token})
    }

    router() {
        return this.eth_call(functions.router, {})
    }

    start() {
        return this.eth_call(functions.start, {})
    }

    "vestedAmount(uint64)"(timestamp: VestedAmountParams_0["timestamp"]) {
        return this.eth_call(functions["vestedAmount(uint64)"], {timestamp})
    }

    "vestedAmount(address,uint64)"(token: VestedAmountParams_1["token"], timestamp: VestedAmountParams_1["timestamp"]) {
        return this.eth_call(functions["vestedAmount(address,uint64)"], {token, timestamp})
    }
}

/// Event types
export type ERC20ReleasedEventArgs = EParams<typeof events.ERC20Released>
export type EtherReleasedEventArgs = EParams<typeof events.EtherReleased>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type SQDParams = FunctionArguments<typeof functions.SQD>
export type SQDReturn = FunctionReturn<typeof functions.SQD>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type DepositedIntoProtocolParams = FunctionArguments<typeof functions.depositedIntoProtocol>
export type DepositedIntoProtocolReturn = FunctionReturn<typeof functions.depositedIntoProtocol>

export type DurationParams = FunctionArguments<typeof functions.duration>
export type DurationReturn = FunctionReturn<typeof functions.duration>

export type EndParams = FunctionArguments<typeof functions.end>
export type EndReturn = FunctionReturn<typeof functions.end>

export type ExecuteParams_0 = FunctionArguments<typeof functions["execute(address,bytes)"]>
export type ExecuteReturn_0 = FunctionReturn<typeof functions["execute(address,bytes)"]>

export type ExecuteParams_1 = FunctionArguments<typeof functions["execute(address,bytes,uint256)"]>
export type ExecuteReturn_1 = FunctionReturn<typeof functions["execute(address,bytes,uint256)"]>

export type ExpectedTotalAmountParams = FunctionArguments<typeof functions.expectedTotalAmount>
export type ExpectedTotalAmountReturn = FunctionReturn<typeof functions.expectedTotalAmount>

export type ImmediateReleaseBIPParams = FunctionArguments<typeof functions.immediateReleaseBIP>
export type ImmediateReleaseBIPReturn = FunctionReturn<typeof functions.immediateReleaseBIP>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type ReleasableParams_0 = FunctionArguments<typeof functions["releasable(address)"]>
export type ReleasableReturn_0 = FunctionReturn<typeof functions["releasable(address)"]>

export type ReleasableParams_1 = FunctionArguments<typeof functions["releasable()"]>
export type ReleasableReturn_1 = FunctionReturn<typeof functions["releasable()"]>

export type ReleaseParams_0 = FunctionArguments<typeof functions["release(address)"]>
export type ReleaseReturn_0 = FunctionReturn<typeof functions["release(address)"]>

export type ReleaseParams_1 = FunctionArguments<typeof functions["release()"]>
export type ReleaseReturn_1 = FunctionReturn<typeof functions["release()"]>

export type ReleasedParams_0 = FunctionArguments<typeof functions["released()"]>
export type ReleasedReturn_0 = FunctionReturn<typeof functions["released()"]>

export type ReleasedParams_1 = FunctionArguments<typeof functions["released(address)"]>
export type ReleasedReturn_1 = FunctionReturn<typeof functions["released(address)"]>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RouterParams = FunctionArguments<typeof functions.router>
export type RouterReturn = FunctionReturn<typeof functions.router>

export type StartParams = FunctionArguments<typeof functions.start>
export type StartReturn = FunctionReturn<typeof functions.start>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type VestedAmountParams_0 = FunctionArguments<typeof functions["vestedAmount(uint64)"]>
export type VestedAmountReturn_0 = FunctionReturn<typeof functions["vestedAmount(uint64)"]>

export type VestedAmountParams_1 = FunctionArguments<typeof functions["vestedAmount(address,uint64)"]>
export type VestedAmountReturn_1 = FunctionReturn<typeof functions["vestedAmount(address,uint64)"]>

