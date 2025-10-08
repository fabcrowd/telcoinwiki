import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { DeepDiveFaqSections } from '../components/deepDive/DeepDiveFaqSections'

export function DeepDivePage() {
  return (
    <>
      <PageIntro
        id="deep-dive-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Deep-Dive"
        title="Learn Telcoin by Pathway"
        lede="Explore the Telcoin ecosystem by topic. Each section expands into concise answers and background that tie into the app, the network, and the bank."
      >
        <nav className="toc-chips" aria-label="Deep-Dive sections">
          <a className="toc-chip" href="#deep-broken-money">
            Broken Money
          </a>
          <a className="toc-chip" href="#deep-telcoin-model">
            Telcoin Model
          </a>
          <a className="toc-chip" href="#deep-engine">
            Engine
          </a>
          <a className="toc-chip" href="#deep-experience">
            Experience
          </a>
          <a className="toc-chip" href="#deep-learn-more">
            Learn More
          </a>
        </nav>
      </PageIntro>

      <DeepDiveFaqSections />
    </>
  )
}
