import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, Download, Clock, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrialPoster } from "@/components/trial-poster"
import { TrialRow } from "@/components/trial-row"
import { ClaimPanel } from "@/components/claim-panel"
import { Badge } from "@/components/ui/badge"
import {
  getTrial,
  getByCategory,
  formatClaims,
  trials,
} from "@/lib/trials"

export function generateStaticParams() {
  return trials.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const trial = getTrial(slug)
  if (!trial) return { title: "Trial not found — TrialLand" }
  return {
    title: `${trial.name} free trial — TrialLand`,
    description: `${trial.tagline}. Claim a verified, non-transferable ${trial.name} trial code with World ID.`,
  }
}

export default async function TrialPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const trial = getTrial(slug)
  if (!trial) notFound()

  const related = getByCategory(trial.category).filter(
    (t) => t.slug !== trial.slug,
  )

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Ambient brand glow */}
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-40"
            style={{
              background: `radial-gradient(60% 100% at 30% 0%, ${trial.color} 0%, transparent 70%)`,
            }}
            aria-hidden
          />

          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All trials
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Left: details */}
              <div>
                <div className="flex gap-5">
                  <div className="w-32 shrink-0 sm:w-40">
                    <TrialPoster trial={trial} />
                  </div>
                  <div className="min-w-0">
                    <Badge variant="outline">{trial.category}</Badge>
                    <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      {trial.name}
                    </h1>
                    <p className="mt-1 text-pretty text-base text-muted-foreground">
                      {trial.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Clock className="size-4" />
                        {trial.trialLength}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Download className="size-4" />
                        {formatClaims(trial.claims)} claimed
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="size-4" />
                        {trial.perk}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                  {trial.description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      title: "Verified human only",
                      body: "Each code requires a World ID Proof of Human. Bots can't farm trials.",
                    },
                    {
                      title: "One per person",
                      body: `Your nullifier ensures you can claim ${trial.name} exactly once.`,
                    },
                    {
                      title: "Non-transferable",
                      body: "Codes are bound to you and re-verified at redemption. No reselling.",
                    },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <h3 className="text-sm font-semibold text-foreground">
                        {f.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
                        {f.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: claim panel */}
              <div className="lg:sticky lg:top-20 lg:self-start">
                <ClaimPanel trial={trial} />
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
            <TrialRow title={`More ${trial.category}`} trials={related} />
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
