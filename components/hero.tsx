import Link from "next/link"
import { Search, ShieldCheck, Terminal, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { HumanView, AgentView } from "@/components/view-gate"

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

          {/* API snippet */}
          <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
              <Terminal className="size-3.5 text-primary" />
              POST /v1/claims
            </div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground">
              <code>{`{
  "trial": "perplexity",
  "on_behalf_of": "<worldid_session>"
}`}</code>
            </pre>
          </div>

          <div className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="#trending" />}>
              Browse trials
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              render={<Link href="/how-it-works" />}
            >
              Agent docs
            </Button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Codes are bound to the human behind the agent — partners only get the
            hash.
          </p>
        </AgentView>
      </div>
    </section>
  )
}
