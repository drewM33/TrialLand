import Link from "next/link"
import { Search, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeTabs, type CodeTab } from "@/components/code-tabs"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { HumanView, AgentView } from "@/components/view-gate"

const agentTabs: CodeTab[] = [
  {
    id: "sdk",
    label: "sdk",
    filename: "index.ts",
    code: `import { TrialLand } from "@trialland/sdk"

const tl = new TrialLand({ apiKey: process.env.TRIALLAND_KEY })

// Claim a trial on behalf of a verified human
const claim = await tl.claims.create({
  trial: "perplexity",
  onBehalfOf: worldIdSession, // World ID Proof of Human
})

console.log(claim.code) // PERP-V8UZ-PCU4 (non-transferable)`,
  },
  {
    id: "curl",
    label: "curl",
    filename: "bash",
    code: `curl -X POST https://api.trialland.dev/v1/claims \\
  -H "Authorization: Bearer $TRIALLAND_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "trial": "perplexity",
    "on_behalf_of": "<worldid_session>"
  }'`,
  },
  {
    id: "cli",
    label: "cli",
    filename: "bash",
    code: `# Hand to your Claude Code, Codex, or Cursor agent.
npm install -g @trialland/cli
trialland login --key tl_live_your_key

trialland claim perplexity \\
  --on-behalf-of worldid_session_abc123`,
  },
  {
    id: "mcp",
    label: "mcp",
    filename: "mcp.json",
    code: `{
  "mcpServers": {
    "trialland": {
      "command": "npx",
      "args": ["-y", "@trialland/mcp"],
      "env": { "TRIALLAND_KEY": "tl_live_your_key" }
    }
  }
}`,
  },
  {
    id: "skill",
    label: "skill",
    filename: "SKILL.md",
    code: `---
name: claim-trial
description: Claim a human-verified free trial on behalf of the current user.
---

Use the TrialLand API to claim a non-transferable trial code.
1. Confirm a World ID Proof of Human session for the user.
2. POST /v1/claims with { trial, on_behalf_of }.
3. Return the issued code. Re-runs are idempotent.`,
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--color-primary) 22%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-3xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-24">
        <ViewModeToggle />

        {/* ── Human view ─────────────────────────────────────────────── */}
        <HumanView>
          <h1 className="mt-6 text-balance font-mono text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Free trials,
            <br />
            <span className="text-primary">made for real humans.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Prove you&apos;re a unique human with World ID and claim a
            non-transferable promo code. No bots, no recycled trials — just one
            per person, per service.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm focus-within:border-primary/60">
            <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search Genspark, Granola, Perplexity…"
              aria-label="Search trials"
              className="h-9 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button size="lg" className="shrink-0" render={<Link href="#trending" />}>
              Browse trials
            </Button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Partners only ever receive a hashed copy of your code.
          </p>
        </HumanView>

        {/* ── Agent view ─────────────────────────────────────────────── */}
        <AgentView>
          <h1 className="mt-6 text-balance font-mono text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Free trials,
            <br />
            <span className="text-primary">provisioned for your agents.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Let your agent claim and redeem trials on behalf of a verified
            human. One human-backed agent, one trial, one code — no farming, no
            burner accounts, no Sybil swarm.
          </p>

          <div className="mx-auto mt-8 max-w-3xl text-left">
            <CodeTabs tabs={agentTabs} />
          </div>

          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-start gap-3">
            <Button size="lg" render={<Link href="#trending" />}>
              Browse trials
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="secondary" render={<Link href="/how-it-works" />}>
              How verification works
            </Button>
          </div>
        </AgentView>
      </div>
    </section>
  )
}
