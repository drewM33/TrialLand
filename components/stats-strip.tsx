import { Users, Ticket, Building2, ShieldCheck, Bot, Code2 } from "lucide-react"
import { HumanView, AgentView } from "@/components/view-gate"

const humanStats = [
  { icon: Users, value: "182k", label: "humans verified" },
  { icon: Ticket, value: "236k", label: "codes issued" },
  { icon: Building2, value: "48", label: "partners" },
  { icon: ShieldCheck, value: "0", label: "transfers possible" },
]

const agentStats = [
  { icon: Bot, value: "94k", label: "agent claims" },
  { icon: Ticket, value: "236k", label: "codes issued" },
  { icon: Code2, value: "48", label: "partner APIs" },
  { icon: ShieldCheck, value: "1:1", label: "human per agent" },
]

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </span>
      <div>
        <div className="font-mono text-xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <HumanView>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {humanStats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </HumanView>
        <AgentView>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {agentStats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </AgentView>
      </div>
    </section>
  )
}
