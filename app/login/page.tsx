import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LoginFlow } from "@/components/auth/login-flow"

export const metadata: Metadata = {
  title: "Log in — TrialLand",
  description:
    "Log in with the wallet you registered with World ID. Powered by Dynamic.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
          <div className="mb-6 text-center">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              Log in with your registered wallet to manage and claim trials.
            </p>
          </div>
          <LoginFlow />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
