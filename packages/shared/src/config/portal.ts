/**
 * Auth header for the internal portal's higher rate limits. Unset when a squid
 * points at the public portal, which needs no credentials.
 */
export function portalHeaders(): Record<string, string> | undefined {
  const apiKey = process.env.PORTAL_API_KEY
  if (!apiKey) return undefined

  return { 'x-api-key': apiKey }
}
