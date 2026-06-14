import Link from "next/link"
import Image from "next/image"
import { Download, Sparkles } from "lucide-react"
import { WandMeter } from "@/components/wand-meter"
import { cn } from "@/lib/utils"
import { formatClaims, isLightColor, trialLogo, type Trial } from "@/lib/trials"

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
  const logo = trialLogo(trial.slug)
  const lightBrand = isLightColor(trial.color)

  return (
    <Link
      href={`/trial/${trial.slug}`}
      className="group relative flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg sm:w-80"
    >
      {rank != null && (
        <span className="absolute -left-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full bg-foreground font-mono text-xs font-bold text-background ring-2 ring-background">
          {rank}
        </span>
      )}

      {/* Logo tile + trial length */}
      <div className="flex items-start justify-between gap-3">
        {logo ? (
          <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5">
            <Image
              src={logo}
              alt={`${trial.name} logo`}
              width={48}
              height={48}
              className="size-full object-contain"
            />
          </span>
        ) : (
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl font-mono text-lg font-bold",
              lightBrand ? "text-zinc-900" : "text-white",
            )}
            style={{ backgroundColor: trial.color }}
          >
            {trial.mark}
          </span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-primary">
          {trial.trialLength}
        </span>
      </div>

      {/* Title + category eyebrow */}
      <h3 className="mt-4 text-lg font-semibold leading-tight text-foreground">
        {trial.name}
      </h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {trial.category}
      </p>

      {/* Real product explanation */}
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
        {trial.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
        <WandMeter remaining={trial.remaining} size={16} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Download className="size-3" />
          {formatClaims(trial.claims)}
        </span>
      </div>

      {reason && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground/80">
          <Sparkles className="size-3 shrink-0 text-primary" />
          <span className="truncate">{reason}</span>
        </p>
      )}
    </Link>
  )
}
