import { GatewayStake } from '~/model'

export function createGatewayStake(id: string, ownerId: string) {
  return new GatewayStake({
    id,
    ownerId,
    autoExtension: false,
    amount: 0n,
    computationUnits: 0n,
    locked: false,
  })
}
