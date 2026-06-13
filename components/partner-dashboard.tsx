"use client"

import { useEffect, useState } from "react"
import { Database, ShieldCheck, EyeOff } from "lucide-react"
import { getPartnerDB, type PartnerRecord } from "@/lib/store"
import { trials } from "@/lib/trials"
import { Badge } from "@/components/ui/badge"

function nameForSlug(slug: string): string {
  return trials.find((t) => t.slug === slug)?.name ?? slug
}

function shortHash(hash: string): string {
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`
}

export function PartnerDashboard() {
  const [records, setRecords] = useState<PartnerRecord[] | null>(null)

  useEffect(() => {
    setRecords(getPartnerDB().sort((a, b) => b.issuedAt - a.issuedAt))
  }, [])

  const total = records?.length ?? 0
  const redeemed = records?.filter((r) => r.redeemed).length ?? 0

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
        <div className="flex items-center gap-2.5">
          <Database className="size-4 text-primary" aria-hidden />
          <h3 className="font-mono text-sm font-semibold tracking-tight">
            partner_codes
          </h3>
          <Badge variant="secondary" className="font-mono text-[10px]">
            read-only
          </Badge>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span> issued
          </span>
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{redeemed}</span> redeemed
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
        <EyeOff className="size-3.5 shrink-0" aria-hidden />
        <p className="text-pretty">
          {
            "Partners only ever see the hashed code, the per-human nullifier, and redemption status — never the plaintext code or the person's identity."
          }
        </p>
      </div>

      {records === null ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-10 text-center">
          <ShieldCheck className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">No codes issued yet</p>
          <p className="max-w-sm text-pretty text-sm text-muted-foreground">
            Claim a trial from the marketplace, then return here to see the hashed
            record a partner would receive.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Trial</th>
                <th className="px-5 py-3 font-medium">Code hash (SHA-256)</th>
                <th className="px-5 py-3 font-medium">Nullifier</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={`${r.codeHash}-${i}`}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="px-5 py-3 font-medium">{nameForSlug(r.slug)}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {shortHash(r.codeHash)}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {shortHash(r.nullifier)}
                  </td>
                  <td className="px-5 py-3">
                    {r.redeemed ? (
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                        Redeemed
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Issued</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
