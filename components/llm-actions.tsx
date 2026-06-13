"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Copy,
  FileText,
  ChevronDown,
  MessageCircle,
  Asterisk,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * "Open in LLM" / copy-for-LLM menu for the docs page. Lets an agent (or its
 * human) grab the page as Markdown, hand the llms.txt spec to a chat model, or
 * open the raw machine-readable files.
 */
export function LlmActions({ markdown }: { markdown: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function origin() {
    return typeof window !== "undefined" ? window.location.origin : ""
  }

  async function copyMarkdown() {
    setOpen(false)
    try {
      await navigator.clipboard.writeText(markdown)
      toast.success("Copied as Markdown", {
        description: "Page contents are on your clipboard for an LLM.",
      })
    } catch {
      toast.error("Couldn't copy", {
        description: "Clipboard isn't available in this context.",
      })
    }
  }

  function openInLlm(base: string) {
    const prompt = `Read the TrialLand agent docs and help me use the API to claim a human-verified free trial.\n\nLLM-readable spec: ${origin()}/llms-full.txt`
    window.open(`${base}${encodeURIComponent(prompt)}`, "_blank", "noopener")
    setOpen(false)
  }

  function openFile(path: string) {
    window.open(`${origin()}${path}`, "_blank", "noopener")
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Copy className="size-3.5 text-muted-foreground" />
        Copy for LLM
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl"
          >
            <MenuItem icon={Copy} onClick={copyMarkdown}>
              Copy as Markdown for LLMs
            </MenuItem>

            <Divider />

            <MenuItem
              icon={MessageCircle}
              onClick={() => openInLlm("https://chatgpt.com/?q=")}
            >
              Open in ChatGPT
            </MenuItem>
            <MenuItem
              icon={Asterisk}
              onClick={() => openInLlm("https://claude.ai/new?q=")}
            >
              Open in Claude
            </MenuItem>
            <MenuItem
              icon={Search}
              onClick={() => openInLlm("https://www.perplexity.ai/search?q=")}
            >
              Open in Perplexity
            </MenuItem>

            <Divider />

            <MenuItem icon={FileText} onClick={() => openFile("/llms.txt")}>
              View llms.txt
            </MenuItem>
            <MenuItem
              icon={FileText}
              onClick={() => openFile("/llms-full.txt")}
            >
              View llms-full.txt
            </MenuItem>
          </div>
        </>
      )}
    </div>
  )
}

function MenuItem({
  icon: Icon,
  onClick,
  children,
}: {
  icon: typeof Copy
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      {children}
    </button>
  )
}

function Divider() {
  return <div className="my-1.5 h-px bg-border" />
}
