"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ShieldCheck,
  Wallet,
  Link2,
  Check,
  Loader2,
  ArrowRight,
  Fingerprint,
} from "lucide-react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Button } from "@/components/ui/button"
import { WorldIdGate } from "@/components/auth/world-id-gate"
import { registerWallet, type Registration } from "@/lib/registry"
import { setSession } from "@/lib/session"
import { getOrCreateIdentity } from "@/lib/store"
import { sha256, truncateHash } from "@/lib/crypto"
import {
  dynamicConfigured,
  worldActionRegister,
  registryChain,
} from "@/lib/auth-config"

type Phase = "verify" | "wallet" | "registering" | "done"

/* -------------------------------------------------------------------------- */
/* Entry: pick the real (Dynamic) or simulated wallet flow                    */
/* -------------------------------------------------------------------------- */

export function RegisterFlow() {
  return dynamicConfigured ? <DynamicRegisterFlow /> : <DemoRegisterFlow />
}

/* -------------------------------------------------------------------------- */
/* Dynamic-powered registration (real embedded wallet)                        */
/* -------------------------------------------------------------------------- */

function DynamicRegisterFlow() {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext()
  const [phase, setPhase] = useState<Phase>("wallet")
  const [nullifier, setNullifier] = useState<string | null>(null)
  const [registration, setRegistration] = useState<Registration | null>(null)
  const registering = useRef(false)

  const walletAddress = primaryWallet?.address ?? null

  const completeRegistration = useCallback(
    async (n: string, wallet: string) => {
      if (registering.current) return
      registering.current = true
      setPhase("registering")
      try {
        const { record, alreadyRegistered } = await registerWallet(n, wallet)
        setRegistration(record)
        setSession({ nullifier: n, wallet })
        setPhase("done")
        toast.success(
          alreadyRegistered ? "Welcome back" : "Wallet registered on chain",
          {
            description: alreadyRegistered
              ? "This human is already registered."
              : `${truncateHash(wallet)} is now registered with World ID.`,
          },
        )
      } catch {
        registering.current = false
        setPhase("verify")
        toast.error("Registration failed", {
          description: "Could not register your wallet. Try again.",
        })
      }
    },
    [],
  )

  // Advance to World ID once Dynamic provisions a wallet.
  useEffect(() => {
    if (phase === "wallet" && walletAddress) {
      setPhase("verify")
    }
  }, [phase, walletAddress])

  function handleVerified(n: string) {
    setNullifier(n)
    if (walletAddress) {
      void completeRegistration(n, walletAddress)
    }
  }

  function handleCreateWallet() {
    if (walletAddress) {
      setPhase("verify")
    } else {
      setShowAuthFlow(true)
    }
  }

  return (
    <WorldIdGate
      action={worldActionRegister}
      signal={walletAddress ?? undefined}
      onVerified={handleVerified}
      modalTitle="Register with World ID"
      modalDescription="Prove you're a unique human and bind this proof to your new wallet."
      actionLabel="register your wallet"
    >
      {({ verify, pending }) => (
        <RegisterView
          mode="live"
          phase={phase}
          nullifier={nullifier}
          registration={registration}
          verifyPending={pending}
          walletAddress={walletAddress}
          onVerify={verify}
          onCreateWallet={handleCreateWallet}
        />
      )}
    </WorldIdGate>
  )
}

/* -------------------------------------------------------------------------- */
/* Simulated registration (no Dynamic env configured)                         */
/* -------------------------------------------------------------------------- */

function DemoRegisterFlow() {
  const [phase, setPhase] = useState<Phase>("wallet")
  const [nullifier, setNullifier] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [registration, setRegistration] = useState<Registration | null>(null)

  async function completeDemoRegistration(n: string, wallet: string) {
    setPhase("registering")
    const { record, alreadyRegistered } = await registerWallet(n, wallet)
    setRegistration(record)
    setSession({ nullifier: n, wallet })
    setPhase("done")
    toast.success(
      alreadyRegistered ? "Welcome back" : "Wallet registered on chain",
      {
        description: alreadyRegistered
          ? "This human is already registered."
          : `${truncateHash(wallet)} is now registered with World ID.`,
      },
    )
  }

  function handleVerified(n: string) {
    setNullifier(n)
    if (walletAddress) {
      void completeDemoRegistration(n, walletAddress)
    }
  }

  async function handleCreateWallet() {
    if (walletAddress) {
      setPhase("verify")
      return
    }
   
    setWalletAddress(walletAddress)
    setPhase("verify")
  }

  return (
    <WorldIdGate
      action={worldActionRegister}
      signal={walletAddress ?? undefined}
      onVerified={handleVerified}
      modalTitle="Register with World ID"
      modalDescription="Prove you're a unique human and bind this proof to your new wallet."
      actionLabel="register your wallet"
    >
      {({ verify }) => (
        <RegisterView
          mode="demo"
          phase={phase}
          nullifier={nullifier}
          registration={registration}
          verifyPending={false}
          walletAddress={walletAddress}
          onVerify={verify}
          onCreateWallet={handleCreateWallet}
        />
      )}
    </WorldIdGate>
  )
}

/* -------------------------------------------------------------------------- */
/* Shared presentational view                                                 */
/* -------------------------------------------------------------------------- */

interface RegisterViewProps {
  mode: "live" | "demo"
  phase: Phase
  nullifier: string | null
  registration: Registration | null
  verifyPending: boolean
  walletAddress: string | null
  onVerify: () => void
  onCreateWallet: () => void
}

function RegisterView({
  mode,
  phase,
  nullifier,
  registration,
  verifyPending,
  walletAddress,
  onVerify,
  onCreateWallet,
}: RegisterViewProps) {
  const router = useRouter()
  const walletReady = phase !== "wallet"
  const verifyDone = nullifier !== null || phase === "registering" || phase === "done"
  const walletDone = phase === "done"

  if (phase === "done" && registration) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-6" />
          </div>
          <h2 className="mt-3 text-lg font-semibold text-foreground">
            You&apos;re registered
          </h2>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Your wallet is bound to your World ID and registered on{" "}
            {registration.chainName}. You can now claim trials.
          </p>
        </div>

        <dl className="mt-5 space-y-2 rounded-xl border border-border bg-background p-4 text-xs">
          <Row label="Wallet" value={registration.wallet} breakValue />
          <Row label="Human nullifier" value={truncateHash(registration.nullifier)} />
          <Row label="Registry tx" value={truncateHash(registration.txHash)} />
          <Row label="Block" value={`#${registration.blockNumber.toLocaleString()}`} />
        </dl>

        <Button size="lg" className="mt-5 w-full" render={<Link href="/" />}>
          Browse trials
          <ArrowRight className="size-4" />
        </Button>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-3 w-full text-center text-xs text-muted-foreground/70 hover:text-muted-foreground"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Fingerprint className="size-4 text-primary" />
        Register your identity
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
        Create your wallet on Dynamic, then verify you&apos;re a unique human with
        World ID bound to that wallet, and register it on {registryChain.name}.
        One human, one wallet.
      </p>

      <ol className="mt-5 space-y-3">
        <Step
          index={1}
          icon={<Wallet className="size-4" />}
          title="Create your wallet"
          body={
            mode === "live"
              ? "Dynamic provisions an embedded wallet for you."
              : "A demo wallet is generated locally for this session."
          }
          state={walletReady ? "done" : "active"}
        />
        <Step
          index={2}
          icon={<ShieldCheck className="size-4" />}
          title="Prove you're human"
          body="World ID generates a zero-knowledge Proof of Human bound to your wallet."
          state={
            verifyDone ? "done" : phase === "verify" ? "active" : "todo"
          }
        />
        <Step
          index={3}
          icon={<Link2 className="size-4" />}
          title="Register on chain"
          body={`Bind your wallet to your World ID on ${registryChain.name}.`}
          state={walletDone ? "done" : phase === "registering" ? "active" : "todo"}
        />
      </ol>

      <div className="mt-6">
        {phase === "wallet" && (
          <Button size="lg" className="w-full" onClick={onCreateWallet}>
            <Wallet className="size-4" />
            {mode === "live" ? "Create wallet with Dynamic" : "Create my wallet"}
          </Button>
        )}

        {phase === "verify" && (
          <Button
            size="lg"
            className="w-full"
            onClick={onVerify}
            disabled={verifyPending || !walletAddress}
          >
            {verifyPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            Verify with World ID
          </Button>
        )}

        {phase === "registering" && (
          <Button size="lg" className="w-full" disabled>
            <Loader2 className="size-4 animate-spin" />
            Registering on {registryChain.name}…
          </Button>
        )}
      </div>

      {walletAddress && phase !== "wallet" && phase !== "done" && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary">
          <Check className="size-3.5 shrink-0" />
          <span className="break-all">Wallet ready · {walletAddress}</span>
        </p>
      )}

      {nullifier && phase !== "done" && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary">
          <Check className="size-3.5" />
          Human verified · {truncateHash(nullifier)}
        </p>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  )
}

function Row({
  label,
  value,
  breakValue = false,
}: {
  label: string
  value: string
  breakValue?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <code
        className={
          "font-mono text-foreground" +
          (breakValue ? " break-all text-right" : "")
        }
      >
        {value}
      </code>
    </div>
  )
}

function Step({
  index,
  icon,
  title,
  body,
  state,
}: {
  index: number
  icon: React.ReactNode
  title: string
  body: string
  state: "todo" | "active" | "done"
}) {
  return (
    <li className="flex gap-3">
      <div
        className={
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs " +
          (state === "done"
            ? "border-primary bg-primary text-primary-foreground"
            : state === "active"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground")
        }
      >
        {state === "done" ? <Check className="size-3.5" /> : index}
      </div>
      <div className="min-w-0">
        <div
          className={
            "flex items-center gap-1.5 text-sm font-medium " +
            (state === "todo" ? "text-muted-foreground" : "text-foreground")
          }
        >
          <span className="text-muted-foreground">{icon}</span>
          {title}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
          {body}
        </p>
      </div>
    </li>
  )
}
