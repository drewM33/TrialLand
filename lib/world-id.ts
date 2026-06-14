import type { IDKitResult } from "@worldcoin/idkit-core"

/** Extract the human nullifier from a v3 or v4 uniqueness proof result. */
export function extractNullifier(result: IDKitResult): string {
  const item = result.responses[0]
  if (!item || !("nullifier" in item) || !item.nullifier) {
    throw new Error("Proof response missing nullifier")
  }
  return item.nullifier
}
