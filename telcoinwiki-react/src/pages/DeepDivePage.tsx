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
          <a className="toc-chip" href="#deep-network">
            Telcoin Network
          </a>
          <a className="toc-chip" href="#deep-token">
            $TEL Token
          </a>
          <a className="toc-chip" href="#deep-telx">
            TELx Liquidity Engine
          </a>
          <a className="toc-chip" href="#deep-governance">
            Association &amp; Governance
          </a>
          <a className="toc-chip" href="#deep-holdings">
            Telcoin Holdings
          </a>
        </nav>
      </PageIntro>

      <DeepDiveFaqSections />
    </>
  )
}
