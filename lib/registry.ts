"use client"

import { sha256 } from "@/lib/crypto"
import { registryChain } from "@/lib/auth-config"

/**
 * On-chain-style identity registry.
 *
 * This models the "register your wallet with the World ID registry, on chain"
 * step. A registration binds a World ID `nullifier` (the unique human) to a
 * `wallet` address (created on Dynamic). Since there's no real contract
 * deployed in this demo, we persist registrations in localStorage and mint a
 * deterministic, on-chain-looking receipt (tx hash + block number) so the
 * frontend can verify a wallet is registered before letting it claim a trial.
 */

const REGISTRY_KEY = "trialland.registry.v1"
const GENESIS_BLOCK = 12_000_000

export interface Registration {
  /** World ID nullifier hash — the unique human behind the wallet. */
  nullifier: string
  /** Wallet address registered for this human (created on Dynamic). */
  wallet: string
  chainId: number
  chainName: string
  /** On-chain-style receipt for the registration transaction. */
  txHash: string
  blockNumber: number
  registeredAt: number
}

function read(): Registration[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(REGISTRY_KEY)
    return raw ? (JSON.parse(raw) as Registration[]) : []
  } catch {
    return []
  }
}

function write(records: Registration[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(records))
}

function normalize(address: string): string {
  return address.trim().toLowerCase()
}

export function getRegistry(): Registration[] {
  return read()
}

export function findByNullifier(nullifier: string): Registration | undefined {
  return read().find((r) => r.nullifier === nullifier)
}

export function findByWallet(wallet: string): Registration | undefined {
  const w = normalize(wallet)
  return read().find((r) => normalize(r.wallet) === w)
}

/** Frontend gate used before claiming: is this wallet registered on chain? */
export function isWalletRegistered(wallet: string | null | undefined): boolean {
  if (!wallet) return false
  return Boolean(findByWallet(wallet))
}

/**
 * Register a wallet for a verified human. Idempotent per human: re-registering
 * the same nullifier returns the existing on-chain record.
 */
export async function registerWallet(
  nullifier: string,
  wallet: string,
): Promise<{ record: Registration; alreadyRegistered: boolean }> {
  const records = read()

  const existing = records.find((r) => r.nullifier === nullifier)
  if (existing) return { record: existing, alreadyRegistered: true }

  const registeredAt = Date.now()
  const txHash =
    "0x" + (await sha256(`${nullifier}:${normalize(wallet)}:${registeredAt}`))
  const record: Registration = {
    nullifier,
    wallet,
    chainId: registryChain.chainId,
    chainName: registryChain.name,
    txHash,
    blockNumber: GENESIS_BLOCK + records.length + 1,
    registeredAt,
  }

  records.push(record)
  write(records)
  return { record, alreadyRegistered: false }
}
