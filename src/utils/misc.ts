import { BigDecimal } from '@subsquid/big-decimal'
import { Logger } from '@subsquid/logger'
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

export function parseWorkerMetadata(ctx: { log: Logger }, rawMetadata: string): WorkerMetadata {
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

export function parseGatewayMetadata(ctx: { log: Logger }, rawMetadata: string): GatewayMetadata {
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
  return Math.floor(block / length + 1) * length
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

  // If the first part is a plain protocol, we combine it with the next part.
  if (args[0].match(/^[^/:]+:\/*$/) && args.length > 1) {
    const first = args.shift()
    args[0] = first + args[0]
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
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
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[\/]+/, '')
    }
    if (i < args.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[\/]+$/, '')
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[\/]+$/, '/')
    }

    resultArray.push(component)
  }

  let str = resultArray.join('/')
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1')

  // replace ? in parameters with &
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
