import { GatewayStake } from '~/model'

export function createGatewayStake(id: string, owner: string) {
  return new GatewayStake({
    id,
    owner,
    autoExtension: false,
    amount: 0n,
    computationUnits: 0n,
    locked: false,
  })
}
