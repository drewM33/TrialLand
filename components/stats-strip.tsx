import { Users, Ticket, Building2, ShieldCheck } from "lucide-react"

const stats = [
  { icon: Users, value: "182k", label: "humans verified" },
  { icon: Ticket, value: "236k", label: "codes issued" },
  { icon: Building2, value: "48", label: "partners" },
  { icon: ShieldCheck, value: "0", label: "transfers possible" },
]

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4.5" />
            </span>
            <div>
              <div className="font-mono text-xl font-bold text-foreground">
                {value}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
