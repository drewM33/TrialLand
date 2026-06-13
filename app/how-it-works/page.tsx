import type { Metadata } from "next"
import Link from "next/link"
import {
  ScanLine,
  Ticket,
  Fingerprint,
  ShieldCheck,
  Lock,
  ArrowRight,
  KeyRound,
  UserCheck,
  Webhook,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HumanView, AgentView } from "@/components/view-gate"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "How it works — TrialLand",
  description:
    "How TrialLand uses World ID Proof of Human to issue unique, non-transferable free trial codes — one per real person.",
}

const steps = [
  {
    icon: ScanLine,
    title: "Prove you're human",
    body: "Scan with World App to generate a zero-knowledge World ID proof. It confirms you're a unique person without revealing who you are.",
  },
  {
    icon: Ticket,
    title: "Get a unique code",
    body: "We mint a single promo code bound to your verification. Your per-trial nullifier guarantees one code per human — bots and duplicates are rejected.",
  },
  {
    icon: Lock,
    title: "Partner gets only a hash",
    body: "The partner service receives a hashed copy of your code and your nullifier — never the raw code or your identity. Privacy by architecture.",
  },
  {
    icon: UserCheck,
    title: "Redeem, re-verified",
    body: "At checkout the partner re-checks World ID. If the proven human doesn't match the code's owner, redemption fails. Codes can't be sold or shared.",
  },
]

const agentSteps = [
  {
    icon: Fingerprint,
    title: "Bind a verified human",
    body: "Your agent presents a World ID session proving a unique human authorized the run. The proof is the identity — not an email it can mint at will.",
  },
  {
    icon: Ticket,
    title: "Claim over the API",
    body: "TrialLand mints one code per human and returns it to your agent. The per-trial nullifier makes re-runs idempotent — same human, same code, never a duplicate.",
  },
  {
    icon: Lock,
    title: "Partner gets only a hash",
    body: "The partner receives a hashed copy of the code and the nullifier — never the raw code or the human's identity. Privacy by architecture.",
  },
  {
    icon: Webhook,
    title: "Redeem, re-verified",
    body: "Your agent redeems programmatically and re-presents the human proof. If the human doesn't match the code's owner, redemption fails. Codes can't be sold or replayed.",
  },
]

const concepts = [
  {
    icon: Fingerprint,
    term: "Proof of Human",
    def: "A World ID credential proving there's a unique living person behind the request — the foundation for one-per-person limits.",
  },
  {
    icon: KeyRound,
    term: "Nullifier",
    def: "A per-human, per-action identifier. The same person claiming the same trial always collides, enforcing uniqueness without tracking them across trials.",
  },
  {
    icon: ShieldCheck,
    term: "Zero-knowledge proof",
    def: "Verification happens on your device. You prove you're human without sharing personal data with TrialLand or the partner.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 pt-16 pb-10 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Powered by World ID
          </span>
          <HumanView>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              One real human, one free trial
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              TrialLand ends trial abuse by issuing codes that are tied to a
              verified person — not an email address you can spin up infinitely.
            </p>
          </HumanView>
          <AgentView>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              One verified human, one agent claim
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              TrialLand lets agents claim trials over the API — each one tied to
              a verified human, so a fleet of agents can&apos;t farm an endless
              supply of trials.
            </p>
          </AgentView>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <HumanView>
            <ol className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-6"
                >
                  <span className="absolute right-5 top-5 font-mono text-sm text-muted-foreground/50">
                    0{i + 1}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </HumanView>
          <AgentView>
            <ol className="grid gap-4 sm:grid-cols-2">
              {agentSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-6"
                >
                  <span className="absolute right-5 top-5 font-mono text-sm text-muted-foreground/50">
                    0{i + 1}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </AgentView>
        </section>

        {/* Concepts */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground">
              The concepts behind it
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {concepts.map((c) => (
                <div
                  key={c.term}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <c.icon className="size-5 text-primary" />
                  <h3 className="mt-3 font-semibold text-foreground">
                    {c.term}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {c.def}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground">
            Claim your first verified trial
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            Browse the catalog and unlock a trial that&apos;s truly yours.
          </p>
          <Button size="lg" className="mt-6" render={<Link href="/" />}>
            Browse trials
            <ArrowRight className="size-4" />
          </Button>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
