import { ScanLine, Ticket, KeyRound, Fingerprint, Webhook } from "lucide-react"
import { HumanView, AgentView } from "@/components/view-gate"

const humanSteps = [
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

const agentSteps = [
  {
    icon: Fingerprint,
    title: "Bind a verified human",
    body: "Your agent presents a World ID session proving a real, unique human authorized the run. The proof — not an email — is the identity.",
  },
  {
    icon: Ticket,
    title: "Agent claims the code",
    body: "TrialLand returns one non-transferable code per human over the API. Re-running the same claim returns the same code — never a new one.",
  },
  {
    icon: Webhook,
    title: "Redeem programmatically",
    body: "Your agent redeems on the partner and re-presents the human proof. The partner confirms the same human before activating the trial.",
  },
]

function Steps({
  steps,
}: {
  steps: { icon: typeof ScanLine; title: string; body: string }[]
}) {
  return (
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
  )
}

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
          How TrialLand works
        </h2>
        <HumanView>
          <p className="mx-auto mt-2 max-w-xl text-pretty text-sm text-muted-foreground">
            A trial you can actually trust — issued to a verified human and
            impossible to resell.
          </p>
        </HumanView>
        <AgentView>
          <p className="mx-auto mt-2 max-w-xl text-pretty text-sm text-muted-foreground">
            A trial your agent can actually claim — issued to the human behind it
            and impossible to farm.
          </p>
        </AgentView>
      </div>

      <HumanView>
        <Steps steps={humanSteps} />
      </HumanView>
      <AgentView>
        <Steps steps={agentSteps} />
      </AgentView>
    </section>
  )
}
