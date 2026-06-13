"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrialCard } from "@/components/trial-card"
import type { Trial } from "@/lib/trials"

export function TrialRow({
  title,
  trials,
  ranked = false,
  reasons,
}: {
  title: string
  trials: Trial[]
  ranked?: boolean
  /** Optional map of trial slug -> "why recommended" label. */
  reasons?: Record<string, string>
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" })
  }

  return (
    <section className="py-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-1"
      >
        {trials.map((trial, i) => (
          <TrialCard
            key={trial.slug}
            trial={trial}
            rank={ranked ? i + 1 : undefined}
            reason={reasons?.[trial.slug]}
          />
        ))}
      </div>
    </section>
  )
}
