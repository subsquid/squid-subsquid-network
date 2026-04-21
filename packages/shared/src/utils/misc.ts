import { BigDecimal } from '@subsquid/big-decimal'
import bs58 from 'bs58'

export function parsePeerId(peerId: string) {
  return bs58.encode(Buffer.from(peerId.slice(2), 'hex'))
}

export type WorkerMetadata = {
  name?: string | null
  website?: string | null
  description?: string | null
  email?: string | null
}

export function parseWorkerMetadata(ctx: { log: any }, rawMetadata: string): WorkerMetadata {
  const metadata: WorkerMetadata = {
    name: null,
    website: null,
    description: null,
    email: null,
  }

  try {
    const parsed = JSON.parse(rawMetadata)
    for (const prop in metadata) {
      if (parsed[prop]) {
        metadata[prop as keyof WorkerMetadata] = parsed[prop]
      }
    }
    metadata.email = null
    return metadata
  } catch (e) {
    ctx.log.warn(`unable to parse worker metadata "${rawMetadata}": ${e}`)
    return metadata
  }
}

export type GatewayMetadata = {
  name: string | null
  website: string | null
  description: string | null
  email: string | null
  endpointUrl: string | null
}

export function parseGatewayMetadata(ctx: { log: any }, rawMetadata: string): GatewayMetadata {
  const metadata: GatewayMetadata = {
    name: null,
    website: null,
    description: null,
    email: null,
    endpointUrl: null,
  }

  try {
    const parsed = JSON.parse(rawMetadata)
    for (const prop in metadata) {
      if (parsed[prop]) {
        metadata[prop as keyof GatewayMetadata] = parsed[prop]
      }
    }
    return metadata
  } catch (e) {
    ctx.log.warn(`unable to parse gateway metadata "${rawMetadata}": ${e}`)
    return metadata
  }
}

export function toPercent(value: number, overflow?: boolean) {
  const p = value * 100
  return overflow ? p : Math.min(p, 100)
}

export function normalizeAddress(address: string) {
  return address.toLowerCase()
}

export function toNextEpochStart(block: number, length: number) {
  return toEpochStart(block, length) + length
}

export function toEpochStart(block: number, length: number) {
  return Math.floor(block / length) * length
}

export type Awaitable<T> = T | Promise<T>

export function joinUrl(...args: string[]) {
  const resultArray = []
  if (args.length === 0) {
    return ''
  }

  if (typeof args[0] !== 'string') {
    throw new TypeError('Url must be a string. Received ' + args[0])
  }

  if (args[0].match(/^[^/:]+:\/*$/) && args.length > 1) {
    const first = args.shift()
    args[0] = first + args[0]
  }

  if (args[0].match(/^file:\/\/\//)) {
    args[0] = args[0].replace(/^([^/:]+):\/*/, '$1:///')
  } else {
    args[0] = args[0].replace(/^([^/:]+):\/*/, '$1://')
  }

  for (let i = 0; i < args.length; i++) {
    let component = args[i]

    if (typeof component !== 'string') {
      throw new TypeError('Url must be a string. Received ' + component)
    }

    if (component === '') {
      continue
    }

    if (i > 0) {
      component = component.replace(/^[\/]+/, '')
    }
    if (i < args.length - 1) {
      component = component.replace(/[\/]+$/, '')
    } else {
      component = component.replace(/[\/]+$/, '/')
    }

    resultArray.push(component)
  }

  let str = resultArray.join('/')
  str = str.replace(/\/(\?|&|#[^!])/g, '$1')

  const parts = str.split('?')
  str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&')

  return str
}

export function toHumanSQD(value: bigint) {
  return BigDecimal(value, 18).toFixed(18) + ' SQD'
}

export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

export function stopwatch() {
  let start = process.hrtime.bigint()
  return {
    get: () => {
      const t = process.hrtime.bigint()
      const res = (t - start) / 1000000n
      start = t
      return res
    },
  }
}
