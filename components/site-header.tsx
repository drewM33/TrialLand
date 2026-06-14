import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { AuthNav } from "@/components/auth/auth-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="relative z-10 flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src="/logo-gnome-wand.svg"
            alt="TrialLand"
            width={64}
            height={64}
            className="size-9"
            priority
          />
          <span className="font-mono text-xl font-bold tracking-tight text-foreground">
            TrialLand
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm md:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Trials
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="/docs"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="/partners"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            For partners
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground lg:flex">
            <Search className="size-4" />
            <span className="hidden lg:inline">Search trials</span>
          </div>
          <AuthNav />
        </div>
      </div>
    </header>
  )
}
