"use client"

import { useCallback, useState, type ReactNode } from "react"
import { toast } from "sonner"
import {
  IDKitRequestWidget,
  proofOfHuman,
  type RpContext,
  type IDKitResult,
} from "@worldcoin/idkit"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isEthereumWallet } from "@dynamic-labs/ethereum"
import type { WalletClient } from "viem"
import { WorldIdModal } from "@/components/worldid-modal"
import { sha256, truncateHash } from "@/lib/crypto"
import { getOrCreateIdentity } from "@/lib/store"
import { extractNullifier } from "@/lib/world-id"
import { parseLegacyProofForContract } from "@/lib/world-id-onchain"
import {
  trialCounterAbi,
  trialCounterAddress,
  trialCounterChain,
  trialCounterChainId,
} from "@/lib/trial-counter"
import { worldAppId, worldIdConfigured, worldRpId } from "@/lib/auth-config"

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
 * Renders World ID verification via IDKit 4.x when configured, and falls back
 * to the simulated World App scan otherwise so the flow works in the demo.
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
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [rpContext, setRpContext] = useState<RpContext | null>(null)
  const { primaryWallet } = useDynamicContext()

  const startVerify = useCallback(async () => {
    setPending(true)
    try {
      const res = await fetch("/api/worldid/rp-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data?.detail as string | undefined) ??
            "Could not start World ID verification.",
        )
      }

      const data = (await res.json()) as {
        sig: string
        nonce: string
        created_at: number
        expires_at: number
      }

      setRpContext({
        rp_id: worldRpId as `rp_${string}`,
        nonce: data.nonce,
        created_at: data.created_at,
        expires_at: data.expires_at,
        signature: data.sig,
      })
      setOpen(true)
    } catch (error) {
      toast.error("World ID unavailable", {
        description:
          error instanceof Error
            ? error.message
            : "Could not start World ID verification.",
      })
    } finally {
      setPending(false)
    }
  }, [action])

  async function handleVerify(result: IDKitResult) {
    console.log("HandleVerify ________________>>>>>>>>", result)
    setPending(true)
    try {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        throw new Error(
          "Connect an Ethereum wallet before verifying World ID on-chain.",
        )
      }

      // Decode the IDKit 3.0 legacy proof into the contract's call args.
      const { root, signalHash, nullifierHash, externalNullifierHash, proof } =
        parseLegacyProofForContract(result, { action })

      const walletClient = (await primaryWallet.getWalletClient(
        String(trialCounterChainId),
      )) as WalletClient
      const account = walletClient.account
      if (!account) throw new Error("Wallet account unavailable.")

      // The proof's signalHash is derived from the address bound into the proof
      // (the wallet address), which TrialRegistrar re-derives from `signal`.
      const signalAddress = (signal as `0x${string}` | undefined) ?? account.address
      console.log("signalAddress ________________>>>>>>>>", signalAddress)
      console.log("signalHash ________________>>>>>>>>", signalHash)
     
      const hash = await walletClient.writeContract({
        address: trialCounterAddress,
        abi: trialCounterAbi,
        functionName: "registerRecipient",
        args: [
          root,
          signalAddress,
          signalHash,
          nullifierHash,
          externalNullifierHash,
          proof,
        ],
        account,
        chain: trialCounterChain,
      })
      console.log("TX Hash ________________>>>>>>>>", hash)
      toast.success("World ID verified on-chain", {
        description: truncateHash(hash, 10, 8),
      })
    } catch (error) {
      console.error("Error ________________>>>>>>>>", error)
      // Surface and rethrow so IDKit treats verification as failed and skips onSuccess.
      toast.error("On-chain verification failed", {
        description:
          error instanceof Error
            ? error.message
            : "Could not submit the World ID proof on-chain.",
      })
      throw error
    } finally {
      setPending(false)
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setRpContext(null)
    }
  }

  const preset = signal ? proofOfHuman({ signal }) : proofOfHuman()

  return (
    <>
      {children({ verify: () => void startVerify(), pending })}
      {rpContext ? (
        <IDKitRequestWidget
          key={`${action}:${signal ?? ""}:${rpContext.nonce}`}
          allow_legacy_proofs={true}
          open={open}
          onOpenChange={handleOpenChange}
          app_id={worldAppId as `app_${string}`}
          action={action}
          rp_context={rpContext}        
          preset={preset}
          handleVerify={handleVerify}
          environment={"staging"}
          onSuccess={(result) => onVerified(extractNullifier(result))}
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
