"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CodeTab {
  id: string
  label: string
  /** Filename shown in the window chrome (e.g. "index.ts", "bash"). */
  filename: string
  code: string
}

/** Comment lines get a soft green, mirroring a terminal highlighter. */
function CodeBody({ code }: { code: string }) {
  return (
    <code>
      {code.split("\n").map((line, i) => {
        const t = line.trimStart()
        const isComment = t.startsWith("#") || t.startsWith("//")
        return (
          <span
            key={i}
            className={cn("block", isComment && "text-emerald-400/70")}
          >
            {line.length ? line : "\u00A0"}
          </span>
        )
      })}
    </code>
  )
}

/**
 * Tabbed code sample modeled after agent-API docs: a row of language tabs over
 * a dark terminal panel with traffic-light chrome and a copy button.
 */
export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(tabs[0].id)
  const [copied, setCopied] = useState(false)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard unavailable (insecure context / no focus) — no-op.
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Code samples"
        className="flex items-center gap-6 border-b border-border"
      >
        {tabs.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActive(t.id)
                setCopied(false)
              }}
              className={cn(
                "relative -mb-px py-2.5 font-mono text-sm transition-colors",
                isActive
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-[#0c0c0e]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="font-mono text-xs text-white/50">
              {current.filename}
            </span>
          </div>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
            aria-label="Copy code"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "copied" : "copy"}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-white/90">
          <CodeBody code={current.code} />
        </pre>
      </div>
    </div>
  )
}
