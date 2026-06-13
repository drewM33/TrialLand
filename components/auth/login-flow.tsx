"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Wallet,
  Check,
  Loader2,
  ArrowRight,
  KeyRound,
  ShieldAlert,
} from "lucide-react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Button } from "@/components/ui/button"
import { WorldIdGate } from "@/components/auth/world-id-gate"
import { findByNullifier, findByWallet, type Registration } from "@/lib/registry"
import { setSession } from "@/lib/session"
import { truncateHash } from "@/lib/crypto"
import { dynamicConfigured, worldActionRegister } from "@/lib/auth-config"

type Status = "idle" | "connecting" | "unregistered" | "done"

export function LoginFlow() {
  return dynamicConfigured ? <DynamicLoginFlow /> : <DemoLoginFlow />
}

/* -------------------------------------------------------------------------- */
/* Dynamic-powered login (connect the registered wallet)                      */
/* -------------------------------------------------------------------------- */

function DynamicLoginFlow() {
  const { primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()
  const [status, setStatus] = useState<Status>("idle")
  const [registration, setRegistration] = useState<Registration | null>(null)
  const awaiting = useRef(false)

  const resolveWallet = useCallback(async (address: string) => {
    const record = findByWallet(address)
    if (record) {
      setRegistration(record)
      setSession({ nullifier: record.nullifier, wallet: record.wallet })
      setStatus("done")
      toast.success("Logged in", {
        description: `Welcome back, ${truncateHash(record.wallet)}.`,
      })
    } else {
      setStatus("unregistered")
    }
  }, [])

  useEffect(() => {
    if (awaiting.current && primaryWallet?.address) {
      awaiting.current = false
      void resolveWallet(primaryWallet.address)
    }
  }, [primaryWallet, resolveWallet])

  function handleLogin() {
    setStatus("connecting")
    if (primaryWallet?.address) {
      void resolveWallet(primaryWallet.address)
    } else {
      awaiting.current = true
      setShowAuthFlow(true)
    }
  }

  async function handleTryAnother() {
    setStatus("idle")
    setRegistration(null)
    try {
      await handleLogOut()
    } catch {
      // ignore
    }
  }

  return (
    <LoginView
      mode="live"
      status={status}
      registration={registration}
      onLogin={handleLogin}
      onReset={handleTryAnother}
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Simulated login (re-prove World ID to restore the bound wallet)            */
/* -------------------------------------------------------------------------- */

function DemoLoginFlow() {
  const [status, setStatus] = useState<Status>("idle")
  const [registration, setRegistration] = useState<Registration | null>(null)

  function handleVerified(nullifier: string) {
    const record = findByNullifier(nullifier)
    if (record) {
      setRegistration(record)
      setSession({ nullifier: record.nullifier, wallet: record.wallet })
      setStatus("done")
      toast.success("Logged in", {
        description: `Welcome back, ${truncateHash(record.wallet)}.`,
      })
    } else {
      setStatus("unregistered")
    }
  }

  return (
    <WorldIdGate
      action={worldActionRegister}
      onVerified={handleVerified}
      modalTitle="Log in with World ID"
      modalDescription="Prove you're the same human to restore your registered wallet."
      actionLabel="log in"
    >
      {({ verify }) => (
        <LoginView
          mode="demo"
          status={status}
          registration={registration}
          onLogin={() => {
            setStatus("connecting")
            verify()
          }}
          onReset={() => {
            setStatus("idle")
            setRegistration(null)
          }}
        />
      )}
    </WorldIdGate>
  )
}

/* -------------------------------------------------------------------------- */
/* Shared presentational view                                                 */
/* -------------------------------------------------------------------------- */

interface LoginViewProps {
  mode: "live" | "demo"
  status: Status
  registration: Registration | null
  onLogin: () => void
  onReset: () => void
}

function LoginView({ mode, status, registration, onLogin, onReset }: LoginViewProps) {
  if (status === "done" && registration) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-6" />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-foreground">Logged in</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {truncateHash(registration.wallet)} · registered on{" "}
          {registration.chainName}
        </p>
        <Button size="lg" className="mt-5 w-full" render={<Link href="/" />}>
          Browse trials
          <ArrowRight className="size-4" />
        </Button>
      </div>
    )
  }

  if (status === "unregistered") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          Wallet not registered
        </h2>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          This {mode === "live" ? "wallet hasn't" : "human hasn't"} been
          registered with World ID yet. Register first to claim trials.
        </p>
        <Button size="lg" className="mt-5 w-full" render={<Link href="/register" />}>
          Register now
          <ArrowRight className="size-4" />
        </Button>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 w-full text-center text-xs text-muted-foreground/70 hover:text-muted-foreground"
        >
          Try a different {mode === "live" ? "wallet" : "identity"}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <KeyRound className="size-4 text-primary" />
        Log in
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
        {mode === "live"
          ? "Connect the wallet you registered with World ID. Dynamic restores your embedded wallet — no password, no seed phrase."
          : "Re-prove your World ID to restore the wallet bound to your identity."}
      </p>

      <Button
        size="lg"
        className="mt-5 w-full"
        onClick={onLogin}
        disabled={status === "connecting"}
      >
        {status === "connecting" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wallet className="size-4" />
        )}
        {mode === "live" ? "Continue with wallet" : "Continue with World ID"}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="text-foreground underline underline-offset-4">
          Register
        </Link>
      </p>
    </div>
  )
}
