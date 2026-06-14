import { createPublicClient, http, type PublicClient } from "viem"
import { sepolia } from "viem/chains"

/** VerifyLegacyV3 — deployed TrialCounter contract ABI (Foundry artifact). */
export const trialCounterAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_worldIdRouter",
        type: "address",
        internalType: "contract IWorldID",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "GROUP_ID",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addTrial",
    inputs: [
      {
        name: "t",
        type: "tuple",
        internalType: "struct VerifyLegacyV3.Trial",
        components: [
          { name: "id", type: "bytes32", internalType: "bytes32" },
          { name: "maxRedemptions", type: "uint256", internalType: "uint256" },
          {
            name: "currentRedemptions",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "start", type: "uint64", internalType: "uint64" },
          { name: "end", type: "uint64", internalType: "uint64" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addressRegistered",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nullifierHashes",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "redeemTrial",
    inputs: [
      { name: "index", type: "uint256", internalType: "uint256" },
      { name: "recipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "trials",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "bytes32", internalType: "bytes32" },
      { name: "maxRedemptions", type: "uint256", internalType: "uint256" },
      {
        name: "currentRedemptions",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "start", type: "uint64", internalType: "uint64" },
      { name: "end", type: "uint64", internalType: "uint64" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifyLegacyAndExecute",
    inputs: [
      { name: "root", type: "uint256", internalType: "uint256" },
      { name: "signalHash", type: "uint256", internalType: "uint256" },
      { name: "nullifierHash", type: "uint256", internalType: "uint256" },
      {
        name: "externalNullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "proof", type: "uint256[8]", internalType: "uint256[8]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "worldIdRouter",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IWorldID",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "TrialClaimed",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "id",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidNullifier",
    inputs: [],
  },
  {
    type: "error",
    name: "NoRemainingRedemptions",
    inputs: [],
  },
] as const

export const trialCounterChain = sepolia

export const trialCounterChainId = Number(
  process.env.NEXT_PUBLIC_CONTRACT_CHAIN_ID ?? trialCounterChain.id,
)

/** Default: Sepolia deployment from deployment.txt */
export const trialCounterAddress = (process.env
  .NEXT_PUBLIC_TRIAL_COUNTER_ADDRESS ??
  "0xae51411C5Bf19B3d2FD19aD135B662e831390ffA") as `0x${string}`

export const trialCounterConfigured = /^0x[a-fA-F0-9]{40}$/.test(
  trialCounterAddress,
)

/** Public client for read-only contract calls (no wallet RPC required). */
export function getTrialCounterPublicClient(): PublicClient {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
  return createPublicClient({
    chain: trialCounterChain,
    transport: http(rpcUrl || undefined),
  })
}

export type TrialTuple = {
  id: `0x${string}`
  maxRedemptions: bigint
  currentRedemptions: bigint
  start: bigint
  end: bigint
}
