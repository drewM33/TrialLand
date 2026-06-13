"use client"

import { useState, type ReactNode } from "react"
import { IDKitWidget, VerificationLevel, type ISuccessResult } from "@worldcoin/idkit"
import { WorldIdModal } from "@/components/worldid-modal"
import { sha256 } from "@/lib/crypto"
import { getOrCreateIdentity } from "@/lib/store"
import { worldAppId, worldIdConfigured } from "@/lib/auth-config"

export interface WorldIdGateRenderProps {
  /** Trigger the World ID verification flow. */
  verify: () => void
  /** True while a proof is being verified server-side. */
  pending: boolean
}

interface WorldIdGateProps {
  /** World ID action this proof is scoped to (e.g. registration). */
  action: string
  /** Optional value bound into the proof (e.g. wallet address). */
  signal?: string
  /** Called with the per-human, per-action nullifier hash on success. */
  onVerified: (nullifier: string) => void
  modalTitle?: string
  modalDescription?: string
  actionLabel?: string
  children: (props: WorldIdGateRenderProps) => ReactNode
}

/**
 * Renders World ID (World 3.0 / IDKit) verification. Uses the real IDKit widget
 * + server-side cloud verification when configured, and falls back to the
 * simulated World App scan otherwise so the flow works in the demo.
 */
export function WorldIdGate(props: WorldIdGateProps) {
  return worldIdConfigured ? <RealGate {...props} /> : <DemoGate {...props} />
}

function RealGate({
  action,
  signal,
  onVerified,
  children,
}: WorldIdGateProps) {
  const [pending, setPending] = useState(false)

  async function handleVerify(result: ISuccessResult) {
    setPending(true)
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ proof: result, action, signal }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail ?? "World ID verification failed")
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <IDKitWidget
      app_id={worldAppId as `app_${string}`}
      action={action}
      signal={signal}
      verification_level={VerificationLevel.Orb}
      handleVerify={handleVerify}
      onSuccess={(result: ISuccessResult) => onVerified(result.nullifier_hash)}
    >
      {({ open }: { open: () => void }) => children({ verify: open, pending })}
    </IDKitWidget>
  )
}

function DemoGate({
  action,
  signal,
  onVerified,
  modalTitle,
  modalDescription,
  actionLabel,
  children,
}: WorldIdGateProps) {
  const [open, setOpen] = useState(false)

  async function handleVerified() {
    // Derive a deterministic, per-human, per-action nullifier from the
    // simulated World ID identity so re-verifying (login) yields the same one.
    const identity = getOrCreateIdentity()
    const nullifier =
      "0x" + (await sha256(`${identity}:${action}:${signal ?? ""}`))
    onVerified(nullifier)
  }

  return (
    <>
      {children({ verify: () => setOpen(true), pending: false })}
      <WorldIdModal
        open={open}
        onOpenChange={setOpen}
        onVerified={handleVerified}
        title={modalTitle}
        description={modalDescription}
        actionLabel={actionLabel ?? "register"}
      />
    </>
  )
}
