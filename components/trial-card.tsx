import Link from "next/link"
import { Download, Sparkles } from "lucide-react"
import { TrialPoster } from "@/components/trial-poster"
import { WandMeter } from "@/components/wand-meter"
import { formatClaims, type Trial } from "@/lib/trials"

export function TrialCard({
  trial,
  rank,
  reason,
}: {
  trial: Trial
  rank?: number
  /** Optional "why recommended" label shown under the trial meta. */
  reason?: string
}) {
  return (
    <Link
      href={`/trial/${trial.slug}`}
      className="group relative block w-40 shrink-0 sm:w-44"
    >
      <div className="relative">
        {rank != null && (
          <span className="absolute -left-1 -top-1 z-10 flex size-7 items-center justify-center rounded-full bg-foreground font-mono text-xs font-bold text-background ring-2 ring-background">
            {rank}
          </span>
        )}
        <TrialPoster
          trial={trial}
          className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-primary"
        />
      </div>
      <div className="mt-2 px-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          {trial.name}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-primary">{trial.trialLength}</span>
          <span className="flex items-center gap-1">
            <Download className="size-3" />
            {formatClaims(trial.claims)}
          </span>
        </div>
        <WandMeter remaining={trial.remaining} size={18} className="mt-1.5" />
        {reason && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground/80">
            <Sparkles className="size-3 shrink-0 text-primary" />
            <span className="truncate">{reason}</span>
          </p>
        )}
      </div>
    </Link>
  )
}
