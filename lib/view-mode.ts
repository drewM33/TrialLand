"use client"

import { useSyncExternalStore } from "react"

/**
 * Global "who is this for" mode. The whole site has two skins:
 *  - "human"  — a person claims a trial themselves (the original experience)
 *  - "agent"  — an AI agent claims/redeems on behalf of a verified human
 *
 * The active mode lives as a `mode-agent` class on <html> so that content can
 * be swapped with pure CSS (see globals.css + components/view-gate.tsx) without
 * turning every server component into a client component. A tiny inline script
 * in the root layout applies the class before paint to avoid a flash.
 */

export type ViewMode = "human" | "agent"

export const VIEW_MODE_KEY = "trialland.view"
const EVENT = "trialland:viewmode"

function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}

function getSnapshot(): ViewMode {
  return document.documentElement.classList.contains("mode-agent")
    ? "agent"
    : "human"
}

function getServerSnapshot(): ViewMode {
  return "human"
}

/** Reactive read of the current view mode (client components only). */
export function useViewMode(): ViewMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Switch the global view mode and persist it. */
export function setViewMode(mode: ViewMode): void {
  document.documentElement.classList.toggle("mode-agent", mode === "agent")
  try {
    localStorage.setItem(VIEW_MODE_KEY, mode)
  } catch {
    // Ignore storage failures (private mode, etc.) — class still drives the UI.
  }
  window.dispatchEvent(new Event(EVENT))
}
