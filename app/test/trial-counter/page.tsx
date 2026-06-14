import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrialCounterTest } from "@/components/test/trial-counter-test"

export const metadata: Metadata = {
  title: "TrialCounter test — TrialLand",
  description:
    "Dev sandbox for calling all VerifyLegacyV3 (TrialCounter) contract functions via Dynamic wallet.",
  robots: { index: false, follow: false },
}

export default function TrialCounterTestPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="mb-6 text-center">
            <p className="text-xs font-medium tracking-wide text-amber-500 uppercase">
              Dev only
            </p>
            <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground">
              TrialCounter contract test
            </h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              Exercise every function on the deployed VerifyLegacyV3 contract
              using your Dynamic wallet on Sepolia.
            </p>
          </div>
          <TrialCounterTest />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
