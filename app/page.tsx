import { SiteHeader } from "@/components/site-header"
import { TrendingBar } from "@/components/trending-bar"
import { Hero } from "@/components/hero"
import { TrialRow } from "@/components/trial-row"
import { HowItWorks } from "@/components/how-it-works-section"
import { StatsStrip } from "@/components/stats-strip"
import { SiteFooter } from "@/components/site-footer"
import {
  getTrending,
  getMadeForYou,
  getByCategory,
  categories,
} from "@/lib/trials"

export default function HomePage() {
  const trending = getTrending()
  const madeForYou = getMadeForYou()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <TrendingBar />

      <main className="flex-1">
        <Hero />

        <div id="trending" className="mx-auto max-w-7xl px-4 sm:px-6">
          <TrialRow title="Made for you" trials={madeForYou} />
          <TrialRow title="Trending now" trials={trending} ranked />
          {categories.map((category) => {
            const items = getByCategory(category)
            if (items.length === 0) return null
            return <TrialRow key={category} title={category} trials={items} />
          })}
        </div>

        <HowItWorks />
        <StatsStrip />
      </main>

      <SiteFooter />
    </div>
  )
}
