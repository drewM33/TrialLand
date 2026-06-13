import { cn } from "@/lib/utils"

/**
 * "Trials remaining" gauge. Each trial starts with 500 credits; one wand
 * represents 100. Wands fill left-to-right and partially within a wand, so 400
 * shows 4 full + 1 empty, and 50 shows the first wand half-filled.
 *
 * The wand mirrors TrialLand's copper staff mark. Rendered id-free (an
 * overflow-clipped overlay) so the same trial can repeat on a page safely.
 */

const TOTAL = 500
const PER_WAND = 100
const WANDS = TOTAL / PER_WAND

const COPPER = "#c97f5d"

// viewBox geometry for one wand (8-point star on a staff).
const VB_W = 26
const VB_H = 60

const WAND_PATH = (() => {
  const cx = 13
  const cy = 14
  const outer = 12.5
  const inner = 5.2
  const pts: string[] = []
  for (let k = 0; k < 16; k++) {
    const r = k % 2 === 0 ? outer : inner
    const a = ((-90 + k * 22.5) * Math.PI) / 180
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  const star = `M${pts.join("L")}Z`
  const staff = "M11.3 24 H14.7 V56.5 Q14.7 58 13 58 Q11.3 58 11.3 56.5 Z"
  return `${star} ${staff}`
})()

function Wand({ fill, px }: { fill: number; px: number }) {
  const width = (px * VB_W) / VB_H
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ height: px, width }}
    >
      {/* Empty track */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width={width}
        height={px}
        className="absolute inset-0 block"
        aria-hidden
      >
        <path d={WAND_PATH} fill={COPPER} fillOpacity={0.16} />
      </svg>
      {/* Filled portion, clipped left-to-right */}
      {fill > 0 && (
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: width * fill }}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width={width}
            height={px}
            className="block max-w-none"
            aria-hidden
          >
            <path d={WAND_PATH} fill={COPPER} />
          </svg>
        </span>
      )}
    </span>
  )
}

export function WandMeter({
  remaining,
  size = 22,
  showLabel = true,
  className,
}: {
  remaining: number
  /** Wand height in px. */
  size?: number
  showLabel?: boolean
  className?: string
}) {
  const r = Math.max(0, Math.min(TOTAL, remaining))
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="img"
      aria-label={`${r} of ${TOTAL} trial credits remaining`}
    >
      <span className="flex items-end gap-[3px]">
        {Array.from({ length: WANDS }).map((_, i) => (
          <Wand key={i} px={size} fill={Math.max(0, Math.min(1, r / PER_WAND - i))} />
        ))}
      </span>
      {showLabel && (
        <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {r === 0 ? "Sold out" : `${r} left`}
        </span>
      )}
    </div>
  )
}
