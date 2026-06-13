"use client"

import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { useViewMode, setViewMode, type ViewMode } from "@/lib/view-mode"

const OPTIONS: { mode: ViewMode; label: string; icon: typeof User }[] = [
  { mode: "human", label: "Human", icon: User },
  { mode: "agent", label: "Agent", icon: Bot },
]

/**
 * Segmented Human | Agent switch that drives the global view mode.
 * `size="sm"` is used for the compact header instance.
 */
export function ViewModeToggle({
  className,
  size = "md",
}: {
  className?: string
  size?: "sm" | "md"
}) {
  const mode = useViewMode()
  const sm = size === "sm"

  return (
    <div
      role="tablist"
      aria-label="View mode"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-1",
        className,
      )}
    >
      {OPTIONS.map(({ mode: m, label, icon: Icon }) => {
        const active = mode === m
        return (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setViewMode(m)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
              sm ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={sm ? "size-3.5" : "size-4"} aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
