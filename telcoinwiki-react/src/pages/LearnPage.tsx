import { Link } from 'react-router-dom'
import { CardGrid } from '../components/content/CardGrid'
import { ContextBox } from '../components/content/ContextBox'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function LearnPage() {
  return (
    <>
      <PageIntro
        id="learn-hero"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Continued learning"
        title="Move from story to source material"
        lede="Follow the new pillar structure—Governance, Network, Bank, Tokenomics, FAQ—and jump straight into official Telcoin references when you are ready to dive deeper."
      >
        <nav className="toc-chips" aria-label="Learn sections">
          <a className="toc-chip" href="#learn-start">
            Pillar pathway
          </a>
          <a className="toc-chip" href="#learn-faq">
            FAQ
          </a>
          <a className="toc-chip" href="#learn-deep-dive">
            Deep dives
          </a>
        </nav>
      </PageIntro>

      <section id="learn-start" className="anchor-offset">
        <h2>Follow the pillar pathway</h2>
        <p>
          The homepage story introduces each pillar at a high level. Use these links when you are ready to read the detailed breakdowns for Governance, Network, Bank, and Tokenomics.
        </p>
        <CardGrid
          columns={2}
          items={[
            {
              id: 'learn-start-governance',
              title: 'Governance accuracy',
              body: (
                <>
                  <p>Understand how the Telcoin Association, councils, and treasuries keep upgrades and incentives accountable.</p>
                  <p>
                    <Link to="/governance">Go to Governance →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'learn-start-network',
              title: 'Network internals',
              body: (
                <>
                  <p>Read how DAG + BFT consensus, GSMA validators, TEL burns, and TELx/TAN layers synchronize the engine.</p>
                  <p>
                    <Link to="/network">Go to Network →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'learn-start-bank',
              title: 'Bank layer experience',
              body: (
                <>
                  <p>See how the Telcoin Wallet, Digital Cash reserves, and licensed ramps produce a fintech-grade flow.</p>
                  <p>
                    <Link to="/bank">Go to Bank →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'learn-start-tokenomics',
              title: 'Tokenomics & incentives',
              body: (
                <>
                  <p>Trace TEL burn and regen mechanics, treasury governance, and the incentive programs that power adoption.</p>
                  <p>
                    <Link to="/tokenomics">Go to Tokenomics →</Link>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="learn-faq" className="anchor-offset">
        <h2>Answers to recurring questions</h2>
        <p>
          The FAQ aggregates community-sourced answers linked to official releases. Use it for quick reference or shareable
          explanations when someone new joins the conversation.
        </p>
        <ContextBox title="FAQ tips">
          <ul>
            <li>Every answer cites an official Telcoin post, policy, or product documentation.</li>
            <li>Search by keyword inside the FAQ for faster filtering across all topics.</li>
            <li>Suggest edits or additions by opening a discussion in the project repository.</li>
          </ul>
        </ContextBox>
        <p>
          <Link className="button" to="/faq">
            Visit the FAQ →
          </Link>
        </p>
      </section>

      <section id="learn-deep-dive" className="anchor-offset">
        <h2>Advance with deep dives and dashboards</h2>
        <p>
          Once the pillars make sense, bookmark detailed documentation, liquidity dashboards, and builder resources.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'learn-deep-dive-pathways',
              title: 'Deep Dive pathways',
              body: (
                <>
                  <p>
                    Explore Telcoin’s network, TEL, TELx, governance, and corporate structure in a single expandable reference.
                  </p>
                  <p>
                    <Link to="/deep-dive">Open the Deep Dive →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'learn-deep-dive-builders',
              title: 'Builder hub',
              body: (
                <>
                  <p>
                    The Builders page links dashboards, GitHub repos, and governance touchpoints for community contributors.
                  </p>
                  <p>
                    <Link to="/builders">Visit the builder hub →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'learn-deep-dive-links',
              title: 'Official links directory',
              body: (
                <>
                  <p>
                    Quickly verify you are visiting official Telcoin properties across products, legal resources, and community
                    channels.
                  </p>
                  <p>
                    <Link to="/links">Browse official links →</Link>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin newsroom', href: 'https://telco.in/newsroom', external: true },
          { label: 'Telcoin Association blog', href: 'https://www.telcoinassociation.org/blog', external: true },
          { label: 'Project repository', href: 'https://github.com/telcoincommunity/telcoinwiki', external: true },
        ]}
      />
    </>
  )
}
