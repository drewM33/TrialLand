// SHA-256 hashing via the Web Crypto API (browser).
// Used to derive the hashed copy of a promo code that partners receive,
// and to derive a stable-looking World ID nullifier from a random seed.

export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return bufferToHex(digest)
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Short, human-friendly display of a long hash, e.g. 0x9f3a…c41d
export function truncateHash(hash: string, lead = 6, tail = 4): string {
  const clean = hash.startsWith("0x") ? hash.slice(2) : hash
  if (clean.length <= lead + tail) return `0x${clean}`
  return `0x${clean.slice(0, lead)}…${clean.slice(-tail)}`
}
