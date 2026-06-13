"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Bot,
  Check,
  Copy,
  Terminal,
  ArrowRight,
  Loader2,
  Fingerprint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { truncateHash } from "@/lib/crypto"
import {
  issueCode,
  deriveNullifier,
  getIssuedForSlug,
  type IssuedCode,
} from "@/lib/store"
import type { Trial } from "@/lib/trials"

/**
 * Agent-view counterpart to ClaimPanel. Same underlying mechanic (one
 * non-transferable code per verified human), framed as a programmatic claim an
 * agent makes on behalf of its human via the API.
 */
export function AgentProvisionPanel({ trial }: { trial: Trial }) {
  const [issued, setIssued] = useState<IssuedCode | null>(null)
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    deriveNullifier(trial.slug).then((nullifier) => {
      if (!active) return
      const existing = getIssuedForSlug(trial.slug, nullifier)
      if (existing) setIssued(existing)
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [trial.slug])

  async function runClaim() {
    setRunning(true)
    // Brief delay so the "request" reads like a real round-trip.
    await new Promise((r) => setTimeout(r, 650))
    const { record, alreadyClaimed } = await issueCode(trial.slug, trial.name)
    setIssued(record)
    setRunning(false)
    if (alreadyClaimed) {
      toast.info("Idempotent claim", {
        description: "This human already holds a code — returning the same one.",
      })
    } else {
      toast.success("Code provisioned", {
        description: `Delivered to your agent. Hash sent to ${trial.name}.`,
      })
    }
  }

  function copyCode() {
    if (!issued) return
    navigator.clipboard.writeText(issued.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const requestBody = `POST /v1/claims
{
  "trial": "${trial.slug}",
  "on_behalf_of": "<worldid_session>"
}`

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Bot className="size-4 text-primary" />
        Provision for your agent
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
        Your agent claims a {trial.trialLength} for {trial.name} on behalf of a
        verified human. One code per human — re-runs are idempotent.
      </p>

      {/* Request */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground">
          <Terminal className="size-3.5 text-primary" />
          Request
        </div>
        <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed text-foreground">
          <code>{requestBody}</code>
        </pre>
      </div>

      {!issued ? (
        <>
          <Button
            size="lg"
            className="mt-4 w-full"
            disabled={!ready || running}
            onClick={runClaim}
          >
            {running ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Running claim…
              </>
            ) : (
              <>
                <Bot className="size-4" />
                Run agent claim
              </>
            )}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Fingerprint className="size-3.5 text-primary" />
            Authorized by a World ID Proof of Human.
          </p>
        </>
      ) : (
        <>
          {/* Response */}
          <div className="mt-3 overflow-hidden rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between gap-2 border-b border-primary/20 px-3 py-2 text-xs">
              <span className="flex items-center gap-1.5 text-primary">
                <Check className="size-3.5" />
                200 OK
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                aria-label="Copy promo code"
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy code"}
              </Button>
            </div>
            <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed text-foreground">
              <code>{`{
  "code": "${issued.code}",
  "code_hash": "${truncateHash(issued.codeHash)}",
  "nullifier": "${truncateHash(issued.nullifier)}",
  "transferable": false,
  "status": "${issued.redeemed ? "redeemed" : "issued"}"
}`}</code>
            </pre>
          </div>

          <Button
            size="lg"
            className="mt-4 w-full"
            render={<Link href={`/partner/${trial.slug}`} />}
          >
            Redeem on {trial.name}
            <ArrowRight className="size-4" />
          </Button>

          {issued.redeemed && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary">
              <Check className="size-3.5" />
              This code has been redeemed.
            </p>
          )}
        </>
      )}
    </div>
  )
}
