import Link from "next/link"
import {
  ArrowRight,
  Database,
  KeyRound,
  ShieldCheck,
  Webhook,
  TrendingUp,
  Users,
  Coins,
  LineChart,
  Scissors,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PartnerDashboard } from "@/components/partner-dashboard"
import { AbuseTrend } from "@/components/abuse-trend"
import { HumanView, AgentView } from "@/components/view-gate"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "For partners — TrialLand",
  description:
    "Sybil and multi-account abuse is quietly inflating your CAC and skewing your conversion metrics. TrialLand offers free trials that only real humans can claim — one per person, with non-transferable codes.",
}

const stats = [
  {
    icon: TrendingUp,
    value: "2x",
    label: "free-trial abuse in 6 months",
    sub: "Growing exponentially as of April",
  },
  {
    icon: Users,
    value: "1 in 6",
    label: "signups linked to multi-account abuse",
    sub: "Across payment-network data",
  },
  {
    icon: Coins,
    value: "$500+",
    label: "burned to acquire one paying customer",
    sub: "≈ 25 trials bankrolled per conversion",
  },
]

const painPoints = [
  {
    icon: Coins,
    title: "Your CAC is quietly inflating",
    body: "Every farmed trial spends real money — tokens, compute, credits, support — on someone who was never going to pay. When 25 trials buy a single conversion, abuse is the line item nobody budgeted for.",
  },
  {
    icon: LineChart,
    title: "Your conversion metrics are skewed",
    body: "Signups and trial-starts look healthy while trial-to-paid quietly craters. You end up optimizing funnels and forecasting revenue against numbers that are padded with bots and burner accounts.",
  },
  {
    icon: Scissors,
    title: "You're forced into a lose-lose",
    body: "Not every failed trial is abuse — but enough are that the economics are rigged. So you either keep the free trial and let abuse eat your margin, or kill it and watch real growth slow.",
  },
]

const benefits = [
  {
    icon: ShieldCheck,
    title: "One trial per human",
    body: "World ID Proof of Human guarantees each person claims your trial exactly once — no burner emails, no farming, no 25-to-1.",
  },
  {
    icon: KeyRound,
    title: "Non-transferable codes",
    body: "Each code is bound to the human who claimed it. Re-verification at redemption stops codes being sold or shared.",
  },
  {
    icon: Database,
    title: "You get the hash, not the human",
    body: "We deliver a SHA-256 hash of the code plus an anonymous nullifier. No personal data ever leaves the user's device.",
  },
  {
    icon: Webhook,
    title: "Drop-in verification",
    body: "Validate a code hash and re-check the same human at signup with a single API call. Mocked here, IDKit-ready later.",
  },
]

const agentBenefits = [
  {
    icon: ShieldCheck,
    title: "One trial per human",
    body: "World ID Proof of Human guarantees each person — agent or not — claims your trial exactly once. No fleets, no burner emails, no 25-to-1.",
  },
  {
    icon: KeyRound,
    title: "Codes bound to the human",
    body: "Each code is tied to the human who authorized the agent. Re-verification at redemption stops codes being resold, shared, or replayed.",
  },
  {
    icon: Database,
    title: "You get the hash, not the human",
    body: "We deliver a SHA-256 hash of the code plus an anonymous nullifier. No personal data ever leaves the user's device.",
  },
  {
    icon: Webhook,
    title: "Built for agent traffic",
    body: "Issue and verify over a single API call, with idempotent claims and human re-checks at signup. Mocked here, IDKit-ready later.",
  },
]

export default function PartnersPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">
                For partners
              </p>
              <HumanView>
                <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                  Free trials that only real humans can claim.
                </h1>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                  List your trial on TrialLand and reach people who have proven
                  they are unique humans — each one able to claim your offer a
                  single time, with a code that can never be resold or shared.
                </p>
              </HumanView>
              <AgentView>
                <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                  Free trials only human-backed agents can claim.
                </h1>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                  List your trial on TrialLand and reach agents that act for
                  verified humans — each human able to claim once, with a code
                  that can&apos;t be resold, shared, or farmed by a bot fleet.
                </p>
              </AgentView>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" className="font-medium">
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
          </div>
        </section>

        {/* The problem */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-rose-400">
                The problem
              </p>
              <HumanView>
                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  Free trials have become a Sybil magnet.
                </h2>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  A free trial is an open invitation — and bots, burner emails,
                  and multi-account farmers have RSVP&apos;d. The same people
                  you&apos;re trying to win are impersonated thousands of times
                  over, and it&apos;s your margin footing the bill.
                </p>
              </HumanView>
              <AgentView>
                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  Agents turn trial abuse into an API call.
                </h2>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  Scripted signups were already draining trials. Now autonomous
                  agents can spin up thousands of burner accounts in minutes —
                  your free trial is the easiest endpoint they&apos;ll hit all
                  day, and your margin foots the bill.
                </p>
              </AgentView>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <AbuseTrend />
              <div className="grid gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                      <s.icon className="size-5 text-rose-400" aria-hidden />
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight text-foreground">
                        {s.value}
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {s.label}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {s.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {painPoints.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10">
                    <p.icon className="size-5 text-rose-400" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background p-5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Option 1
                  </p>
                  <p className="mt-2 font-medium text-foreground">
                    Keep the free trial
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    …and let the abuse keep eating your margin.
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background p-5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Option 2
                  </p>
                  <p className="mt-2 font-medium text-foreground">
                    Kill the free trial
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    …and watch real, top-of-funnel growth slow.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-balance text-lg font-medium text-foreground">
                You shouldn&apos;t have to choose.{" "}
                <span className="text-primary">Remove the abuse, not the trial.</span>
              </p>
            </div>
          </div>
        </section>

        {/* The fix */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold text-primary">
                The fix
              </p>
              <HumanView>
                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  Verify the human, not the email.
                </h2>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  TrialLand gates every claim behind a World ID Proof of Human.
                  You keep the trial that drives growth — while farmers, burner
                  emails, and resold codes simply can&apos;t get through.
                </p>
              </HumanView>
              <AgentView>
                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  Verify the human behind the agent.
                </h2>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  TrialLand gates every claim behind a World ID Proof of Human —
                  so a human-backed agent gets exactly one trial, while bot
                  fleets and burner farms simply can&apos;t get through.
                </p>
              </AgentView>
            </div>
            <HumanView>
              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <b.icon className="size-5 text-primary" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </HumanView>
            <AgentView>
              <div className="grid gap-4 sm:grid-cols-2">
                {agentBenefits.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <b.icon className="size-5 text-primary" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </AgentView>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-6 max-w-2xl">
              <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                Your partner view
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                This is exactly what a third party like Genspark or Perplexity
                would see for codes issued from TrialLand. Claim a trial in the
                marketplace, then watch it appear here as a privacy-preserving
                hashed record.
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
