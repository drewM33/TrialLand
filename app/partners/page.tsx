import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PartnerDashboard } from "@/components/partner-dashboard"
import { HumanView, AgentView } from "@/components/view-gate"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "For partners — TrialLand",
  description:
    "Sybil and multi-account abuse is quietly inflating your CAC and skewing your conversion metrics. TrialLand offers free trials that only real humans can claim — one per person, with non-transferable codes.",
}

const workflows = [
  {
    title: ["Your CAC is", "quietly inflating"],
    eyebrow: "THE PROBLEM",
    body: "Every farmed trial spends real money — tokens, compute, credits, support — on someone who was never going to pay.",
    href: "/docs",
    accentA: "from-cyan-400/35",
    accentB: "to-indigo-400/30",
    chip: "COST LEAK",
  },
  {
    title: ["Conversion", "metrics skewed"],
    eyebrow: "THE PROBLEM",
    body: "Signups and trial-starts look healthy while trial-to-paid quietly craters under bots and burner accounts.",
    href: "/how-it-works",
    accentA: "from-violet-400/35",
    accentB: "to-fuchsia-400/30",
    chip: "METRICS DRIFT",
  },
  {
    title: ["Remove abuse,", "keep growth"],
    eyebrow: "THE FIX",
    body: "Verify the human, not the email. Keep the free trial that drives growth while farmers and resellers are filtered out.",
    href: "/partners",
    accentA: "from-emerald-400/35",
    accentB: "to-sky-400/30",
    chip: "HUMAN VERIFICATION",
  },
]

const principles = [
  {
    title: "One trial per human",
    body: "World ID Proof of Human guarantees each person claims your trial exactly once — no burner emails, no farming, no 25-to-1.",
  },
  {
    title: "Non-transferable codes",
    body: "Each code is bound to the human who claimed it. Re-verification at redemption stops codes being sold or shared.",
  },
  {
    title: "You get the hash, not the human",
    body: "We deliver a SHA-256 hash of the code plus an anonymous nullifier. No personal data ever leaves the user's device.",
  },
  {
    title: "Drop-in verification",
    body: "Validate a code hash and re-check the same human at signup with a single API call. Mocked here, IDKit-ready later.",
  },
]

const stats = [
  {
    value: "2x",
    label: "free-trial abuse in 6 months",
    sub: "Growing exponentially as of April",
  },
  {
    value: "1 in 6",
    label: "signups linked to multi-account abuse",
    sub: "Across payment-network data",
  },
  {
    value: "$500+",
    label: "burned to acquire one paying customer",
    sub: "≈ 25 trials bankrolled per conversion",
  },
]

export default function PartnersPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <p className="text-sm font-semibold text-primary">For partners</p>
            <HumanView>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Free trials that only real humans can claim.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                List your trial on TrialLand and reach people who have proven they
                are unique humans — each one able to claim your offer a single
                time, with a code that can never be resold or shared.
              </p>
            </HumanView>
            <AgentView>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Free trials only human-backed agents can claim.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                List your trial on TrialLand and reach agents that act for verified
                humans — each human able to claim once, with a code that can&apos;t
                be resold, shared, or farmed by a bot fleet.
              </p>
            </AgentView>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="font-medium"
                render={
                  <a
                    href="https://calendly.com/drewmailen33/valiron-ext-meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Become a partner
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="font-medium"
                render={<Link href="/how-it-works" />}
              >
                See how it works
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
            <div className="grid gap-6 lg:grid-cols-3">
              {workflows.map((card) => (
                <article key={card.eyebrow} className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card">
                    <div className="relative h-48 border-b border-border/70 bg-[#0f1117] p-4 text-white">
                      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,#ffffff66_1px,transparent_1px)] [background-size:12px_12px]" />
                      <div
                        className={`absolute -left-16 -top-14 h-44 w-44 rounded-full bg-gradient-to-br ${card.accentA} ${card.accentB} blur-2xl`}
                        aria-hidden
                      />
                      <div
                        className="absolute inset-x-0 top-16 h-16 -skew-y-3 bg-gradient-to-r from-white/10 via-white/5 to-transparent"
                        aria-hidden
                      />
                      <div className="relative">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white/80">
                          {card.chip}
                        </span>
                      </div>
                      <div className="relative mt-6 space-y-1 px-1">
                        {card.title.map((line) => (
                          <div key={line}>
                            <span className="inline-block rounded-sm bg-white px-2 py-1 text-5xl font-bold leading-none tracking-tight text-black">
                              {line}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                        {card.eyebrow}
                      </p>
                      <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                        {card.body}
                      </p>
                      <Button
                        size="sm"
                        className="mt-5 rounded-full bg-foreground text-background hover:bg-foreground/90"
                        render={<Link href={card.href} />}
                      >
                        Learn more
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {principles.map((item) => (
                <div key={item.title}>
                  <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                    {item.title}
                  </h3>
                  <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-black">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-semibold text-sky-300">The problem</p>
            <HumanView>
              <h2 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Free trials have become a Sybil magnet.
              </h2>
              <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/75">
                A free trial is an open invitation — and bots, burner emails, and
                multi-account farmers have RSVP&apos;d. The same people
                you&apos;re trying to win are impersonated thousands of times over,
                and it&apos;s your margin footing the bill.
              </p>
            </HumanView>
            <AgentView>
              <h2 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Agents turn trial abuse into an API call.
              </h2>
              <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/75">
                Scripted signups were already draining trials. Now autonomous
                agents can spin up thousands of burner accounts in minutes — your
                free trial is the easiest endpoint they&apos;ll hit all day, and
                your margin foots the bill.
              </p>
            </AgentView>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#090a0d] text-white">
              <div className="grid gap-px bg-white/10 lg:grid-cols-[1.3fr_1fr]">
                <div className="relative min-h-[300px] bg-[#0b0c10] p-8">
                  <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,#ffffff22_1px,transparent_1px)] [background-size:10px_10px]" />
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M8 18 C 30 10, 45 34, 60 22 S 85 18, 96 50"
                      stroke="currentColor"
                      strokeWidth="0.45"
                      fill="none"
                    />
                    <circle cx="8" cy="18" r="0.8" fill="currentColor" />
                    <circle cx="30" cy="10" r="0.8" fill="currentColor" />
                    <circle cx="45" cy="34" r="0.8" fill="currentColor" />
                    <circle cx="60" cy="22" r="0.8" fill="currentColor" />
                    <circle cx="85" cy="18" r="0.8" fill="currentColor" />
                    <circle cx="96" cy="50" r="0.8" fill="currentColor" />
                  </svg>
                  <div className="relative">
                    <p className="font-mono text-6xl font-bold tracking-tight">
                      {stats[0].value}
                    </p>
                    <p className="mt-2 font-mono text-xs tracking-[0.16em] text-white/65">
                      FREE TRIAL ABUSE
                    </p>
                    <p className="mt-5 max-w-sm text-pretty text-xl text-white/75">
                      {stats[0].label}
                    </p>
                    <p className="mt-2 text-sm text-white/55">{stats[0].sub}</p>
                  </div>
                </div>

                <div className="min-h-[300px] bg-[#0b0c10] p-8">
                  <p className="font-mono text-5xl font-bold tracking-tight">
                    {stats[1].value}
                  </p>
                  <p className="mt-3 font-mono text-xs tracking-[0.16em] text-white/60">
                    SIGNUPS LINKED TO ABUSE
                  </p>
                  <p className="mt-5 text-pretty text-xl text-white/75">
                    {stats[1].label}
                  </p>
                  <p className="mt-2 text-sm text-white/55">{stats[1].sub}</p>
                </div>
              </div>

              <div className="grid gap-px bg-white/10 md:grid-cols-2">
                <div className="min-h-[220px] bg-[#0b0c10] p-8">
                  <p className="font-mono text-5xl font-bold tracking-tight">
                    {stats[2].value}
                  </p>
                  <p className="mt-3 font-mono text-xs tracking-[0.16em] text-white/60">
                    CAC BURN
                  </p>
                  <p className="mt-5 text-pretty text-xl text-white/75">
                    {stats[2].label}
                  </p>
                  <p className="mt-2 text-sm text-white/55">{stats[2].sub}</p>
                </div>
                <div className="min-h-[220px] bg-[#0b0c10] p-8">
                  <p className="font-mono text-5xl font-bold tracking-tight">
                    Lose-lose
                  </p>
                  <p className="mt-3 font-mono text-xs tracking-[0.16em] text-white/60">
                    KEEP TRIAL OR KILL GROWTH
                  </p>
                  <p className="mt-5 text-pretty text-xl text-white/75">
                    You either keep the trial and let abuse eat your margin, or
                    kill it and watch top-of-funnel growth slow.
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    Remove the abuse, not the trial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-6 max-w-2xl">
              <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                Your partner view
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                This is exactly what a partner sees for codes issued from TrialLand:
                privacy-preserving hashed records tied to the same verified human.
              </p>
            </div>
            <PartnerDashboard />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
