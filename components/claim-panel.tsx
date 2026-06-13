"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Check,
  Copy,
  Ticket,
  Lock,
  ArrowRight,
  Wallet,
  UserPlus,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { truncateHash } from "@/lib/crypto"
import { isWalletRegistered } from "@/lib/registry"
import {
  issueCode,
  deriveNullifier,
  getIssuedForSlug,
  type IssuedCode,
} from "@/lib/store"
import { useSession } from "@/lib/session"
import type { Trial } from "@/lib/trials"

export function ClaimPanel({ trial }: { trial: Trial }) {
  const session = useSession()
  const walletRegistered = session ? isWalletRegistered(session.wallet) : false
  const [issued, setIssued] = useState<IssuedCode | null>(null)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [ready, setReady] = useState(false)

  // When logged in, check whether this human already holds a code for this trial.
  useEffect(() => {
    if (!session || !walletRegistered) {
      setIssued(null)
      setAlreadyClaimed(false)
      setReady(false)
      return
    }
    let active = true
    setReady(false)
    deriveNullifier(trial.slug).then((nullifier) => {
      if (!active) return
      const existing = getIssuedForSlug(trial.slug, nullifier)
      if (existing) {
        setIssued(existing)
        setAlreadyClaimed(true)
      } else {
        setIssued(null)
        setAlreadyClaimed(false)
      }
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [trial.slug, session, walletRegistered])

  async function handleClaim() {
    setClaiming(true)
    try {
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
    } finally {
      setClaiming(false)
    }
  }

  function copyCode() {
    if (!issued) return
    navigator.clipboard.writeText(issued.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // Gate: must be registered + logged in before claiming.
  if (!session) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Lock className="size-4 text-primary" />
          Register to claim
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
          Claiming the {trial.name} trial requires a registered wallet. Verify
          you&apos;re a unique human with World ID — we create your wallet on
          Dynamic and register it on chain.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          {[
            "World ID Proof of Human",
            "Wallet bound to your verification",
            "Registered on chain before any claim",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-muted-foreground">
              <Check className="size-4 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <Button size="lg" className="mt-5 w-full" render={<Link href="/register" />}>
          <UserPlus className="size-4" />
          Register with World ID
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    )
  }

  if (!walletRegistered) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Lock className="size-4 text-primary" />
          Wallet not registered
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
          You&apos;re logged in, but this wallet isn&apos;t registered with World ID
          on chain yet. Register your wallet before claiming {trial.name}.
        </p>
        <Button size="lg" className="mt-5 w-full" render={<Link href="/register" />}>
          <UserPlus className="size-4" />
          Register this wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      {/* Registered-wallet chip */}
      <div className="mb-4 flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs text-primary">
        <Wallet className="size-3.5" />
        <span className="font-mono">{truncateHash(session.wallet)}</span>
        <span className="ml-auto flex items-center gap-1 text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          Registered
        </span>
      </div>

      {!issued ? (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Ticket className="size-4 text-primary" />
            Claim your {trial.trialLength}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Your wallet is verified and registered. Claim a non-transferable
            promo code for {trial.name} — one per human.
          </p>

          <Button
            size="lg"
            className="mt-5 w-full"
            disabled={!ready || claiming}
            onClick={handleClaim}
          >
            <Ticket className="size-4" />
            {claiming ? "Issuing code…" : "Claim trial"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            The partner receives only a hashed copy bound to your nullifier.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Check className="size-4" />
            {alreadyClaimed ? "Already claimed" : "Code issued"}
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
    </div>
  )
}
