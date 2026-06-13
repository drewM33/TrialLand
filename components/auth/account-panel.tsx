"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Wallet, UserPlus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, clearSession } from "@/lib/session"
import { findByWallet, type Registration } from "@/lib/registry"
import { getIssuedCodes, type IssuedCode } from "@/lib/store"
import { truncateHash } from "@/lib/crypto"

export function AccountPanel() {
  const session = useSession()
  const router = useRouter()
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [codes, setCodes] = useState<IssuedCode[]>([])

  useEffect(() => {
    if (!session) {
      setRegistration(null)
      setCodes([])
      return
    }
    setRegistration(findByWallet(session.wallet) ?? null)
    setCodes(getIssuedCodes())
  }, [session])

  if (!session) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Wallet className="size-6" />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          You&apos;re not logged in
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Register or log in to view your wallet and claimed trials.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button size="lg" render={<Link href="/register" />}>
            <UserPlus className="size-4" />
            Register
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/login" />}>
            Log in
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Wallet className="size-4 text-primary" />
            Your wallet
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearSession()
              router.push("/")
            }}
          >
            <LogOut className="size-3.5" />
            Log out
          </Button>
        </div>

        <dl className="mt-4 space-y-2 rounded-xl border border-border bg-background p-4 text-xs">
          <Row label="Wallet" value={truncateHash(session.wallet)} />
          <Row label="Human nullifier" value={truncateHash(session.nullifier)} />
          {registration && (
            <>
              <Row label="Registered on" value={registration.chainName} />
              <Row label="Registry tx" value={truncateHash(registration.txHash)} />
              <Row
                label="Block"
                value={`#${registration.blockNumber.toLocaleString()}`}
              />
            </>
          )}
        </dl>

        {!registration && (
          <p className="mt-3 text-xs text-destructive">
            This wallet isn&apos;t registered on chain yet.{" "}
            <Link href="/register" className="underline underline-offset-4">
              Register now
            </Link>
            .
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-foreground">Claimed trials</h3>
        {codes.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t claimed any trials yet.{" "}
            <Link href="/" className="text-foreground underline underline-offset-4">
              Browse trials
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {codes.map((c) => (
              <li
                key={`${c.slug}-${c.codeHash}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm"
              >
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{c.trialName}</div>
                  <code className="font-mono text-xs text-muted-foreground">
                    {c.code}
                  </code>
                </div>
                <Link
                  href={`/trial/${c.slug}`}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View
                  <ArrowRight className="size-3" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <code className="font-mono text-foreground">{value}</code>
    </div>
  )
}
