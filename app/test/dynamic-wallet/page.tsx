import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DynamicWalletTest } from "@/components/test/dynamic-wallet-test"

export const metadata: Metadata = {
  title: "Dynamic wallet test — TrialLand",
  description: "Sandbox for testing Dynamic Labs embedded wallet creation.",
  robots: { index: false, follow: false },
}

export default function DynamicWalletTestPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
          <div className="mb-6 text-center">
            <p className="text-xs font-medium tracking-wide text-amber-500 uppercase">
              Dev only
            </p>
            <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground">
              Dynamic wallet test
            </h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              Exercise wallet creation and connection without World ID or
              registry steps.
            </p>
          </div>
          <DynamicWalletTest />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
