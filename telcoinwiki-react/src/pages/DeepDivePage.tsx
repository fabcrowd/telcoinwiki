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
        title="Connect the pillars with deeper references"
        lede="Move beyond the top-level story. Each section answers advanced questions, cites primary Telcoin resources, and links back to the main pillars so you can keep context straight."
      >
        <nav className="toc-chips" aria-label="Deep-Dive sections">
          <a className="toc-chip" href="#deep-governance">
            Governance
          </a>
          <a className="toc-chip" href="#deep-network">
            Network
          </a>
          <a className="toc-chip" href="#deep-bank">
            Bank
          </a>
          <a className="toc-chip" href="#deep-tokenomics">
            Tokenomics
          </a>
          <a className="toc-chip" href="#deep-faq">
            FAQ tiebacks
          </a>
        </nav>
      </PageIntro>

      <DeepDiveFaqSections />
    </>
  )
}
