import { trials, type Trial } from "@/lib/trials"

/**
 * Lightweight content-based recommender for trials.
 *
 * Each trial is turned into a TF-IDF vector over its text (name, category,
 * tagline, description, perk). Similarity between two trials is the cosine of
 * their vectors, then nudged by a few structured signals — shared category,
 * overlapping perk tier, and similar trial length — plus a small popularity
 * prior so that, among equally similar trials, the more-claimed ones surface
 * first.
 *
 * This mirrors the shape of a production content-based model
 * (vectorize -> score -> rank); it's just "trained" on the static catalog at
 * module load instead of from a warehouse.
 */

const STOPWORDS = new Set([
  "the", "and", "for", "with", "your", "you", "from", "that", "this", "are",
  "can", "all", "once", "per", "one", "get", "into", "out", "built", "single",
  "new", "most", "run", "runs", "made", "every", "back", "ask", "anything",
  "create", "where", "begins", "designed", "turn", "ideas", "full", "real",
  // domain boilerplate shared by almost every trial blurb
  "trial", "trials", "verified", "human", "humans", "world", "claim", "claims",
  "code", "codes", "day", "days", "month", "months", "week", "weeks", "non",
  "transferable", "unlock", "unlocks", "includes", "include", "plus", "pro",
])

function trialLengthToDays(s: string): number {
  const m = s.toLowerCase().match(/(\d+)\s*-?\s*(day|week|month)/)
  if (!m) return 30
  const n = parseInt(m[1], 10)
  return m[2] === "month" ? n * 30 : m[2] === "week" ? n * 7 : n
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (w) => (w.length > 2 || w === "ai") && !STOPWORDS.has(w),
  )
}

function docTokens(t: Trial): string[] {
  // Category and perk are repeated to weight those structured fields higher.
  return tokenize(
    [t.name, t.category, t.category, t.tagline, t.description, t.perk, t.perk].join(" "),
  )
}

type Vec = Map<string, number>

function buildModel() {
  const N = trials.length
  const df = new Map<string, number>()
  const tokensBySlug = new Map<string, string[]>()

  for (const t of trials) {
    const toks = docTokens(t)
    tokensBySlug.set(t.slug, toks)
    for (const term of new Set(toks)) df.set(term, (df.get(term) ?? 0) + 1)
  }

  const idf = (term: string) => Math.log((1 + N) / (1 + (df.get(term) ?? 0))) + 1

  const vectors = new Map<string, Vec>()
  for (const t of trials) {
    const toks = tokensBySlug.get(t.slug)!
    const tf = new Map<string, number>()
    for (const term of toks) tf.set(term, (tf.get(term) ?? 0) + 1)

    const vec: Vec = new Map()
    let norm = 0
    for (const [term, freq] of tf) {
      const w = (freq / toks.length) * idf(term)
      vec.set(term, w)
      norm += w * w
    }
    norm = Math.sqrt(norm) || 1
    for (const [term, w] of vec) vec.set(term, w / norm)
    vectors.set(t.slug, vec)
  }

  return { vectors, idf }
}

const model = buildModel()
const maxClaims = Math.max(...trials.map((t) => t.claims))

function cosine(a: Vec, b: Vec): number {
  const [small, large] = a.size < b.size ? [a, b] : [b, a]
  let dot = 0
  for (const [term, w] of small) {
    const o = large.get(term)
    if (o) dot += w * o
  }
  return dot
}

// Terms common enough to be uninformative in a "why" label (e.g. "ai").
const REASON_IDF_CUTOFF = 1.6

function buildReason(base: Trial, other: Trial): string {
  if (base.category === other.category) return `Also ${other.category}`

  const baseVec = model.vectors.get(base.slug)!
  const otherVec = model.vectors.get(other.slug)!
  const shared: Array<[string, number]> = []
  for (const [term, w] of baseVec) {
    const o = otherVec.get(term)
    // Only keep distinctive shared terms so the label is meaningful.
    if (o && model.idf(term) >= REASON_IDF_CUTOFF) shared.push([term, w + o])
  }
  shared.sort((x, y) => y[1] - x[1])
  const keywords = shared.slice(0, 2).map(([term]) => term)
  if (keywords.length) return `Shares ${keywords.join(", ")}`
  return `Popular in ${other.category}`
}

export interface Recommendation {
  trial: Trial
  score: number
  reason: string
}

/**
 * Returns the trials most related to `slug`, best first, with a short reason
 * for each. Cross-category by design — similarity, not just same-category.
 */
export function getRecommendations(slug: string, limit = 8): Recommendation[] {
  const base = trials.find((t) => t.slug === slug)
  if (!base) return []

  const baseVec = model.vectors.get(slug)!
  const baseDays = trialLengthToDays(base.trialLength)
  const basePerk = new Set(tokenize(base.perk))

  return trials
    .filter((t) => t.slug !== slug)
    .map((t) => {
      const sim = cosine(baseVec, model.vectors.get(t.slug)!)
      const categoryBoost = t.category === base.category ? 0.25 : 0

      const perk = new Set(tokenize(t.perk))
      const inter = [...perk].filter((p) => basePerk.has(p)).length
      const union = new Set([...perk, ...basePerk]).size || 1
      const perkBoost = (inter / union) * 0.1

      const lenBoost =
        0.05 *
        Math.max(0, 1 - Math.abs(baseDays - trialLengthToDays(t.trialLength)) / 90)

      const popPrior = 0.05 * (t.claims / maxClaims)

      const score = sim + categoryBoost + perkBoost + lenBoost + popPrior
      return { trial: t, score, reason: buildReason(base, t) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
