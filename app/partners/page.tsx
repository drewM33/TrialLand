import Link from "next/link"
import { ArrowRight, Database, KeyRound, ShieldCheck, Webhook } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PartnerDashboard } from "@/components/partner-dashboard"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "For partners — TrialLand",
  description:
    "Offer free trials that can only be claimed once per real human. Receive hashed, non-transferable promo codes and verify the same person at redemption.",
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "One trial per human",
    body: "World ID Proof of Human guarantees each person claims your trial exactly once — no burner emails, no farming.",
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

export default function PartnersPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                For partners
              </p>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Free trials that only real humans can claim.
              </h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                List your trial on TrialLand and reach people who have proven they
                are unique humans — each one able to claim your offer a single time,
                with a code that can never be resold or shared.
              </p>
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

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-14">
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
