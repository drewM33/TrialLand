import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, KeyRound, Ticket, ListChecks, Fingerprint } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CodeTabs, type CodeTab } from "@/components/code-tabs"
import { LlmActions } from "@/components/llm-actions"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Docs — TrialLand for agents",
  description:
    "Claim and redeem human-verified free trials programmatically. SDK, curl, CLI, MCP, and skill examples for the TrialLand agent API.",
}

const tabs: CodeTab[] = [
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

const endpoints = [
  {
    icon: Ticket,
    method: "POST",
    path: "/v1/claims",
    body: "Claim a trial on behalf of a verified human. Idempotent per human + trial.",
  },
  {
    icon: KeyRound,
    method: "POST",
    path: "/v1/redemptions",
    body: "Redeem an issued code on the partner, re-verifying the same human.",
  },
  {
    icon: ListChecks,
    method: "GET",
    path: "/v1/trials",
    body: "List available trials, perks, and trial lengths.",
  },
]

const pageMarkdown = `# TrialLand for agents

Claim and redeem human-verified free trials programmatically. Every claim is gated by a World ID Proof of Human — one non-transferable code per human, per trial.

## Quickstart (CLI)
\`\`\`bash
npm install -g @trialland/cli
trialland login --key tl_live_your_key
trialland claim perplexity --on-behalf-of worldid_session_abc123
\`\`\`

## Endpoints
- POST /v1/claims — claim a trial on behalf of a verified human (idempotent per human + trial)
- POST /v1/redemptions — redeem an issued code, re-verifying the same human
- GET /v1/trials — list available trials and perks

## Authentication
- Authorization: Bearer <TRIALLAND_KEY>
- Body field on_behalf_of: a World ID session (Proof of Human)

Full reference: /llms-full.txt`

export default function DocsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pt-14 pb-12 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">Docs</p>
              <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                TrialLand for agents
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Claim and redeem human-verified free trials programmatically.
                One key, one human-backed agent, one non-transferable code —
                pick the interface your agent already speaks.
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <LlmActions markdown={pageMarkdown} />
            </div>
          </div>

          <div className="mt-8 sm:hidden">
            <LlmActions markdown={pageMarkdown} />
          </div>

          <div className="mt-10">
            <CodeTabs tabs={tabs} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/" />}>
              Browse trials
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              render={<Link href="/how-it-works" />}
            >
              How verification works
            </Button>
          </div>
        </section>

        {/* Endpoints */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground">
              Endpoints
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {endpoints.map((e) => (
                <div
                  key={e.path}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <e.icon className="size-5 text-primary" aria-hidden />
                  </div>
                  <div className="mt-4 flex items-center gap-2 font-mono text-sm">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                      {e.method}
                    </span>
                    <span className="text-foreground">{e.path}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {e.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Auth */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Fingerprint className="size-5 text-primary" aria-hidden />
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                Authenticated by a human, not an email
              </h2>
              <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                Every request carries your{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                  TRIALLAND_KEY
                </code>{" "}
                plus an{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                  on_behalf_of
                </code>{" "}
                World ID session proving a unique human authorized the run.
                Claims are idempotent per human and trial, and codes are
                re-verified against the same human at redemption — so a fleet of
                agents can&apos;t farm an unlimited supply of trials.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
