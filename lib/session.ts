"use client"

import { useSyncExternalStore } from "react"
import { setIdentity, clearIdentity } from "@/lib/store"

/**
 * The signed-in human's session: which verified human (nullifier) is active and
 * which registered wallet they're using. Persisted in localStorage and exposed
 * reactively via `useSession`.
 *
 * Setting a session also pins the World ID nullifier as the active identity in
 * the store, so per-trial claim codes derive from the registered human.
 */

const SESSION_KEY = "trialland.session.v1"
const EVENT = "trialland:session"

export interface Session {
  /** World ID nullifier hash proven at registration (the human). */
  nullifier: string
  /** Registered wallet address (created on Dynamic). */
  wallet: string
}

function readSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

let cache: Session | null | undefined
function getSnapshot(): Session | null {
  if (cache === undefined) cache = readSession()
  return cache
}

function getServerSnapshot(): Session | null {
  return null
}

function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}

function emit(next: Session | null): void {
  cache = next
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT))
}

export function getSession(): Session | null {
  return readSession()
}

/** Start a session for a registered human + wallet. */
export function setSession(session: Session): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  setIdentity(session.nullifier)
  emit(session)
}

/** End the session (log out). */
export function clearSession(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(SESSION_KEY)
  clearIdentity()
  emit(null)
}

/** Reactive read of the current session (client components only). */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
