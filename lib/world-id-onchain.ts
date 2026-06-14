import type { IDKitResult, ResponseItemV3 } from "@worldcoin/idkit-core"
import {
  decodeAbiParameters,
  encodePacked,
  keccak256,
  toBytes,
  toHex,
  type Hex,
} from "viem"
import { worldAppId, worldActionRegister } from "@/lib/auth-config"

const SNARK_SCALAR_FIELD =
  21888242871839275222246405745257275088548364400416034343698204186575808495617n

/** Matches Solidity `ByteHasher.hashToField`. */
export function hashToField(data: Hex): bigint {
  return BigInt(keccak256(data)) % SNARK_SCALAR_FIELD
}

/**
 * Matches the World Chain template constructor:
 * `abi.encodePacked(abi.encodePacked(appId).hashToField(), action).hashToField()`
 */
export function computeExternalNullifierHash(
  appId = worldAppId,
  action = worldActionRegister,
): bigint {
  const appIdField = hashToField(toHex(toBytes(appId)))
  const packed = encodePacked(["uint256", "string"], [appIdField, action])
  return hashToField(packed)
}

export interface LegacyProofArgs {
  root: bigint
  signalHash: bigint
  nullifierHash: bigint
  externalNullifierHash: bigint
  proof: readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ]
}

function isV3Result(result: IDKitResult): result is Extract<
  IDKitResult,
  { protocol_version: "3.0" }
> {
  return result.protocol_version === "3.0"
}

function pickOrbResponse(responses: ResponseItemV3[]): ResponseItemV3 {
  const orb =
    responses.find((r) => r.identifier === "proof_of_human") ?? responses[0]
  if (!orb) throw new Error("World ID v3 response missing proof data")
  return orb
}

/** Decode IDKit v3 proof fields for `verifyLegacyAndExecute`. */
export function parseLegacyProofForContract(
  result: IDKitResult,
  options?: { appId?: string; action?: string; externalNullifierHash?: bigint },
): LegacyProofArgs {
  if (!isV3Result(result)) {
    throw new Error(
      "On-chain legacy verification requires a World ID 3.0 proof. Use the Orb Legacy preset.",
    )
  }

  const item = pickOrbResponse(result.responses)
  const proof = decodeAbiParameters(
    [{ type: "uint256[8]" }],
    item.proof as Hex,
  )[0] as readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ]

  const externalNullifierHash =
    options?.externalNullifierHash ??
    computeExternalNullifierHash(options?.appId, options?.action)

  return {
    root: BigInt(item.merkle_root),
    signalHash: BigInt(
      item.signal_hash ??
        "0x00c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4",
    ),
    nullifierHash: BigInt(item.nullifier),
    externalNullifierHash,
    proof,
  }
}
