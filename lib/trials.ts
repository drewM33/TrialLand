export type TrialCategory =
  | "AI Assistant"
  | "Writing"
  | "Coding"
  | "Research"
  | "Productivity"
  | "Design"
  | "Voice"

export interface Trial {
  slug: string
  name: string
  category: TrialCategory
  tagline: string
  description: string
  trialLength: string
  perk: string
  /** Brand accent color used for poster tiles (any valid CSS color). */
  color: string
  /** Short mark shown on the poster tile. */
  mark: string
  /** Number of humans who have claimed (for trending/stat display). */
  claims: number
  /** Lower number = higher trending rank. */
  rank: number
  featured?: boolean
  madeForYou?: boolean
}

export const trials: Trial[] = [
  {
    slug: "genspark",
    name: "Genspark",
    category: "AI Assistant",
    tagline: "Ask anything, create anything",
    description:
      "The all-in-one AI workspace — slides, sheets, docs, chat, image and video from a single agent. Your human-verified trial unlocks 30 days of Genspark Plus.",
    trialLength: "30-day trial",
    perk: "Plus · Super Agent",
    color: "#ff5a1f",
    mark: "G",
    claims: 41208,
    rank: 1,
    featured: true,
    madeForYou: true,
  },
  {
    slug: "granola",
    name: "Granola",
    category: "Productivity",
    tagline: "The AI notepad for back-to-back meetings",
    description:
      "Notes, actions and memory — handled for you, quietly. Verify once and claim 3 months of Granola Pro, non-transferable.",
    trialLength: "3-month trial",
    perk: "Pro · Unlimited notes",
    color: "#eae8e1",
    mark: "gr",
    claims: 33890,
    rank: 2,
    featured: true,
    madeForYou: true,
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    category: "Research",
    tagline: "Where knowledge begins",
    description:
      "The answer engine with cited, real-time sources. Your verified trial includes 1 month of Perplexity Pro with advanced models.",
    trialLength: "1-month trial",
    perk: "Pro · Pro Search",
    color: "#20b8cd",
    mark: "px",
    claims: 30142,
    rank: 3,
    featured: true,
    madeForYou: true,
  },
  {
    slug: "sintra",
    name: "Sintra",
    category: "AI Assistant",
    tagline: "AI assistants that run your business",
    description:
      "Done-for-you AI helpers for marketing, support and ops, built on frontier LLMs. Verified humans unlock a 14-day Sintra X trial, one per human.",
    trialLength: "14-day trial",
    perk: "Sintra X",
    color: "#ff4d8d",
    mark: "S",
    claims: 26500,
    rank: 4,
    featured: true,
    madeForYou: true,
  },
  {
    slug: "gamma",
    name: "Gamma",
    category: "Design",
    tagline: "A new medium for presenting ideas",
    description:
      "Generate polished decks, docs and websites from a single prompt, powered by LLMs. Claim a verified 1-month Gamma Pro trial.",
    trialLength: "1-month trial",
    perk: "Pro",
    color: "#2b8aef",
    mark: "ga",
    claims: 18900,
    rank: 5,
    madeForYou: true,
  },
  {
    slug: "cursor",
    name: "Cursor",
    category: "Coding",
    tagline: "The AI code editor",
    description:
      "Build software faster with an editor designed for pair-programming with AI. Your verified trial unlocks 14 days of Cursor Pro.",
    trialLength: "14-day trial",
    perk: "Pro · Unlimited",
    color: "#1f2937",
    mark: "cur",
    claims: 24190,
    rank: 6,
    madeForYou: true,
  },
  {
    slug: "jasper",
    name: "Jasper",
    category: "Writing",
    tagline: "AI for marketing teams",
    description:
      "On-brand copy, campaigns and content at scale. Verified humans get a 30-day Jasper Creator trial, non-transferable.",
    trialLength: "30-day trial",
    perk: "Creator",
    color: "#ff7a59",
    mark: "J",
    claims: 11240,
    rank: 7,
  },
  {
    slug: "copy-ai",
    name: "Copy.ai",
    category: "Writing",
    tagline: "Go-to-market on autopilot",
    description:
      "AI workflows for sales and marketing content. Claim a verified 14-day Pro trial for one human.",
    trialLength: "14-day trial",
    perk: "Pro",
    color: "#2f6df6",
    mark: "co",
    claims: 8620,
    rank: 8,
  },
  {
    slug: "lovable",
    name: "Lovable",
    category: "Coding",
    tagline: "Build apps by chatting",
    description:
      "Turn ideas into full-stack apps with natural language. Your verified trial unlocks 1 month of Lovable Pro.",
    trialLength: "1-month trial",
    perk: "Pro",
    color: "#ff4d6d",
    mark: "L",
    claims: 15330,
    rank: 9,
    madeForYou: true,
  },
  {
    slug: "replit",
    name: "Replit",
    category: "Coding",
    tagline: "Code, deploy, ship — with AI",
    description:
      "Build and host apps with Replit Agent. Verified humans claim a 30-day Replit Core trial.",
    trialLength: "30-day trial",
    perk: "Core · Agent",
    color: "#f26207",
    mark: "rpl",
    claims: 9870,
    rank: 10,
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    category: "Voice",
    tagline: "The most realistic AI voices",
    description:
      "Lifelike text-to-speech, dubbing and voice cloning. Claim a verified 2-month Creator trial, one per human.",
    trialLength: "2-month trial",
    perk: "Creator",
    color: "#0b0b0b",
    mark: "11",
    claims: 7430,
    rank: 11,
  },
  {
    slug: "tome",
    name: "Tome",
    category: "Design",
    tagline: "AI-native storytelling",
    description:
      "Generate polished presentations and decks from a prompt. Your verified trial includes 14 days of Tome Pro.",
    trialLength: "14-day trial",
    perk: "Pro",
    color: "#fa3c3c",
    mark: "T",
    claims: 5120,
    rank: 12,
  },
]

export const categories: TrialCategory[] = [
  "AI Assistant",
  "Writing",
  "Coding",
  "Research",
  "Productivity",
  "Design",
  "Voice",
]

export function getTrial(slug: string): Trial | undefined {
  return trials.find((t) => t.slug === slug)
}

export function getTrending(): Trial[] {
  return [...trials].sort((a, b) => a.rank - b.rank)
}

export function getFeatured(): Trial[] {
  return trials.filter((t) => t.featured)
}

export function getMadeForYou(): Trial[] {
  return trials.filter((t) => t.madeForYou)
}

export function getByCategory(category: TrialCategory): Trial[] {
  return trials.filter((t) => t.category === category)
}

export function formatClaims(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

/**
 * Returns true when a hex color is light enough to need dark text/contrast.
 * Uses relative luminance so brands like Granola's cream are handled too.
 */
export function isLightColor(hex: string): boolean {
  const m = hex.trim().replace("#", "")
  if (m.length !== 6) return false
  const r = parseInt(m.slice(0, 2), 16) / 255
  const g = parseInt(m.slice(2, 4), 16) / 255
  const b = parseInt(m.slice(4, 6), 16) / 255
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum > 0.7
}
