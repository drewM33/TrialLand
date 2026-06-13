"use client"

import Link from "next/link"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { LogOut, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, clearSession } from "@/lib/session"
import { truncateHash } from "@/lib/crypto"
import { dynamicConfigured } from "@/lib/auth-config"

/** Header auth controls: account chip when signed in, otherwise log in / register. */
export function AuthNav() {
  const session = useSession()

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/login" />}
          className="hidden sm:inline-flex"
        >
          Log in
        </Button>
        <Button size="sm" render={<Link href="/register" />}>
          <UserPlus className="size-3.5" />
          Register
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-xs font-medium text-primary"
        title={session.wallet}
      >
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        {truncateHash(session.wallet)}
      </Link>
      {dynamicConfigured ? <DynamicLogout /> : <DemoLogout />}
    </div>
  )
}

function DemoLogout() {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Log out"
      onClick={() => clearSession()}
    >
      <LogOut className="size-3.5" />
    </Button>
  )
}

function DynamicLogout() {
  const { handleLogOut } = useDynamicContext()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Log out"
      onClick={async () => {
        clearSession()
        try {
          await handleLogOut()
        } catch {
          // ignore
        }
      }}
    >
      <LogOut className="size-3.5" />
    </Button>
  )
}
