import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { getTrending, isLightColor } from "@/lib/trials"

/**
 * Top trending bar — horizontally scrollable "containers", each a trial
 * endpoint. Mirrors the ClawHub trending strip.
 */
export function TrendingBar() {
  const trending = getTrending().slice(0, 10)
  return (
    <div className="border-b border-border bg-card/40">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">
        <span className="flex shrink-0 items-center gap-1.5 py-2.5 text-xs font-semibold tracking-wide text-primary uppercase">
          <TrendingUp className="size-3.5" />
          Trending
        </span>
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-2">
          {trending.map((trial, i) => (
            <Link
              key={trial.slug}
              href={`/trial/${trial.slug}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:border-primary/60 hover:bg-muted"
            >
              <span className="font-mono text-[10px] font-bold text-muted-foreground">
                {i + 1}
              </span>
              <span
                className="flex size-4 items-center justify-center rounded-[3px] font-mono text-[8px] font-bold"
                style={{
                  background: trial.color,
                  color: isLightColor(trial.color) ? "#18181b" : "#ffffff",
                }}
                aria-hidden
              >
                {trial.mark}
              </span>
              <span className="font-medium text-foreground">{trial.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
