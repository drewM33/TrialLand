import type { ReactNode } from "react"

/**
 * Server-friendly content gates for the global Human/Agent view mode.
 *
 * Both variants are rendered into the DOM; CSS (driven by the `mode-agent`
 * class on <html>) shows exactly one. The wrappers use `display: contents`
 * when visible, so they never disturb the surrounding grid/flex layout.
 */

export function HumanView({ children }: { children: ReactNode }) {
  return <div className="human-view">{children}</div>
}

export function AgentView({ children }: { children: ReactNode }) {
  return <div className="agent-view">{children}</div>
}
