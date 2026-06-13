"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckIcon, ScanLine, ShieldCheck, Loader2 } from "lucide-react"

type Phase = "scan" | "connecting" | "verifying" | "verified"

interface WorldIdModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Title shown in the modal, e.g. "Verify you're human". */
  title?: string
  description?: string
  /** Called once verification "completes". */
  onVerified: () => void
  /** Label for the action this proof authorizes. */
  actionLabel?: string
}

// A deterministic pseudo-QR matrix so it looks like a real World ID QR.
function useQrMatrix(size = 21) {
  const ref = useRef<boolean[][]>()
  if (!ref.current) {
    const grid: boolean[][] = []
    let seed = 1337
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }
    for (let r = 0; r < size; r++) {
      const row: boolean[] = []
      for (let c = 0; c < size; c++) row.push(rand() > 0.5)
      grid.push(row)
    }
    // Carve finder patterns in three corners.
    const carve = (or: number, oc: number) => {
      for (let r = 0; r < 7; r++)
        for (let c = 0; c < 7; c++) {
          const edge = r === 0 || r === 6 || c === 0 || c === 6
          const core = r >= 2 && r <= 4 && c >= 2 && c <= 4
          grid[or + r][oc + c] = edge || core
        }
    }
    carve(0, 0)
    carve(0, size - 7)
    carve(size - 7, 0)
    ref.current = grid
  }
  return ref.current
}

export function WorldIdModal({
  open,
  onOpenChange,
  title = "Verify you're human",
  description = "Scan with World App to prove you're a unique human. No personal data is shared.",
  onVerified,
  actionLabel = "claim this trial",
}: WorldIdModalProps) {
  const [phase, setPhase] = useState<Phase>("scan")
  const matrix = useQrMatrix()

  // Reset phase whenever the modal re-opens.
  useEffect(() => {
    if (open) setPhase("scan")
  }, [open])

  // Drive the simulated state machine once the user "scans".
  useEffect(() => {
    if (phase === "connecting") {
      const t = setTimeout(() => setPhase("verifying"), 1100)
      return () => clearTimeout(t)
    }
    if (phase === "verifying") {
      const t = setTimeout(() => setPhase("verified"), 1500)
      return () => clearTimeout(t)
    }
    if (phase === "verified") {
      const t = setTimeout(() => {
        onVerified()
        onOpenChange(false)
      }, 1100)
      return () => clearTimeout(t)
    }
  }, [phase, onVerified, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-foreground text-background">
            <ShieldCheck className="size-5" />
          </div>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription className="text-balance">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* QR / status surface */}
          <div className="relative flex size-56 items-center justify-center rounded-xl bg-white p-3">
            {(phase === "scan" || phase === "connecting") && (
              <div
                className="grid size-full"
                style={{
                  gridTemplateColumns: `repeat(${matrix.length}, 1fr)`,
                }}
                aria-hidden
              >
                {matrix.flatMap((row, r) =>
                  row.map((on, c) => (
                    <span
                      key={`${r}-${c}`}
                      className={cn(
                        "aspect-square rounded-[1px]",
                        on ? "bg-zinc-900" : "bg-transparent",
                      )}
                    />
                  )),
                )}
                {phase === "scan" && (
                  <span className="pointer-events-none absolute inset-x-3 top-3 h-0.5 animate-[scan_2s_ease-in-out_infinite] bg-primary shadow-[0_0_12px_2px_var(--color-primary)]" />
                )}
              </div>
            )}

            {phase === "connecting" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/85 text-zinc-700">
                <Loader2 className="size-6 animate-spin" />
                <span className="text-xs font-medium">Connecting…</span>
              </div>
            )}

            {phase === "verifying" && (
              <div className="flex flex-col items-center gap-3 text-zinc-800">
                <div className="relative flex size-16 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                  <Loader2 className="size-8 animate-spin text-zinc-900" />
                </div>
                <span className="text-sm font-medium">Generating proof…</span>
                <span className="text-[11px] text-zinc-500">
                  Zero-knowledge · on-device
                </span>
              </div>
            )}

            {phase === "verified" && (
              <div className="flex flex-col items-center gap-3 text-zinc-800">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckIcon className="size-8" />
                </div>
                <span className="text-sm font-semibold">Verified human</span>
              </div>
            )}
          </div>

          {phase === "scan" && (
            <div className="flex w-full flex-col gap-2">
              <Button size="lg" className="w-full" onClick={() => setPhase("connecting")}>
                <ScanLine className="size-4" />
                Simulate World App scan
              </Button>
              <p className="text-center text-xs text-muted-foreground text-pretty">
                Point World App at the code to {actionLabel}. This demo simulates
                the scan and proof generation.
              </p>
            </div>
          )}

          {phase !== "scan" && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              World ID · Proof of Human
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
