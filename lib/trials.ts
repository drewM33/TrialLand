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
  /** Trial credits remaining out of 500 (1 wand = 100 credits). */
  remaining: number
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
      "An all-in-one AI agent that runs autonomous Super Agent workflows — researching, completing multi-step tasks, and generating slides, sheets, docs, images, and video from a single chat.",
    trialLength: "30-day trial",
    perk: "Plus · Super Agent",
    color: "#ff5a1f",
    mark: "G",
    claims: 41208,
    remaining: 380,
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
      "An AI notetaker that transcribes your meetings and turns them into structured summaries and action items — capturing system audio directly, with no bot joining the call.",
    trialLength: "3-month trial",
    perk: "Pro · Unlimited notes",
    color: "#eae8e1",
    mark: "gr",
    claims: 33890,
    remaining: 500,
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
      "An AI answer engine that responds to questions with concise, up-to-date answers backed by cited web sources, with follow-ups and focused search modes.",
    trialLength: "1-month trial",
    perk: "Pro · Pro Search",
    color: "#20b8cd",
    mark: "px",
    claims: 30142,
    remaining: 240,
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
      "A suite of ready-made AI helpers that handle marketing, sales, support, and operations tasks from a single chat-style dashboard.",
    trialLength: "14-day trial",
    perk: "Sintra X",
    color: "#ff4d8d",
    mark: "S",
    claims: 26500,
    remaining: 50,
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
      "An AI design tool that turns a single prompt into polished presentations, documents, and websites — handling layout, copy, and visuals automatically.",
    trialLength: "1-month trial",
    perk: "Pro",
    color: "#2b8aef",
    mark: "ga",
    claims: 18900,
    remaining: 310,
    rank: 5,
    madeForYou: true,
  },
  {
    slug: "cursor",
    name: "Cursor",
    category: "Coding",
    tagline: "The AI code editor",
    description:
      "An AI-first code editor (built on VS Code) that writes, edits, and refactors code through natural-language chat, inline edits, and codebase-aware autocomplete.",
    trialLength: "14-day trial",
    perk: "Pro · Unlimited",
    color: "#1f2937",
    mark: "cur",
    claims: 24190,
    remaining: 175,
    rank: 6,
    madeForYou: true,
  },
  {
    slug: "jasper",
    name: "Jasper",
    category: "Writing",
    tagline: "AI for marketing teams",
    description:
      "An AI content platform for marketing teams that produces on-brand copy for ads, blogs, emails, and campaigns, with a shared brand voice across outputs.",
    trialLength: "30-day trial",
    perk: "Creator",
    color: "#ff7a59",
    mark: "J",
    claims: 11240,
    remaining: 460,
    rank: 7,
  },
  {
    slug: "copy-ai",
    name: "Copy.ai",
    category: "Writing",
    tagline: "Go-to-market on autopilot",
    description:
      "A go-to-market AI platform that automates sales and marketing workflows, generating outbound copy and content from your own data and prompts.",
    trialLength: "14-day trial",
    perk: "Pro",
    color: "#2f6df6",
    mark: "co",
    claims: 8620,
    remaining: 90,
    rank: 8,
  },
  {
    slug: "lovable",
    name: "Lovable",
    category: "Coding",
    tagline: "Build apps by chatting",
    description:
      "An AI app builder that turns natural-language prompts into full-stack web apps you can preview, edit, and deploy — no setup required.",
    trialLength: "1-month trial",
    perk: "Pro",
    color: "#ff4d6d",
    mark: "L",
    claims: 15330,
    remaining: 400,
    rank: 9,
    madeForYou: true,
  },
  {
    slug: "replit",
    name: "Replit",
    category: "Coding",
    tagline: "Code, deploy, ship — with AI",
    description:
      "A browser-based coding platform whose AI Agent builds, runs, and deploys complete apps from a prompt — write, host, and ship without local setup.",
    trialLength: "30-day trial",
    perk: "Core · Agent",
    color: "#f26207",
    mark: "rpl",
    claims: 9870,
    remaining: 25,
    rank: 10,
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    category: "Voice",
    tagline: "The most realistic AI voices",
    description:
      "An AI voice platform for ultra-realistic text-to-speech, dubbing, and voice cloning across dozens of languages and use cases.",
    trialLength: "2-month trial",
    perk: "Creator",
    color: "#0b0b0b",
    mark: "11",
    claims: 7430,
    remaining: 130,
    rank: 11,
  },
  {
    slug: "tome",
    name: "Tome",
    category: "Design",
    tagline: "AI-native storytelling",
    description:
      "An AI storytelling tool that generates presentation-style decks and pages from a prompt, formatting copy and visuals into a narrative automatically.",
    trialLength: "14-day trial",
    perk: "Pro",
    color: "#fa3c3c",
    mark: "T",
    claims: 5120,
    remaining: 0,
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

/** Slugs that have a real brand logo asset in /public/logos. */
export const trialsWithLogo = new Set<string>([
  "genspark", "granola", "perplexity", "sintra", "gamma", "cursor",
  "jasper", "copy-ai", "lovable", "replit", "elevenlabs",
])

/** Returns the brand logo path for a trial, or null to fall back to its mark. */
export function trialLogo(slug: string): string | null {
  return trialsWithLogo.has(slug) ? `/logos/${slug}.png` : null
}

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
