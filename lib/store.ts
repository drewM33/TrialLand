"use client"

import { sha256 } from "@/lib/crypto"

/**
 * Frontend-only mock "backend" for TrialLand, persisted in localStorage.
 *
 * It models the World ID concepts from the docs in a simulated way:
 * - A `nullifier` is the per-human, per-action uniqueness identifier. We store
 *   one stable simulated World ID identity per browser and derive a nullifier
 *   from (identity + trial slug). This enforces "one code per human per trial".
 * - The partner (third party) only ever receives the HASH of the promo code
 *   plus status, never the code itself. That mirrors the privacy-by-architecture
 *   model where relying parties receive proofs/derived values, not raw data.
 */

const IDENTITY_KEY = "trialland.worldid.identity"
const ISSUED_KEY = "trialland.issued.v1"
const PARTNER_KEY = "trialland.partnerdb.v1"

export interface IssuedCode {
  slug: string
  trialName: string
  code: string
  codeHash: string
  /** Per-human, per-trial nullifier (uniqueness). */
  nullifier: string
  issuedAt: number
  redeemed: boolean
  redeemedAt?: number
}

/** What a partner / third party can see. No raw code, no human identity. */
export interface PartnerRecord {
  slug: string
  codeHash: string
  nullifier: string
  issuedAt: number
  redeemed: boolean
  redeemedAt?: number
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function randomHex(bytes = 32): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/* -------------------------------------------------------------------------- */
/* World ID identity (simulated)                                              */
/* -------------------------------------------------------------------------- */

/** Returns the persistent simulated World ID identity, creating one if needed. */
export function getOrCreateIdentity(): string {
  let id = read<string | null>(IDENTITY_KEY, null)
  if (!id) {
    id = randomHex(32)
    write(IDENTITY_KEY, id)
  }
  return id
}

export function getIdentity(): string | null {
  return read<string | null>(IDENTITY_KEY, null)
}

/**
 * Pin the active identity to a specific value — used after registration/login
 * so the human's World ID nullifier (bound to their registered wallet) drives
 * per-trial claim codes.
 */
export function setIdentity(id: string): void {
  write(IDENTITY_KEY, id)
}

/** Clear the active identity (on logout). */
export function clearIdentity(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(IDENTITY_KEY)
}

/** Simulates "scanning a different World App" — a brand new human. */
export function resetIdentity(): string {
  const id = randomHex(32)
  write(IDENTITY_KEY, id)
  return id
}

/**
 * Derive the per-human, per-action nullifier hash.
 * In real World ID this comes from the zero-knowledge proof; here we derive it
 * deterministically from identity + action so the same human + same trial always
 * collides (enforcing uniqueness) while different trials do not.
 */
export async function deriveNullifier(slug: string): Promise<string> {
  const identity = getOrCreateIdentity()
  return sha256(`${identity}:trial:${slug}`)
}

/* -------------------------------------------------------------------------- */
/* Issued codes (the human's wallet of codes)                                 */
/* -------------------------------------------------------------------------- */

export function getIssuedCodes(): IssuedCode[] {
  return read<IssuedCode[]>(ISSUED_KEY, [])
}

export function getIssuedForSlug(slug: string, nullifier: string): IssuedCode | undefined {
  return getIssuedCodes().find(
    (c) => c.slug === slug && c.nullifier === nullifier,
  )
}

function generateCode(slug: string): string {
  const prefix = slug.replace(/[^a-z]/gi, "").slice(0, 4).toUpperCase() || "TRIAL"
  const block = () =>
    Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${block()}-${block()}`
}

/**
 * Issue a unique promo code for this human + trial.
 * - If the human already claimed this trial, returns the existing code with
 *   `alreadyClaimed: true` (uniqueness enforced).
 * - Otherwise mints a new code, stores it for the human, and pushes a hashed
 *   record to the partner DB.
 */
export async function issueCode(
  slug: string,
  trialName: string,
): Promise<{ record: IssuedCode; alreadyClaimed: boolean }> {
  const nullifier = await deriveNullifier(slug)

  const existing = getIssuedForSlug(slug, nullifier)
  if (existing) {
    return { record: existing, alreadyClaimed: true }
  }

  const code = generateCode(slug)
  const codeHash = await sha256(code)
  const record: IssuedCode = {
    slug,
    trialName,
    code,
    codeHash,
    nullifier,
    issuedAt: Date.now(),
    redeemed: false,
  }

  const all = getIssuedCodes()
  all.push(record)
  write(ISSUED_KEY, all)

  // Partner only ever receives the hash + nullifier + status.
  const partnerDB = getPartnerDB()
  partnerDB.push({
    slug,
    codeHash,
    nullifier,
    issuedAt: record.issuedAt,
    redeemed: false,
  })
  write(PARTNER_KEY, partnerDB)

  return { record, alreadyClaimed: false }
}

/* -------------------------------------------------------------------------- */
/* Partner DB (what the third party can access)                               */
/* -------------------------------------------------------------------------- */

export function getPartnerDB(): PartnerRecord[] {
  return read<PartnerRecord[]>(PARTNER_KEY, [])
}

export function getPartnerRecordsForSlug(slug: string): PartnerRecord[] {
  return getPartnerDB().filter((r) => r.slug === slug)
}

export type RedeemResult =
  | { ok: true; record: PartnerRecord }
  | {
      ok: false
      reason:
        | "invalid-code"
        | "wrong-human"
        | "already-redeemed"
    }

/**
 * Redeem a code on the partner side.
 * Step 1 (code check): hash the entered code and look it up in the partner DB.
 * Step 2 (human check): the caller passes the nullifier proven by re-scanning
 * World ID on the partner site; it must match the nullifier bound to the code.
 */
export async function redeemCode(
  slug: string,
  enteredCode: string,
  provenNullifier: string,
): Promise<RedeemResult> {
  const codeHash = await sha256(enteredCode.trim().toUpperCase())
  const partnerDB = getPartnerDB()
  const record = partnerDB.find(
    (r) => r.slug === slug && r.codeHash === codeHash,
  )

  if (!record) return { ok: false, reason: "invalid-code" }
  if (record.nullifier !== provenNullifier)
    return { ok: false, reason: "wrong-human" }
  if (record.redeemed) return { ok: false, reason: "already-redeemed" }

  record.redeemed = true
  record.redeemedAt = Date.now()
  write(PARTNER_KEY, partnerDB)

  // Mirror status onto the human's wallet copy.
  const issued = getIssuedCodes()
  const mine = issued.find(
    (c) => c.slug === slug && c.codeHash === codeHash,
  )
  if (mine) {
    mine.redeemed = true
    mine.redeemedAt = record.redeemedAt
    write(ISSUED_KEY, issued)
  }

  return { ok: true, record }
}

/** Validate just the code (step 1 of redemption) without consuming it. */
export async function lookupCode(
  slug: string,
  enteredCode: string,
): Promise<PartnerRecord | undefined> {
  const codeHash = await sha256(enteredCode.trim().toUpperCase())
  return getPartnerDB().find(
    (r) => r.slug === slug && r.codeHash === codeHash,
  )
}
