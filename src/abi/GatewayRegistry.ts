import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './GatewayRegistry.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AllocatedCUs: new LogEvent<([gateway: string, peerId: string, workerIds: Array<bigint>, shares: Array<bigint>] & {gateway: string, peerId: string, workerIds: Array<bigint>, shares: Array<bigint>})>(
        abi, '0xa27699da150f8443c51cda13c28a1cbfb78ee3b4055de58197e770999fc23fbd'
    ),
    AutoextensionDisabled: new LogEvent<([gatewayOperator: string, lockEnd: bigint] & {gatewayOperator: string, lockEnd: bigint})>(
        abi, '0x17679fc77cdf7f6b7d2af4cb30497f3e81088fde6fdb20ca48d31372bc2af006'
    ),
    AutoextensionEnabled: new LogEvent<([gatewayOperator: string] & {gatewayOperator: string})>(
        abi, '0xeff5f78e20f1cd92a537c3cdbaeaea11ad293aace5d7262ed93f2f33b42a828f'
    ),
    AverageBlockTimeChanged: new LogEvent<([newBlockTime: bigint] & {newBlockTime: bigint})>(
        abi, '0x46a9c997a4d81c1f992b7ec20e34dfc97c0c67a86dc24f9ff1525718690bead3'
    ),
    DefaultStrategyChanged: new LogEvent<([strategy: string] & {strategy: string})>(
        abi, '0x84e184ce3e506721b995db9e77ad7527e97c83dd04bf98f5830508602bf837ad'
    ),
    GatewayAddressChanged: new LogEvent<([gatewayOperator: string, peerId: string, newAddress: string] & {gatewayOperator: string, peerId: string, newAddress: string})>(
        abi, '0x39cabfa8731da74e931aee9746250190051269d4d0c37ec9fb8276a32b1f6601'
    ),
    Initialized: new LogEvent<([version: bigint] & {version: bigint})>(
        abi, '0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2'
    ),
    ManaChanged: new LogEvent<([newCuPerSQD: bigint] & {newCuPerSQD: bigint})>(
        abi, '0xd48c454cdec818a86733db9fd6353a7b80d423e6a189ecac47703f9b5fa0801b'
    ),
    MaxGatewaysPerClusterChanged: new LogEvent<([newAmount: bigint] & {newAmount: bigint})>(
        abi, '0xf092d674fd06aab53c483be96eb202422ad493b452660e05adfe7f02aca08c1f'
    ),
    MetadataChanged: new LogEvent<([gatewayOperator: string, peerId: string, metadata: string] & {gatewayOperator: string, peerId: string, metadata: string})>(
        abi, '0x512a85d60acb1212e9e49cec8fc20daed3ed43977be6a8db77faf2c859e79e7f'
    ),
    MinStakeChanged: new LogEvent<([newAmount: bigint] & {newAmount: bigint})>(
        abi, '0x4d36185d86b6e1aefe7e3c72bbcf2329ea433a9dc2655a34739abe83a7ce74a0'
    ),
    Paused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'
    ),
    Registered: new LogEvent<([gatewayOperator: string, id: string, peerId: string] & {gatewayOperator: string, id: string, peerId: string})>(
        abi, '0xb9c7babb56df9f2da4a30811a6c778e4e68af88b72712d56cf62c5516e20e199'
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
    Staked: new LogEvent<([gatewayOperator: string, amount: bigint, lockStart: bigint, lockEnd: bigint, computationUnits: bigint] & {gatewayOperator: string, amount: bigint, lockStart: bigint, lockEnd: bigint, computationUnits: bigint})>(
        abi, '0x85362f63fb0e3050a216decb3a7297e2aaff6cbf5b22583c073118d7efc8a47b'
    ),
    StrategyAllowed: new LogEvent<([strategy: string, isAllowed: boolean] & {strategy: string, isAllowed: boolean})>(
        abi, '0x4e8e4980b101f6a8ebe870c7cf3767fb92422ef0c95a65b5cd750f9fce3c26e0'
    ),
    Unpaused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'
    ),
    Unregistered: new LogEvent<([gatewayOperator: string, peerId: string] & {gatewayOperator: string, peerId: string})>(
        abi, '0xa133cd95a0c9cb4f8272f86cd3bb48ba2bf54f982e60bba1618e1286925eddec'
    ),
    Unstaked: new LogEvent<([gatewayOperator: string, amount: bigint] & {gatewayOperator: string, amount: bigint})>(
        abi, '0x0f5bb82176feb1b5e747e28471aa92156a04d9f3ab9f45f28e2d704232b93f75'
    ),
    UsedStrategyChanged: new LogEvent<([gatewayOperator: string, strategy: string] & {gatewayOperator: string, strategy: string})>(
        abi, '0xe31c0bedb29ec4df4a7c3d8d8c0e4ad6bf3648906837d5400d61a94410c5e5bb'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    PAUSER_ROLE: new Func<[], {}, string>(
        abi, '0xe63ab1e9'
    ),
    addStake: new Func<[amount: bigint], {amount: bigint}, []>(
        abi, '0xeb4f16b5'
    ),
    allocateComputationUnits: new Func<[workerIds: Array<bigint>, cus: Array<bigint>], {workerIds: Array<bigint>, cus: Array<bigint>}, []>(
        abi, '0xb785a2e6'
    ),
    averageBlockTime: new Func<[], {}, bigint>(
        abi, '0x233dedf1'
    ),
    canUnstake: new Func<[operator: string], {operator: string}, boolean>(
        abi, '0x85f4498b'
    ),
    computationUnitsAmount: new Func<[amount: bigint, durationBlocks: bigint], {amount: bigint, durationBlocks: bigint}, bigint>(
        abi, '0x1c0fa1c8'
    ),
    computationUnitsAvailable: new Func<[peerId: string], {peerId: string}, bigint>(
        abi, '0x44d4bea8'
    ),
    defaultStrategy: new Func<[], {}, string>(
        abi, '0xfac5bb9b'
    ),
    disableAutoExtension: new Func<[], {}, []>(
        abi, '0xe6c7f21b'
    ),
    enableAutoExtension: new Func<[], {}, []>(
        abi, '0x13f117f2'
    ),
    gatewayByAddress: new Func<[_: string], {}, string>(
        abi, '0x429773fb'
    ),
    getActiveGateways: new Func<[pageNumber: bigint, perPage: bigint], {pageNumber: bigint, perPage: bigint}, Array<string>>(
        abi, '0x01a99356'
    ),
    getActiveGatewaysCount: new Func<[], {}, bigint>(
        abi, '0xd87113e5'
    ),
    getCluster: new Func<[peerId: string], {peerId: string}, Array<string>>(
        abi, '0x585a6a6d'
    ),
    getGateway: new Func<[peerId: string], {peerId: string}, ([operator: string, ownAddress: string, peerId: string, metadata: string] & {operator: string, ownAddress: string, peerId: string, metadata: string})>(
        abi, '0xdcefedaf'
    ),
    getMetadata: new Func<[peerId: string], {peerId: string}, string>(
        abi, '0x75734be8'
    ),
    getMyGateways: new Func<[operator: string], {operator: string}, Array<string>>(
        abi, '0x2c17a07f'
    ),
    getRoleAdmin: new Func<[role: string], {role: string}, string>(
        abi, '0x248a9ca3'
    ),
    getStake: new Func<[operator: string], {operator: string}, ([amount: bigint, lockStart: bigint, lockEnd: bigint, duration: bigint, autoExtension: boolean, oldCUs: bigint] & {amount: bigint, lockStart: bigint, lockEnd: bigint, duration: bigint, autoExtension: boolean, oldCUs: bigint})>(
        abi, '0x7a766460'
    ),
    getUsedStrategy: new Func<[peerId: string], {peerId: string}, string>(
        abi, '0x94f3c725'
    ),
    grantRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x2f2ff15d'
    ),
    hasRole: new Func<[role: string, account: string], {role: string, account: string}, boolean>(
        abi, '0x91d14854'
    ),
    initialize: new Func<[_token: string, _router: string], {_token: string, _router: string}, []>(
        abi, '0x485cc955'
    ),
    isStrategyAllowed: new Func<[strategy: string], {strategy: string}, boolean>(
        abi, '0x67c1def9'
    ),
    mana: new Func<[], {}, bigint>(
        abi, '0xbdb001a7'
    ),
    maxGatewaysPerCluster: new Func<[], {}, bigint>(
        abi, '0xbc9c0e62'
    ),
    minStake: new Func<[], {}, bigint>(
        abi, '0x375b3c0a'
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
    'register(bytes,string,address)': new Func<[peerId: string, metadata: string, gatewayAddress: string], {peerId: string, metadata: string, gatewayAddress: string}, []>(
        abi, '0x876ab349'
    ),
    'register(bytes,string)': new Func<[peerId: string, metadata: string], {peerId: string, metadata: string}, []>(
        abi, '0x92255fbf'
    ),
    'register(bytes[],string[],address[])': new Func<[peerId: Array<string>, metadata: Array<string>, gatewayAddress: Array<string>], {peerId: Array<string>, metadata: Array<string>, gatewayAddress: Array<string>}, []>(
        abi, '0xb1a7e279'
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
    setAverageBlockTime: new Func<[_newAverageBlockTime: bigint], {_newAverageBlockTime: bigint}, []>(
        abi, '0x3736d853'
    ),
    setGatewayAddress: new Func<[peerId: string, newAddress: string], {peerId: string, newAddress: string}, []>(
        abi, '0xdacfab0d'
    ),
    setIsStrategyAllowed: new Func<[strategy: string, isAllowed: boolean, isDefault: boolean], {strategy: string, isAllowed: boolean, isDefault: boolean}, []>(
        abi, '0x017a02c3'
    ),
    setMana: new Func<[_newMana: bigint], {_newMana: bigint}, []>(
        abi, '0x0def8b8a'
    ),
    setMaxGatewaysPerCluster: new Func<[_maxGatewaysPerCluster: bigint], {_maxGatewaysPerCluster: bigint}, []>(
        abi, '0x3abcf38c'
    ),
    setMetadata: new Func<[peerId: string, metadata: string], {peerId: string, metadata: string}, []>(
        abi, '0x0fe9fb66'
    ),
    setMinStake: new Func<[_minStake: bigint], {_minStake: bigint}, []>(
        abi, '0x8c80fd90'
    ),
    'stake(uint256,uint128)': new Func<[amount: bigint, durationBlocks: bigint], {amount: bigint, durationBlocks: bigint}, []>(
        abi, '0x7acfc9e2'
    ),
    'stake(uint256,uint128,bool)': new Func<[amount: bigint, durationBlocks: bigint, withAutoExtension: boolean], {amount: bigint, durationBlocks: bigint, withAutoExtension: boolean}, []>(
        abi, '0xe3fa31ed'
    ),
    staked: new Func<[operator: string], {operator: string}, bigint>(
        abi, '0x98807d84'
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
    'unregister(bytes)': new Func<[peerId: string], {peerId: string}, []>(
        abi, '0x27d6c032'
    ),
    'unregister(bytes[])': new Func<[peerId: Array<string>], {peerId: Array<string>}, []>(
        abi, '0xf586857a'
    ),
    unstake: new Func<[], {}, []>(
        abi, '0x2def6620'
    ),
    useStrategy: new Func<[strategy: string], {strategy: string}, []>(
        abi, '0xb8050a5d'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    PAUSER_ROLE(): Promise<string> {
        return this.eth_call(functions.PAUSER_ROLE, [])
    }

    averageBlockTime(): Promise<bigint> {
        return this.eth_call(functions.averageBlockTime, [])
    }

    canUnstake(operator: string): Promise<boolean> {
        return this.eth_call(functions.canUnstake, [operator])
    }

    computationUnitsAmount(amount: bigint, durationBlocks: bigint): Promise<bigint> {
        return this.eth_call(functions.computationUnitsAmount, [amount, durationBlocks])
    }

    computationUnitsAvailable(peerId: string): Promise<bigint> {
        return this.eth_call(functions.computationUnitsAvailable, [peerId])
    }

    defaultStrategy(): Promise<string> {
        return this.eth_call(functions.defaultStrategy, [])
    }

    gatewayByAddress(arg0: string): Promise<string> {
        return this.eth_call(functions.gatewayByAddress, [arg0])
    }

    getActiveGateways(pageNumber: bigint, perPage: bigint): Promise<Array<string>> {
        return this.eth_call(functions.getActiveGateways, [pageNumber, perPage])
    }

    getActiveGatewaysCount(): Promise<bigint> {
        return this.eth_call(functions.getActiveGatewaysCount, [])
    }

    getCluster(peerId: string): Promise<Array<string>> {
        return this.eth_call(functions.getCluster, [peerId])
    }

    getGateway(peerId: string): Promise<([operator: string, ownAddress: string, peerId: string, metadata: string] & {operator: string, ownAddress: string, peerId: string, metadata: string})> {
        return this.eth_call(functions.getGateway, [peerId])
    }

    getMetadata(peerId: string): Promise<string> {
        return this.eth_call(functions.getMetadata, [peerId])
    }

    getMyGateways(operator: string): Promise<Array<string>> {
        return this.eth_call(functions.getMyGateways, [operator])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    getStake(operator: string): Promise<([amount: bigint, lockStart: bigint, lockEnd: bigint, duration: bigint, autoExtension: boolean, oldCUs: bigint] & {amount: bigint, lockStart: bigint, lockEnd: bigint, duration: bigint, autoExtension: boolean, oldCUs: bigint})> {
        return this.eth_call(functions.getStake, [operator])
    }

    getUsedStrategy(peerId: string): Promise<string> {
        return this.eth_call(functions.getUsedStrategy, [peerId])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    isStrategyAllowed(strategy: string): Promise<boolean> {
        return this.eth_call(functions.isStrategyAllowed, [strategy])
    }

    mana(): Promise<bigint> {
        return this.eth_call(functions.mana, [])
    }

    maxGatewaysPerCluster(): Promise<bigint> {
        return this.eth_call(functions.maxGatewaysPerCluster, [])
    }

    minStake(): Promise<bigint> {
        return this.eth_call(functions.minStake, [])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    router(): Promise<string> {
        return this.eth_call(functions.router, [])
    }

    staked(operator: string): Promise<bigint> {
        return this.eth_call(functions.staked, [operator])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    token(): Promise<string> {
        return this.eth_call(functions.token, [])
    }
}
