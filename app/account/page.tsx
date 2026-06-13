import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountPanel } from "@/components/auth/account-panel"

export const metadata: Metadata = {
  title: "Your account — TrialLand",
}

export default function AccountPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
            Your account
          </h1>
          <AccountPanel />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
