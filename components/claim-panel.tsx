"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Check,
  Copy,
  ShieldCheck,
  Ticket,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorldIdModal } from "@/components/worldid-modal"
import { truncateHash } from "@/lib/crypto"
import {
  issueCode,
  deriveNullifier,
  getIssuedForSlug,
  resetIdentity,
  type IssuedCode,
} from "@/lib/store"
import type { Trial } from "@/lib/trials"

export function ClaimPanel({ trial }: { trial: Trial }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [issued, setIssued] = useState<IssuedCode | null>(null)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ready, setReady] = useState(false)

  // On mount, check whether this human already holds a code for this trial.
  useEffect(() => {
    let active = true
    deriveNullifier(trial.slug).then((nullifier) => {
      if (!active) return
      const existing = getIssuedForSlug(trial.slug, nullifier)
      if (existing) {
        setIssued(existing)
        setAlreadyClaimed(true)
      }
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [trial.slug])

  async function handleVerified() {
    const { record, alreadyClaimed } = await issueCode(trial.slug, trial.name)
    setIssued(record)
    setAlreadyClaimed(alreadyClaimed)
    if (alreadyClaimed) {
      toast.info("You've already claimed this trial", {
        description: "One code per human. Here's your existing code.",
      })
    } else {
      toast.success("Promo code issued", {
        description: `A hashed copy was delivered to ${trial.name}.`,
      })
    }
  }

  function copyCode() {
    if (!issued) return
    navigator.clipboard.writeText(issued.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function handleNewHuman() {
    resetIdentity()
    setIssued(null)
    setAlreadyClaimed(false)
    toast("Switched to a new World ID identity", {
      description: "Simulating a different human for testing.",
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      {!issued ? (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Ticket className="size-4 text-primary" />
            Claim your {trial.trialLength}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Verify you&apos;re a unique human to unlock a non-transferable promo
            code for {trial.name}. Limited to one per person.
          </p>

          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Zero-knowledge World ID proof",
              "Code bound to your verification",
              "Partner receives only a hashed copy",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-muted-foreground">
                <Check className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-5 w-full"
            disabled={!ready}
            onClick={() => setModalOpen(true)}
          >
            <ShieldCheck className="size-4" />
            Verify with World ID
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            No personal data shared. Proof generated on your device.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Check className="size-4" />
            {alreadyClaimed ? "Already claimed" : "Verified — code issued"}
          </div>

          {/* The code */}
          <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <span className="text-xs text-muted-foreground">
              Your unique promo code
            </span>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <code className="font-mono text-lg font-bold tracking-wider text-foreground">
                {issued.code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                aria-label="Copy promo code"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Partner hash receipt */}
          <div className="mt-3 space-y-2 rounded-xl border border-border bg-background p-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Hashed copy → {trial.name}</span>
              <code className="font-mono text-foreground">
                {truncateHash(issued.codeHash)}
              </code>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Human nullifier</span>
              <code className="font-mono text-foreground">
                {truncateHash(issued.nullifier)}
              </code>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-muted-foreground">
              <Lock className="size-3" />
              Non-transferable. Tied to your World ID.
            </div>
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

      {/* Testing helper: simulate a different human */}
      <button
        type="button"
        onClick={handleNewHuman}
        className="mt-4 flex w-full items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70 transition-colors hover:text-muted-foreground"
      >
        <RefreshCw className="size-3" />
        Demo: simulate a different human
      </button>

      <WorldIdModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onVerified={handleVerified}
        actionLabel={`claim the ${trial.name} trial`}
      />
    </div>
  )
}
