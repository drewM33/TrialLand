"use client"

import { useState, type ReactNode } from "react"
import {
  IDKitRequestWidget,
  IDKitErrorCodes,
  proofOfHuman,
  type IDKitResult,
  type RpContext,
} from "@worldcoin/idkit"
import { toast } from "sonner"
import { WorldIdModal } from "@/components/worldid-modal"
import { sha256 } from "@/lib/crypto"
import { getOrCreateIdentity } from "@/lib/store"
import {
  worldAppId,
  worldAllowLegacyProofs,
  worldEnvironment,
  worldIdConfigured,
  worldRpId,
} from "@/lib/auth-config"

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
 * Renders World ID verification. Uses the real IDKit 4.x request widget plus
 * server-side verification when configured, and falls back to the
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
  const [open, setOpen] = useState(false)
  const [rpContext, setRpContext] = useState<RpContext | null>(null)
  const [verifiedNullifier, setVerifiedNullifier] = useState<string | null>(null)

  async function requestRpContext() {
    const res = await fetch("/api/worldid/rp-context", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    })
    const data = (await res.json().catch(() => ({}))) as Partial<RpContext>
    if (!res.ok) {
      throw new Error(
        (data as { detail?: string }).detail ?? "Could not initialize World ID request.",
      )
    }
    if (
      typeof data.nonce !== "string" ||
      typeof data.signature !== "string" ||
      typeof data.created_at !== "number" ||
      typeof data.expires_at !== "number"
    ) {
      throw new Error("Invalid RP context returned by server.")
    }
    return {
      rp_id: worldRpId,
      nonce: data.nonce,
      signature: data.signature,
      created_at: data.created_at,
      expires_at: data.expires_at,
    } satisfies RpContext
  }

  async function openVerification() {
    try {
      const context = await requestRpContext()
      setRpContext(context)
      setOpen(true)
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Could not start World ID verification."
      toast.error("World ID unavailable", { description: detail })
    }
  }

  async function handleVerify(result: IDKitResult) {
    setPending(true)
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rp_id: worldRpId, idkitResponse: result }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) {
        throw new Error(data?.detail ?? "World ID verification failed")
      }
      const nullifier = extractNullifier(result, data?.nullifier)
      if (!nullifier) {
        throw new Error("Verification succeeded but no nullifier was returned.")
      }
      setVerifiedNullifier(nullifier)
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "World ID verification failed"
      toast.error("World ID verification failed", { description: detail })
      throw error
    } finally {
      setPending(false)
    }
  }

  function handleSuccess(result: IDKitResult) {
    const nullifier = extractNullifier(result, verifiedNullifier)
    if (!nullifier) {
      toast.error("World ID verification failed", {
        description: "No nullifier was returned by IDKit.",
      })
      return
    }
    setVerifiedNullifier(null)
    onVerified(nullifier)
  }

  return (
    <>
      {children({ verify: openVerification, pending })}
      {rpContext ? (
        <IDKitRequestWidget
          open={open}
          onOpenChange={setOpen}
          app_id={worldAppId as `app_${string}`}
          action={action}
          rp_context={rpContext}
          allow_legacy_proofs={worldAllowLegacyProofs}
          environment={worldEnvironment}
          preset={proofOfHuman(signal ? { signal } : undefined)}
          handleVerify={handleVerify}
          onSuccess={handleSuccess}
          onError={(errorCode) => {
            const detail = worldIdErrorDetail(errorCode)
            toast.error("World ID verification failed", { description: detail })
          }}
        />
      ) : null}
    </>
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

function extractNullifier(result: IDKitResult, verifiedNullifier?: string): string | null {
  if (verifiedNullifier) return verifiedNullifier
  const firstResponse = result.responses[0]
  if (!firstResponse) return null
  if ("nullifier" in firstResponse && typeof firstResponse.nullifier === "string") {
    return firstResponse.nullifier
  }
  if (
    "session_nullifier" in firstResponse &&
    Array.isArray(firstResponse.session_nullifier)
  ) {
    return firstResponse.session_nullifier[0] ?? null
  }
  return null
}

function worldIdErrorDetail(errorCode: IDKitErrorCodes): string {
  const details: Partial<Record<IDKitErrorCodes, string>> = {
    [IDKitErrorCodes.InvalidRpSignature]:
      "RP signature invalid. Verify RP ID/signing key and server clock.",
    [IDKitErrorCodes.UnknownRp]:
      "Unknown RP ID. Confirm NEXT_PUBLIC_WLD_RP_ID matches Developer Portal.",
    [IDKitErrorCodes.RpSignatureExpired]:
      "RP signature expired. Please retry.",
    [IDKitErrorCodes.CredentialUnavailable]:
      "Required credential unavailable for this account.",
    [IDKitErrorCodes.VerificationRejected]:
      "Verification was rejected in World App.",
    [IDKitErrorCodes.WorldId4NotAvailable]:
      "World ID 4.0 is unavailable for this credential yet.",
  }
  return details[errorCode] ?? errorCode
}
