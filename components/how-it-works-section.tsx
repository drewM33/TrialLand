import { ScanLine, Ticket, KeyRound } from "lucide-react"

const steps = [
  {
    icon: ScanLine,
    title: "Prove you're human",
    body: "Scan the World ID QR with World App. A zero-knowledge proof confirms you're a unique human — no personal data leaves your device.",
  },
  {
    icon: Ticket,
    title: "Get your code",
    body: "TrialLand mints a unique, non-transferable promo code bound to your verification. The partner receives only a hashed copy.",
  },
  {
    icon: KeyRound,
    title: "Redeem on the partner",
    body: "Sign up on the partner's site, enter your code, and re-scan World ID. They confirm the same human owns the code before activating.",
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
          How TrialLand works
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-pretty text-sm text-muted-foreground">
          A trial you can actually trust — issued to a verified human and
          impossible to resell.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative rounded-xl border border-border bg-card p-6"
          >
            <span className="absolute right-5 top-5 font-mono text-3xl font-bold text-muted/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <step.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
