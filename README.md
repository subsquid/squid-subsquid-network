# SQD Network indexer (squid-subsquid-network)

A Squid SDK indexer for the SQD Network's onchain contracts. It reads SQD Network smart contract events on Arbitrum and exposes the indexed data over a GraphQL API.

## What it is

SQD ([sqd.dev](https://sqd.dev)) is an open data platform for Web3. The [SQD Network](https://sqd.dev/network) is a decentralized data lake whose token, staking, worker, and gateway logic lives in onchain contracts. This repository indexes those contracts and serves the resulting state through GraphQL.

It is built with the [Squid SDK](https://docs.sqd.dev/en/sdk), reads block data through the [SQD Portal](https://portal.sqd.dev/datasets/arbitrum-one), stores data in PostgreSQL via TypeORM, and serves it with the Squid GraphQL server.

The contract ABIs are in `abi/`. The contract sources and addresses live in a separate repository: [subsquid/subsquid-network-contracts](https://github.com/subsquid/subsquid-network-contracts).

## Layout

This is a pnpm + Turborepo monorepo (`packages/`). It contains three indexers plus shared code:

| Package | Indexes |
|---|---|
| `@sqd/token` | The SQD token, transfers, accounts, vestings, and temporary holdings |
| `@sqd/gateways` | Gateways, gateway stakes, and portal pools |
| `@sqd/workers` | Workers, delegations, rewards, epochs, and uptime/metrics snapshots |
| `@sqd/shared` | Shared ABIs, network config, and helpers used by the indexers |

Each indexer has its own GraphQL schema (`packages/*/schema.graphql`), database migrations (`packages/*/db/`), and processor entry point (`packages/*/src/main.ts`).

The indexers run against two networks: `mainnet` (Arbitrum One) and `tethys` testnet (Arbitrum Sepolia). Deployment manifests for both are in `manifests/`.

## Requirements

- Node.js
- pnpm (the workspace pins `pnpm@10.30.2`)
- Docker (for the local PostgreSQL instance)

## Setup

Install dependencies:

```bash
pnpm install
```

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

`.env.example` lists the variables the indexers read, including the RPC endpoint, the Portal endpoint, and the database connection.

## Build

Generate TypeORM models from the GraphQL schemas, then build all packages:

```bash
pnpm codegen
pnpm build
```

## Run

Start the local PostgreSQL databases (the compose file creates one database per indexer):

```bash
docker compose up -d
```

Apply database migrations:

```bash
pnpm db:migrate
```

Run a single indexer's processor and GraphQL API from its package directory, for example the token indexer:

```bash
pnpm --dir packages/token proc   # run the processor
pnpm --dir packages/token api    # serve the GraphQL API
```

Use `packages/gateways` or `packages/workers` in place of `packages/token` to run the other indexers.

## Scripts

Defined at the workspace root (`package.json`):

- `pnpm build`: build all packages
- `pnpm codegen`: generate TypeORM models from the GraphQL schemas
- `pnpm db:migrate`: apply database migrations
- `pnpm clean`: remove build output
- `pnpm lint`: run Biome with autofix

## License

MIT. See [LICENSE](./LICENSE).

## Documentation

- SQD documentation: https://docs.sqd.dev
- Squid SDK: https://docs.sqd.dev/en/sdk
- SQD Network: https://docs.sqd.dev/en/network
