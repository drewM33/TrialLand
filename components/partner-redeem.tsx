"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Check,
  CircleAlert,
  Lock,
  Mail,
  Ticket,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WorldIdModal } from "@/components/worldid-modal"
import { lookupCode, redeemCode, deriveNullifier } from "@/lib/store"
import { isLightColor, type Trial } from "@/lib/trials"
import { cn } from "@/lib/utils"

type Step = "form" | "verify" | "success"

export function PartnerRedeem({ trial }: { trial: Trial }) {
  const [step, setStep] = useState<Step>("form")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const lightBrand = isLightColor(trial.color)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password || !code) {
      setError("Please fill in every field.")
      return
    }

    setSubmitting(true)
    // Step 1: validate the code hash exists in the partner DB.
    const record = await lookupCode(trial.slug, code)
    setSubmitting(false)

    if (!record) {
      setError(
        "That promo code isn't recognized for this service. Claim one on TrialBase first.",
      )
      return
    }
    if (record.redeemed) {
      setError("This code has already been redeemed and can't be reused.")
      return
    }

    // Step 2: re-verify the human owns this code.
    setModalOpen(true)
  }

  async function handleVerified() {
    // The nullifier proven on the partner site for this action.
    const provenNullifier = await deriveNullifier(trial.slug)
    const result = await redeemCode(trial.slug, code, provenNullifier)

    if (result.ok) {
      setStep("success")
      toast.success(`${trial.name} trial activated`)
      return
    }

    if (result.reason === "wrong-human") {
      setError(
        "This World ID doesn't match the human this code was issued to. Codes are non-transferable.",
      )
    } else if (result.reason === "already-redeemed") {
      setError("This code has already been redeemed.")
    } else {
      setError("That code couldn't be verified.")
    }
  }

  if (step === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Welcome to {trial.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
          {`Your ${trial.trialLength} is active. We confirmed you're the verified human this code was issued to — no sharing, no resale.`}
        </p>
        <div className="mt-5 rounded-xl border border-border bg-background p-4 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account</span>
            <span className="text-foreground">{email}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <span className="text-foreground">{trial.perk}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="flex items-center gap-1 text-primary">
              <ShieldCheck className="size-3.5" /> Human-verified
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="mt-5 w-full"
          render={<Link href="/" />}
        >
          <ArrowLeft className="size-4" />
          Back to TrialBase
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mock partner brand bar */}
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex size-10 items-center justify-center rounded-lg font-mono text-lg font-bold"
          style={{
            background: trial.color,
            color: lightBrand ? "#18181b" : "#ffffff",
          }}
          aria-hidden
        >
          {trial.mark}
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Create your account on</p>
          <p className="font-semibold text-foreground">{trial.name}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-5 sm:p-6"
      >
        <h1 className="text-lg font-semibold text-foreground">
          Start your {trial.trialLength}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Enter your details and the unique promo code from TrialBase.
        </p>

        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="code">TrialBase promo code</Label>
            <div className="relative">
              <Ticket className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="code"
                placeholder="NETF-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className={cn("pl-9 font-mono tracking-wide")}
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span className="text-pretty">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="mt-5 w-full"
          disabled={submitting}
        >
          <ShieldCheck className="size-4" />
          {submitting ? "Checking code…" : "Verify code & continue"}
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground text-pretty">
          <Lock className="size-3" />
          {trial.name} re-checks World ID to confirm you own this code.
        </p>
      </form>

      <WorldIdModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Confirm it's really you"
        description={`${trial.name} is re-verifying World ID to confirm you're the human this code belongs to.`}
        actionLabel="redeem your code"
        onVerified={handleVerified}
      />
    </>
  )
}
