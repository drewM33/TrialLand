import Link from "next/link"
import Image from "next/image"
import { Download, Sparkles } from "lucide-react"
import { WandMeter } from "@/components/wand-meter"
import { cn } from "@/lib/utils"
import { formatClaims, trialLogo, type Trial } from "@/lib/trials"

/* Alternating abstract card backgrounds. Even cards get a "glow/nebula"
 * graphic, odd cards a "wave" graphic, and the hue pair rotates per card so
 * adjacent cards never repeat a palette. */
const GLOWS: [number, number][] = [
  [322, 26], // magenta → amber
  [266, 320], // violet → magenta
  [350, 32], // red → orange
  [212, 280], // blue → violet
]
const WAVES: [number, number][] = [
  [190, 212], // teal → blue
  [158, 188], // green → teal
  [201, 234], // cyan → indigo
  [174, 198], // aqua → teal
]

function glowCss(h1: number, h2: number): string {
  return [
    `radial-gradient(85% 75% at 50% 118%, hsl(${h1} 95% 63% / 0.95) 0%, transparent 58%)`,
    `radial-gradient(70% 55% at 50% -12%, hsl(${h2} 88% 58% / 0.5) 0%, transparent 60%)`,
    `linear-gradient(180deg, hsl(${h2} 55% 17%) 0%, hsl(${h1} 55% 9%) 100%)`,
  ].join(", ")
}

function waveCss(h1: number, h2: number): string {
  return [
    `linear-gradient(122deg, transparent 33%, hsl(${h1} 40% 90% / 0.45) 50%, transparent 64%)`,
    `radial-gradient(130% 95% at 18% 12%, hsl(${h1} 50% 38% / 0.65) 0%, transparent 62%)`,
    `linear-gradient(155deg, hsl(${h2} 52% 27%) 0%, hsl(${h1} 48% 13%) 100%)`,
  ].join(", ")
}

function cardGraphic(index: number): string {
  if (index % 2 === 1) {
    const [h1, h2] = WAVES[Math.floor(index / 2) % WAVES.length]
    return waveCss(h1, h2)
  }
  const [h1, h2] = GLOWS[Math.floor(index / 2) % GLOWS.length]
  return glowCss(h1, h2)
}

export function TrialCard({
  trial,
  rank,
  reason,
  index = 0,
}: {
  trial: Trial
  rank?: number
  /** Optional "why recommended" label shown under the trial meta. */
  reason?: string
  /** Position in its row — drives the alternating background graphic. */
  index?: number
}) {
  const logo = trialLogo(trial.slug)
  const background = cardGraphic(index)

  return (
    <Link
      href={`/trial/${trial.slug}`}
      className="group relative flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 p-5 text-white transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:shadow-lg sm:w-80"
    >
      {/* Abstract graphic background + readability scrim */}
      <div className="absolute inset-0 -z-20" style={{ background }} aria-hidden />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-black/25 to-black/5"
        aria-hidden
      />

      {rank != null && (
        <span className="absolute -left-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full bg-white font-mono text-xs font-bold text-zinc-900 ring-2 ring-black/20">
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
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 font-mono text-lg font-bold text-white ring-1 ring-white/20 backdrop-blur-sm">
            {trial.mark}
          </span>
        )}
        <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {trial.trialLength}
        </span>
      </div>

      {/* Title + category eyebrow */}
      <h3 className="mt-4 text-lg font-semibold leading-tight text-white drop-shadow-sm">
        {trial.name}
      </h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/60">
        {trial.category}
      </p>

      {/* Real product explanation */}
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-white/80 text-pretty">
        {trial.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/15 pt-3">
        <WandMeter remaining={trial.remaining} size={16} light />
        <span className="flex items-center gap-1 text-xs text-white/70">
          <Download className="size-3" />
          {formatClaims(trial.claims)}
        </span>
      </div>

      {reason && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-white/70">
          <Sparkles className="size-3 shrink-0 text-white" />
          <span className="truncate">{reason}</span>
        </p>
      )}
    </Link>
  )
}
