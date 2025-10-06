import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function AboutPage() {
  return (
    <>
      <PageIntro
        id="about-mission"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="About"
        title="Why this wiki exists"
        lede="Telcoin Wiki is a community project that collects concise answers and official links so newcomers can find trustworthy information without wading through social media threads."
      />

      <section id="about-disclaimer" className="anchor-offset">
        <h2>Unofficial status</h2>
        <div className="notice notice--info">
          <p>
            This site is <strong>not</strong> run by Telcoin Holdings or the Telcoin Association. Always double-check information inside the Telcoin Wallet, on telco.in, and via telcoinassociation.org.
          </p>
        </div>
      </section>

      <section id="about-contribute" className="anchor-offset">
        <h2>How to contribute</h2>
        <ol>
          <li>Read the open issues and discussions on GitHub.</li>
          <li>Submit pull requests with factual improvements, accessibility fixes, or localization help.</li>
          <li>Reference official Telcoin sources when adding or updating content.</li>
        </ol>
        <p>
          <a href="https://github.com/fabcrowd/telcoinwiki" target="_blank" rel="noopener noreferrer">
            GitHub repository →
          </a>
        </p>
      </section>

      <section id="about-roadmap" className="anchor-offset">
        <h2>Roadmap ideas</h2>
        <ul>
          <li>Add more localized quick-start guides that point to official translations.</li>
          <li>Expand TELx analytics coverage with snapshot data visualizations.</li>
          <li>Translate compliance updates into a newcomer-friendly timeline.</li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin product hub', href: 'https://telco.in/', external: true },
          { label: 'Telcoin Association', href: 'https://www.telcoinassociation.org', external: true },
        ]}
      />
    </>
  )
}
