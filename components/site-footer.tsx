import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="TrialLand"
            width={396}
            height={320}
            className="h-9 w-auto"
          />
          <span className="font-mono text-xl font-bold tracking-tight text-foreground">
            TrialLand
          </span>
        </div>
        <p className="max-w-md text-sm text-muted-foreground text-pretty">
          One human, one trial, one non-transferable code. Verified with World
          ID.
        </p>
        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Trials
          </Link>
          <Link href="/how-it-works" className="hover:text-foreground">
            How it works
          </Link>
          <Link href="/partners" className="hover:text-foreground">
            For partners
          </Link>
        </nav>
      </div>
    </footer>
  )
}
