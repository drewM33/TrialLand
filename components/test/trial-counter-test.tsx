"use client"

import { useCallback, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isEthereumWallet } from "@dynamic-labs/ethereum"
import {
  isAddress,
  isHex,
  pad,
  stringToHex,
  type Hex,
  type WalletClient,
} from "viem"
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Loader2,
  PenLine,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getTrialCounterPublicClient,
  trialCounterAbi,
  trialCounterAddress,
  trialCounterChain,
  trialCounterChainId,
  trialCounterConfigured,
} from "@/lib/trial-counter"
import { dynamicConfigured } from "@/lib/auth-config"
import { truncateHash } from "@/lib/crypto"

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const explorerBase =
  trialCounterChain.blockExplorers?.default.url ?? "https://sepolia.etherscan.io"

function txLink(hash: string) {
  return `${explorerBase}/tx/${hash}`
}

/** Accept a 0x-prefixed bytes32, or encode an arbitrary label into bytes32. */
function toBytes32(value: string): Hex {
  const trimmed = value.trim()
  if (isHex(trimmed) && trimmed.length === 66) return trimmed
  return pad(stringToHex(trimmed), { size: 32 })
}

function parseBigInt(value: string, field: string): bigint {
  const trimmed = value.trim()
  if (trimmed === "") throw new Error(`${field} is required`)
  try {
    return BigInt(trimmed)
  } catch {
    throw new Error(`${field} must be an integer`)
  }
}

function requireAddress(value: string, field: string): `0x${string}` {
  const trimmed = value.trim()
  if (!isAddress(trimmed)) throw new Error(`${field} must be a valid address`)
  return trimmed
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}

/* -------------------------------------------------------------------------- */
/* Generic function card                                                      */
/* -------------------------------------------------------------------------- */

interface Field {
  name: string
  label: string
  placeholder?: string
  defaultValue?: string
}

interface FunctionCardProps {
  name: string
  kind: "read" | "write"
  signature: string
  description: string
  fields?: Field[]
  disabled?: boolean
  disabledHint?: string
  run: (values: Record<string, string>) => Promise<ReactNode>
}

function FunctionCard({
  name,
  kind,
  signature,
  description,
  fields = [],
  disabled = false,
  disabledHint,
  run,
}: FunctionCardProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])),
  )
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<ReactNode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRun = useCallback(async () => {
    setPending(true)
    setError(null)
    setResult(null)
    try {
      const node = await run(values)
      setResult(node)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Call failed unexpectedly."
      setError(message)
      toast.error(`${name} failed`, { description: message })
    } finally {
      setPending(false)
    }
  }, [name, run, values])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {kind === "read" ? (
            <BookOpen className="size-4 text-sky-500" />
          ) : (
            <PenLine className="size-4 text-amber-500" />
          )}
          <code className="font-mono">{name}</code>
          <Badge variant={kind === "read" ? "secondary" : "outline"}>
            {kind}
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <code className="mt-1 block font-mono text-[11px] break-all text-muted-foreground/80">
          {signature}
        </code>
      </CardHeader>

      <CardContent className="space-y-3">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <Label htmlFor={`${name}-${field.name}`} className="text-xs">
              {field.label}
            </Label>
            <Input
              id={`${name}-${field.name}`}
              value={values[field.name] ?? ""}
              placeholder={field.placeholder}
              spellCheck={false}
              autoComplete="off"
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
            />
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={kind === "read" ? "secondary" : "default"}
            onClick={() => void handleRun()}
            disabled={pending || disabled}
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" />
                {kind === "read" ? "Reading…" : "Sending…"}
              </>
            ) : kind === "read" ? (
              "Call"
            ) : (
              "Send transaction"
            )}
          </Button>
          {disabled && disabledHint ? (
            <span className="text-xs text-muted-foreground">{disabledHint}</span>
          ) : null}
        </div>

        {result ? (
          <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs break-all">
            {result}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs break-all text-destructive">
            {error}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Result renderers                                                            */
/* -------------------------------------------------------------------------- */

function BoolResult({ label, value }: { label: string; value: boolean }) {
  return (
    <span>
      {label}:{" "}
      <span className={value ? "text-emerald-500" : "text-muted-foreground"}>
        {String(value)}
      </span>
    </span>
  )
}

function TxResult({ hash }: { hash: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      Tx sent:{" "}
      <a
        href={txLink(hash)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-mono text-primary underline underline-offset-4"
      >
        {truncateHash(hash, 10, 8)}
        <ArrowUpRight className="size-3" />
      </a>
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

export function TrialCounterTest() {
  const { primaryWallet, setShowAuthFlow, sdkHasLoaded,loadingNetwork } = useDynamicContext()

  const address = primaryWallet?.address ?? null
  const walletReady = Boolean(
    primaryWallet && isEthereumWallet(primaryWallet) && address,
  )

  const publicClient = useMemo(() => getTrialCounterPublicClient(), [])

  /** Resolve a viem wallet client from the connected Dynamic wallet. */
  const getWalletClient = useCallback(async (): Promise<WalletClient> => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      throw new Error("Connect an Ethereum wallet first.")
    }
    const client = await primaryWallet.getWalletClient(String(trialCounterChainId))
    if (!client) throw new Error("Wallet client unavailable.")
    return client as WalletClient
  }, [primaryWallet])

  const write = useCallback(
    async (
      functionName: "addTrial" | "redeemTrial" | "verifyLegacyAndExecute",
      args: readonly unknown[],
    ) => {
      const walletClient = await getWalletClient()
      const account = walletClient.account
      if (!account) throw new Error("No account on wallet client.")
      const hash = await walletClient.writeContract({
        address: trialCounterAddress,
        abi: trialCounterAbi,
        functionName,
        // viem's typed writeContract is strict about per-function arg tuples;
        // this sandbox passes them dynamically.
        args: args as never,
        account,
        chain: trialCounterChain,
      })
      toast.success("Transaction submitted", {
        description: truncateHash(hash, 10, 8),
      })
      return hash
    },
    [getWalletClient],
  )

  if (!trialCounterConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-500" />
            Contract address missing
          </CardTitle>
          <CardDescription>
            Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_TRIAL_COUNTER_ADDRESS
            </code>{" "}
            so the sandbox knows which deployment to call.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wallet bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wallet className="size-4" />
            Wallet
          </CardTitle>
          <CardDescription>
            Reads use a public RPC and work without a wallet. Writes need a
            connected wallet on {trialCounterChain.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-1.5 rounded-lg bg-muted/40 px-3 py-2 text-xs sm:grid-cols-2">
            <Row label="Contract" value={trialCounterAddress} mono />
            <Row
              label="Chain"
              value={`${trialCounterChain.name} (${trialCounterChainId})`}
            />
            <Row label="Wallet" value={address ?? "not connected"} mono />
            <Row
              label="Dynamic SDK"
              value={
                !dynamicConfigured
                  ? "not configured"
                  : sdkHasLoaded
                    ? "loaded"
                    : "loading…"
              }
            />
          </div>
          {dynamicConfigured ? (
            <Button
              size="sm"
              onClick={() => setShowAuthFlow(true)}
              disabled={!sdkHasLoaded}
            >
              <Wallet className="size-4" />
              {walletReady ? "Manage wallet" : "Connect wallet"}
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              Set{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">
                NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID
              </code>{" "}
              to enable write transactions.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Read functions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Read functions
        </h2>

        <FunctionCard
          name="GROUP_ID"
          kind="read"
          signature="GROUP_ID() → uint256"
          description="The World ID group id (1 = Orb)."
          run={async () => {
            const value = await publicClient.readContract({
              address: trialCounterAddress,
              abi: trialCounterAbi,
              functionName: "GROUP_ID",
            })
            return <span>GROUP_ID: {value.toString()}</span>
          }}
        />

        <FunctionCard
          name="worldIdRouter"
          kind="read"
          signature="worldIdRouter() → address"
          description="The configured World ID router contract."
          run={async () => {
            const value = await publicClient.readContract({
              address: trialCounterAddress,
              abi: trialCounterAbi,
              functionName: "worldIdRouter",
            })
            return <span className="font-mono">{value}</span>
          }}
        />

        <FunctionCard
          name="addressRegistered"
          kind="read"
          signature="addressRegistered(address) → bool"
          description="Whether an address has verified a World ID proof."
          fields={[
            {
              name: "addr",
              label: "address",
              placeholder: address ?? "0x…",
              defaultValue: address ?? "",
            },
          ]}
          run={async (v) => {
            const addr = requireAddress(v.addr, "address")
            const value = await publicClient.readContract({
              address: trialCounterAddress,
              abi: trialCounterAbi,
              functionName: "addressRegistered",
              args: [addr],
            })
            return <BoolResult label="registered" value={value} />
          }}
        />

        <FunctionCard
          name="nullifierHashes"
          kind="read"
          signature="nullifierHashes(uint256) → bool"
          description="Whether a nullifier hash has already been used."
          fields={[
            { name: "hash", label: "nullifierHash (uint256)", placeholder: "0" },
          ]}
          run={async (v) => {
            const hash = parseBigInt(v.hash, "nullifierHash")
            const value = await publicClient.readContract({
              address: trialCounterAddress,
              abi: trialCounterAbi,
              functionName: "nullifierHashes",
              args: [hash],
            })
            return <BoolResult label="used" value={value} />
          }}
        />

        <FunctionCard
          name="trials"
          kind="read"
          signature="trials(uint256) → (bytes32 id, uint256 max, uint256 current, uint64 start, uint64 end)"
          description="Read a stored trial by its 1-based index."
          fields={[{ name: "index", label: "index (uint256)", placeholder: "1" }]}
          run={async (v) => {
            const index = parseBigInt(v.index, "index")
            const [id, maxRedemptions, currentRedemptions, start, end] =
              await publicClient.readContract({
                address: trialCounterAddress,
                abi: trialCounterAbi,
                functionName: "trials",
                args: [index],
              })
            return (
              <div className="space-y-0.5">
                <div>
                  id: <span className="font-mono">{id}</span>
                </div>
                <div>maxRedemptions: {maxRedemptions.toString()}</div>
                <div>currentRedemptions: {currentRedemptions.toString()}</div>
                <div>start: {start.toString()}</div>
                <div>end: {end.toString()}</div>
              </div>
            )
          }}
        />
      </section>

      {/* Write functions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Write functions
        </h2>

        <FunctionCard
          name="addTrial"
          kind="write"
          signature="addTrial((bytes32 id, uint256 max, uint256 current, uint64 start, uint64 end))"
          description="Append a new trial. id accepts a 0x bytes32 or a plain label (encoded for you)."
          disabled={!walletReady}
          disabledHint="Connect a wallet"
          fields={[
            { name: "id", label: "id (bytes32 or label)", placeholder: "summer-promo" },
            { name: "max", label: "maxRedemptions", placeholder: "100", defaultValue: "100" },
            { name: "current", label: "currentRedemptions", placeholder: "0", defaultValue: "0" },
            {
              name: "start",
              label: "start (unix seconds)",
              placeholder: "now",
              defaultValue: String(nowSeconds()),
            },
            {
              name: "end",
              label: "end (unix seconds)",
              placeholder: "now + 1 week",
              defaultValue: String(nowSeconds() + 7 * 24 * 60 * 60),
            },
          ]}
          run={async (v) => {
            const trial = {
              id: toBytes32(v.id),
              maxRedemptions: parseBigInt(v.max, "maxRedemptions"),
              currentRedemptions: parseBigInt(v.current, "currentRedemptions"),
              start: parseBigInt(v.start, "start"),
              end: parseBigInt(v.end, "end"),
            }
            const hash = await write("addTrial", [trial])
            return <TxResult hash={hash} />
          }}
        />

        <FunctionCard
          name="redeemTrial"
          kind="write"
          signature="redeemTrial(uint256 index, address recipient)"
          description="Redeem one slot of a trial for a registered recipient inside its time window."
          disabled={!walletReady}
          disabledHint="Connect a wallet"
          fields={[
            { name: "index", label: "index (uint256)", placeholder: "1" },
            {
              name: "recipient",
              label: "recipient (address)",
              placeholder: address ?? "0x…",
              defaultValue: address ?? "",
            },
          ]}
          run={async (v) => {
            const index = parseBigInt(v.index, "index")
            const recipient = requireAddress(v.recipient, "recipient")
            const hash = await write("redeemTrial", [index, recipient])
            return <TxResult hash={hash} />
          }}
        />

        <FunctionCard
          name="verifyLegacyAndExecute"
          kind="write"
          signature="verifyLegacyAndExecute(uint256 root, uint256 signalHash, uint256 nullifierHash, uint256 externalNullifierHash, uint256[8] proof)"
          description="Submit a World ID legacy proof on chain. Paste proof as 8 comma-separated uint256 values."
          disabled={!walletReady}
          disabledHint="Connect a wallet"
          fields={[
            { name: "root", label: "root (uint256)", placeholder: "0" },
            { name: "signalHash", label: "signalHash (uint256)", placeholder: "0" },
            { name: "nullifierHash", label: "nullifierHash (uint256)", placeholder: "0" },
            {
              name: "externalNullifierHash",
              label: "externalNullifierHash (uint256)",
              placeholder: "0",
            },
            {
              name: "proof",
              label: "proof (8 comma-separated uint256)",
              placeholder: "0,0,0,0,0,0,0,0",
            },
          ]}
          run={async (v) => {
            const root = parseBigInt(v.root, "root")
            const signalHash = parseBigInt(v.signalHash, "signalHash")
            const nullifierHash = parseBigInt(v.nullifierHash, "nullifierHash")
            const externalNullifierHash = parseBigInt(
              v.externalNullifierHash,
              "externalNullifierHash",
            )
            const parts = v.proof
              .split(",")
              .map((p) => p.trim())
              .filter((p) => p.length > 0)
            if (parts.length !== 8) {
              throw new Error("proof must contain exactly 8 values")
            }
            const proof = parts.map((p, i) =>
              parseBigInt(p, `proof[${i}]`),
            ) as unknown as readonly [
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
            ]
            const hash = await write("verifyLegacyAndExecute", [
              root,
              signalHash,
              nullifierHash,
              externalNullifierHash,
              proof,
            ])
            return <TxResult hash={hash} />
          }}
        />
      </section>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          "max-w-[60%] text-right break-all" + (mono ? " font-mono" : "")
        }
      >
        {value}
      </span>
    </div>
  )
}
