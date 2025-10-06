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
        title="Filterable Telcoin FAQ"
        lede="Search by keyword or filter by topic to find trusted answers. Every entry links back to Telcoin Association or Telcoin product resources for verification."
      />

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
