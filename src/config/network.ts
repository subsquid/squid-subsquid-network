import { assertNotNull } from '@subsquid/evm-processor';

export type ContractConfig = {
  address: string;
  range: {
    from: number;
    to?: number;
  };
};

export type NetworkConfig = {
  name: string;
  contracts: {
    SQD: ContractConfig;
    Router: ContractConfig;
    VestingFactory: ContractConfig;
    RewardsDistribution: ContractConfig;
    GatewayRegistry: ContractConfig;
    Multicall3: ContractConfig;
    SoftCap: ContractConfig;
    TemporaryHoldingFactory: ContractConfig;
  };
  range: {
    from: number;
    to?: number;
  };
};

function getNetworkConfig(): NetworkConfig {
  const name = assertNotNull(process.env.NETWORK);

  switch (name) {
    case 'mainnet':
      return {
        name,
        contracts: {
          SQD: {
            address: '0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1',
            range: { from: 0 },
          },
          Router: {
            address: '0x67f56d27dab93eeb07f6372274aca277f49da941',
            range: { from: 0 },
          },
          RewardsDistribution: {
            address: '0x4de282bd18ae4987b3070f4d5ef8c80756362aea',
            range: { from: 0 },
          },
          GatewayRegistry: {
            address: '0x8a90a1ce5fa8cf71de9e6f76b7d3c0b72feb8c4b',
            range: { from: 0 },
          },
          Multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            range: { from: 0 },
          },
          SoftCap: {
            address: '0x0eb27b1cbba04698dd7ce0f2364584d33a616545',
            range: { from: 0 },
          },
          VestingFactory: {
            address: '0x1f8f83cd76baeca1cb5c064ad59203c82b4e4ece',
            range: { from: 0 },
          },
          TemporaryHoldingFactory: {
            address: '0x14926ebf05a904b8e2e2bf05c10ecca9a54d8d0d',
            range: { from: 0 },
          },
        },
        range: { from: 194_120_655 },
      };
    case 'tethys':
      return {
        name: 'testnet',
        contracts: {
          SQD: {
            address: '0x24f9C46d86c064a6FA2a568F918fe62fC6917B3c',
            range: { from: 0 },
          },
          Router: {
            address: '0xd2093610c5d27c201cd47bcf1df4071610114b64',
            range: { from: 0 },
          },
          RewardsDistribution: {
            address: '0x68f9fe3504652360aff430df198e1cb7b2dcfd57',
            range: { from: 0 },
          },
          GatewayRegistry: {
            address: '0xab46f688aba4fcd1920f21e9bd16b229316d8b0a',
            range: { from: 0 },
          },
          Multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            range: { from: 0 },
          },
          SoftCap: {
            address: '0x52f31c9c019f840a9c0e74f66acc95455b254bea',
            range: { from: 0 },
          },
          VestingFactory: {
            address: '0x0ed5fb811167de1928322a0fa30ed7f3c8c370ca',
            range: { from: 0 },
          },
          TemporaryHoldingFactory: {
            address: '0x5eb3C647A423bfB100765Cbf0201B5748bbe7BD7',
            range: { from: 0 },
          },
        },
        range: { from: 6_000_000 },
      };
    default:
      throw new Error(`Unknown network: ${name}`);
  }
}

export const network = getNetworkConfig();

// function parseAddress(val: string | undefined, name: string) {
//   assert(val, `address for contract ${name} is missing`);

//   const [address, from] = val.toLowerCase().split(';');

//   return {
//     address,
//     from: from ? Number(from) : 0,
//   };
// }
