import { RpcClient } from '@subsquid/rpc-client'
import { assertNotNull } from '@subsquid/util-internal'

export const client = new RpcClient({
  url: assertNotNull(process.env.RPC_ENDPOINT),
  capacity: 5,
})
