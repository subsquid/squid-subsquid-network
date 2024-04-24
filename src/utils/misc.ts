import { Logger } from '@subsquid/logger';
import bs58 from 'bs58';
import { defaults } from 'lodash';

export function parsePeerId(peerId: string) {
  return bs58.encode(Buffer.from(peerId.slice(2), 'hex'));
}

export type WorkerMetadata = {
  name?: string | null;
  website?: string | null;
  description?: string | null;
  email?: string | null;
};

export function parseWorkerMetadata(ctx: { log: Logger }, rawMetadata: string): WorkerMetadata {
  const metadata: WorkerMetadata = {
    name: null,
    website: null,
    description: null,
    email: null,
  };

  try {
    const parsed = JSON.parse(rawMetadata);
    for (const prop in metadata) {
      if (parsed[prop]) {
        metadata[prop as keyof WorkerMetadata] = parsed[prop];
      }
    }
    return metadata;
  } catch (e) {
    ctx.log.warn(`unable to parse worker metadata "${rawMetadata}": ${e}`);
    return metadata;
  }
}

export type GatewayMetadata = {
  name: string | null;
  website: string | null;
  description: string | null;
  email: string | null;
  endpointUrl: string | null;
};

export function parseGatewayMetadata(ctx: { log: Logger }, rawMetadata: string): GatewayMetadata {
  const metadata: GatewayMetadata = {
    name: null,
    website: null,
    description: null,
    email: null,
    endpointUrl: null,
  };

  try {
    const parsed = JSON.parse(rawMetadata);
    for (const prop in metadata) {
      if (parsed[prop]) {
        metadata[prop as keyof GatewayMetadata] = parsed[prop];
      }
    }
    return metadata;
  } catch (e) {
    ctx.log.warn(`unable to parse gateway metadata "${rawMetadata}": ${e}`);
    return metadata;
  }
}

export function toPercent(value: number, overflow?: boolean) {
  const p = value * 100;
  return overflow ? p : Math.min(p, 100);
}

export function normalizeAddress(address: string) {
  return address.toLowerCase();
}

export function toNextEpochStart(block: number, length: number) {
  return Math.floor(block / length + 1) * length;
}

export type Awaitable<T> = T | Promise<T>;
