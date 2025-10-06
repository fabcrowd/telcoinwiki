import { Link } from 'react-router-dom'
import { FaqExplorer } from '../components/content/FaqExplorer'
import { PageIntro } from '../components/content/PageIntro'
import { HeroFloatingChips } from '../components/home/HeroFloatingChips'
import { HeroTicker } from '../components/home/HeroTicker'
import { HeroTypingLoop } from '../components/home/HeroTypingLoop'
import { SEARCH_CONFIG } from '../config/search'

export function HomePage() {
  return (
    <>
      <PageIntro
        id="home-hero"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tc-blue-sky)_0%,transparent_65%)] opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(85,51,255,0.3)_0%,transparent_70%)] mix-blend-screen" />
            <HeroFloatingChips />
          </>
        }
        eyebrow={<HeroTypingLoop />}
        title="Understand the Telcoin platform in minutes"
        lede="This unofficial wiki curates verified answers, onboarding checklists, and direct links to Telcoin Association and Telcoin company resources so newcomers can get started with confidence."
      >
        <div className="flex flex-col gap-6">
          <HeroTicker />
          <div className="notice notice--info" role="note">
            <p className="notice__title">Unofficial helper</p>
            <p>
              Always confirm details inside the Telcoin Wallet or through official Association releases. The community keeps this wiki current, but the authoritative word lives at telco.in and telcoinassociation.org.
            </p>
          </div>
        </div>
      </PageIntro>

      <section id="learning-pathways" className="lp anchor-offset">
        <div className="lp-head">
          <h2>Learning pathways</h2>
          <p className="lp-lead">
            Five curated tracks connect you to the official docs and community explainers that answer the most common Telcoin
            questions.
          </p>
        </div>
        <div className="lp-grid" role="list">
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Orientation</span>
            <h3 className="lp-title">Understand the ecosystem</h3>
            <p className="lp-body">
              See how the Wallet, Telcoin Network, and Association work together before you dive into product specifics.
            </p>
            <p className="lp-cta">
              <Link to="/start-here">Start the quickstart</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Wallet basics</span>
            <h3 className="lp-title">Set up and secure your app</h3>
            <p className="lp-body">
              Walk through verification, recovery phrases, and security best practices to keep your account protected.
            </p>
            <p className="lp-cta">
              <Link to="/wallet">Open the wallet playbook</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Digital Cash</span>
            <h3 className="lp-title">Learn about stable-value assets</h3>
            <p className="lp-body">
              Understand supported e-money tokens, how minting works, and where to monitor reserve disclosures.
            </p>
            <p className="lp-cta">
              <Link to="/digital-cash">Explore Digital Cash</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Remittances</span>
            <h3 className="lp-title">Move money across borders</h3>
            <p className="lp-body">
              Track active corridors, payout partners, and pricing straight from official Telcoin Wallet updates.
            </p>
            <p className="lp-cta">
              <Link to="/remittances">Check remittance corridors</Link>
            </p>
          </article>
          <article className="lp-card" role="listitem">
            <span className="lp-eyebrow">Deep dive</span>
            <h3 className="lp-title">Go beyond the basics</h3>
            <p className="lp-body">
              Connect with TEL token utility, TELx liquidity programs, and governance resources when you’re ready for advanced
              topics.
            </p>
            <p className="lp-cta">
              <Link to="/deep-dive">Review deep-dive guides</Link>
            </p>
          </article>
        </div>
      </section>

      <section id="faq" className="faq anchor-offset" aria-labelledby="faq-heading">
        <h2 id="faq-heading">FAQs</h2>
        <FaqExplorer faqDataUrl={SEARCH_CONFIG.faqUrl} />
      </section>
    </>
  )
}
