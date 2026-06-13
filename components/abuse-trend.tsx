/**
 * Stylized "free trial abuse" trend chart. Static, dependency-free SVG —
 * an upward-noisy series that ends in a sharp spike, mirroring the research
 * visual. Figures are illustrative for the demo narrative.
 */

const SERIES = [
  28, 32, 31, 36, 30, 25, 33, 35, 33, 39, 37, 35, 41, 45, 43, 51, 49, 57, 54,
  61, 59, 98,
]

const MONTHS = [
  "Jul '24",
  "Oct '24",
  "Jan '25",
  "Apr '25",
  "Jul '25",
  "Oct '25",
  "Jan '26",
  "Apr '26",
]

const W = 640
const H = 260
const PAD_X = 14
const PAD_TOP = 28
const PAD_BOT = 30

export function AbuseTrend() {
  const n = SERIES.length
  const max = Math.max(...SERIES)
  const min = Math.min(...SERIES)

  const x = (i: number) => PAD_X + (i / (n - 1)) * (W - 2 * PAD_X)
  const y = (v: number) =>
    PAD_TOP + (1 - (v - min) / (max - min)) * (H - PAD_TOP - PAD_BOT)

  const pts = SERIES.map((v, i) => [x(i), y(v)] as const)
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ")
  const areaPath = `${linePath} L${x(n - 1)},${H - PAD_BOT} L${x(0)},${H - PAD_BOT} Z`

  // The final, near-vertical "exponential" segment, drawn brighter.
  const spikePath = `M${pts[n - 2][0]},${pts[n - 2][1]} L${pts[n - 1][0]},${pts[n - 1][1]}`

  const gridY = [0.25, 0.5, 0.75].map(
    (f) => PAD_TOP + f * (H - PAD_TOP - PAD_BOT),
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#13111c] p-5 sm:p-6">
      <div className="mb-1 text-sm font-semibold text-white">Free trial abuse</div>
      <div className="mb-4 text-xs text-white/50">Across payment networks</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Line chart showing free trial abuse rising over time and spiking sharply in April 2026"
      >
        <defs>
          <linearGradient id="abuseStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
          <linearGradient id="abuseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridY.map((gy, i) => (
          <line
            key={i}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={gy}
            y2={gy}
            stroke="#ffffff"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill="url(#abuseFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="url(#abuseStroke)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={spikePath}
          fill="none"
          stroke="#e879f9"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={pts[n - 1][0]} cy={pts[n - 1][1]} r="4" fill="#e879f9" />

        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={PAD_X + (i / (MONTHS.length - 1)) * (W - 2 * PAD_X)}
            y={H - 8}
            fill="#ffffff"
            fillOpacity="0.45"
            fontSize="11"
            textAnchor={i === 0 ? "start" : i === MONTHS.length - 1 ? "end" : "middle"}
          >
            {m}
          </text>
        ))}
      </svg>
      <p className="mt-3 text-xs text-white/45">
        Abuse 2x&apos;d in 6 months — and went exponential in April.
      </p>
    </div>
  )
}
