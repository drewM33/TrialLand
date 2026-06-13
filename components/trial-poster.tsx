import { cn } from "@/lib/utils"
import { isLightColor, type Trial } from "@/lib/trials"

/**
 * Brand-colored poster tile for a trial. Avoids external image dependencies
 * by rendering a clean gradient tile with the brand mark, in the spirit of
 * streaming poster art.
 */
export function TrialPoster({
  trial,
  className,
  showPerk = true,
}: {
  trial: Trial
  className?: string
  showPerk?: boolean
}) {
  // Light marks (e.g. Granola cream) need dark text for contrast.
  const lightBrand = isLightColor(trial.color)
  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-lg p-3",
        className,
      )}
      style={{
        background: `linear-gradient(155deg, ${trial.color} 0%, color-mix(in oklab, ${trial.color} 55%, black) 100%)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "font-mono text-2xl font-bold tracking-tight",
            lightBrand ? "text-zinc-900" : "text-white",
          )}
        >
          {trial.mark}
        </span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
            lightBrand
              ? "bg-zinc-900/10 text-zinc-900"
              : "bg-black/25 text-white",
          )}
        >
          {trial.category}
        </span>
      </div>

      <div>
        <p
          className={cn(
            "text-sm leading-tight font-semibold text-balance",
            lightBrand ? "text-zinc-900" : "text-white",
          )}
        >
          {trial.name}
        </p>
        {showPerk && (
          <p
            className={cn(
              "mt-0.5 text-[11px] leading-tight",
              lightBrand ? "text-zinc-700" : "text-white/80",
            )}
          >
            {trial.perk}
          </p>
        )}
      </div>

      {/* Subtle sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}
