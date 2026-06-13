import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RegisterFlow } from "@/components/auth/register-flow"

export const metadata: Metadata = {
  title: "Register — TrialLand",
  description:
    "Register with World ID, create your wallet on Dynamic, and bind it on chain so you can claim human-verified trials.",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
          <div className="mb-6 text-center">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground">
              Create your TrialLand identity
            </h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              One verified human, one wallet. Register once to claim trials
              across every partner.
            </p>
          </div>
          <RegisterFlow />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
