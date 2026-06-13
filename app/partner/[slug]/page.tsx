import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { PartnerRedeem } from "@/components/partner-redeem"
import { getTrial, trials } from "@/lib/trials"

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
  return {
    title: trial ? `Redeem on ${trial.name} — TrialLand demo` : "Redeem",
  }
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const trial = getTrial(slug)
  if (!trial) notFound()

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      {/* Mock partner site chrome — intentionally distinct from TrialLand */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-sm font-medium text-foreground">
            {trial.name}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Partner of TrialLand
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:px-6">
        <Link
          href={`/trial/${trial.slug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to trial
        </Link>

        <PartnerRedeem trial={trial} />

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground text-pretty">
          This is a simulated partner checkout demonstrating how a third party
          validates a TrialLand code and re-verifies World ID. No real account is
          created.
        </p>
      </main>
    </div>
  )
}
