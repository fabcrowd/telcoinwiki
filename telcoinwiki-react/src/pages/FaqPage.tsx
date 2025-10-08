import { FaqExplorer } from '../components/content/FaqExplorer'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'
import { SEARCH_CONFIG } from '../config/search'

export function FaqPage() {
  return (
    <>
      <PageIntro
        id="faq-hero"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="FAQ"
        title="Your bridge from basics to deep dives"
        lede="Search by keyword or filter by topic to locate verified answers. Each response links to Telcoin Association releases, Telcoin.org documentation, or product articles so newcomers can confirm every claim before moving deeper."
      />

      <section id="faq-navigation" className="anchor-offset">
        <h2>Quick routes</h2>
        <div className="card-grid card-grid--cols-3" role="list">
          <article className="card" role="listitem">
            <h3 className="card__title">Governance</h3>
            <p>How proposals move, who votes, and what TEL allocations require in terms of reporting.</p>
            <p>
              <a href="/governance#governance-structure">Go to governance →</a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Network</h3>
            <p>Consensus, validators, and how TEL burn/regen interacts with TELx and TAN layers.</p>
            <p>
              <a href="/network#network-consensus">Go to network →</a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Bank</h3>
            <p>Wallet onboarding, Digital Cash reserves, and compliance touchpoints for everyday users.</p>
            <p>
              <a href="/bank#bank-pillars">Go to bank →</a>
            </p>
          </article>
        </div>
      </section>

      <section id="faq-list" className="anchor-offset">
        <h2 className="sr-only">FAQ results</h2>
        <FaqExplorer faqDataUrl={SEARCH_CONFIG.faqUrl} />
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin product hub', href: 'https://telco.in/', external: true },
          { label: 'Telcoin Association', href: 'https://www.telcoinassociation.org', external: true },
          { label: 'Newsroom', href: 'https://telco.in/newsroom', external: true },
        ]}
      />
    </>
  )
}
