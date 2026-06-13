import Link from "next/link"
import { Search, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          One human · one trial · one code
        </span>

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
      </div>
    </section>
  )
}
