"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isEthereumWallet } from "@dynamic-labs/ethereum"
import { AlertCircle, Loader2, PenLine, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dynamicConfigured, dynamicEnvironmentId } from "@/lib/auth-config"
import { truncateHash } from "@/lib/crypto"

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[65%] text-right font-mono text-xs break-all">
        {value}
      </span>
    </div>
  )
}

function DynamicWalletTestLive() {
  const {
    primaryWallet,
    setShowAuthFlow,
    handleLogOut,
    user,
    sdkHasLoaded,
  } = useDynamicContext()

  const [signing, setSigning] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [lastSignature, setLastSignature] = useState<string | null>(null)

  const address = primaryWallet?.address ?? null
  const authenticated = Boolean(user || address)

  const handleSignMessage = useCallback(async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      toast.error("No EVM wallet", {
        description: "Connect an Ethereum wallet before signing.",
      })
      return
    }

    const message = `TrialLand test sign @ ${new Date().toISOString()}`
    setSigning(true)
    setLastMessage(message)
    setLastSignature(null)

    try {
      const signature = await primaryWallet.signMessage(message)
      if (!signature) {
        throw new Error("Wallet returned no signature")
      }

      setLastSignature(signature)
      toast.success("Message signed", {
        description: truncateHash(signature, 10, 8),
      })
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Could not sign the message."
      toast.error("Sign failed", { description })
    } finally {
      setSigning(false)
    }
  }, [primaryWallet])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-4" />
          Dynamic wallet sandbox
        </CardTitle>
        <CardDescription>
          Isolated path for testing embedded wallet creation and connection.
          No World ID or on-chain registration.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs">
          <StatusRow
            label="SDK loaded"
            value={sdkHasLoaded ? "yes" : "loading…"}
          />
          <StatusRow
            label="Authenticated"
            value={authenticated ? "yes" : "no"}
          />
          <StatusRow
            label="Environment"
            value={truncateHash(dynamicEnvironmentId, 8, 6)}
          />
          <StatusRow
            label="Wallet address"
            value={address ?? "—"}
          />
          <StatusRow
            label="Connector"
            value={primaryWallet?.connector?.name ?? "—"}
          />
          <StatusRow
            label="Chain"
            value={
              primaryWallet?.chain
                ? String(primaryWallet.chain)
                : "—"
            }
          />
          <StatusRow
            label="User id"
            value={user?.userId ?? "—"}
          />
          <StatusRow
            label="Email"
            value={user?.email ?? "—"}
          />
          <StatusRow
            label="Last message"
            value={lastMessage ?? "—"}
          />
          <StatusRow
            label="Last signature"
            value={lastSignature ?? "—"}
          />
        </div>

        {!sdkHasLoaded ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Waiting for Dynamic SDK…
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button
          onClick={() => setShowAuthFlow(true)}
          disabled={!sdkHasLoaded}
        >
          {address ? "Open wallet modal" : "Create / connect wallet"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => void handleSignMessage()}
          disabled={!address || signing || !sdkHasLoaded}
        >
          {signing ? (
            <>
              <Loader2 className="animate-spin" />
              Signing…
            </>
          ) : (
            <>
              <PenLine />
              Test sign message
            </>
          )}
        </Button>
        {authenticated ? (
          <Button variant="outline" onClick={() => void handleLogOut()}>
            Log out
          </Button>
        ) : null}
        <Button variant="ghost" render={<Link href="/register" />}>
          Back to register flow
        </Button>
      </CardFooter>
    </Card>
  )
}

export function DynamicWalletTest() {
  if (!dynamicConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-500" />
            Dynamic not configured
          </CardTitle>
          <CardDescription>
            Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID
            </code>{" "}
            in <code className="font-mono text-xs">.env.local</code> to test
            wallet creation. See <code className="font-mono text-xs">.env.example</code>.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" render={<Link href="/" />}>
            Back home
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return <DynamicWalletTestLive />
}
