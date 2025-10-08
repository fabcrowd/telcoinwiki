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
        eyebrow="Pillar five"
        title="Keep learning with the Telcoin community"
        lede="Bookmark deeper references once you are comfortable with the basics. Each guide links back to official Telcoin sources."
      >
        <nav className="toc-chips" aria-label="Learn sections">
          <a className="toc-chip" href="#learn-start">
            Research path
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
        <h2>Start your research</h2>
        <p>
          Work through the core concepts in order: understand the problem, review the model, and practice wallet safety. Use the
          resources below to build a foundation quickly.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'learn-start-problem',
              title: 'Review the problem space',
              body: (
                <>
                  <p>Begin with the Problem pillar to understand why Telcoin focuses on mobile-first remittances and stable value.</p>
                  <p>
                    <Link to="/problem">Go to the Problem pillar →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'learn-start-experience',
              title: 'Practice wallet safety',
              body: (
                <>
                  <p>
                    The Experience pillar walks through onboarding, sending, and account security in the Telcoin Wallet.
                  </p>
                  <p>
                    <Link to="/experience">Go to the Experience pillar →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'learn-start-engine',
              title: 'Understand the engine',
              body: (
                <>
                  <p>
                    Dive into the Engine pillar to see how the network, ramps, and liquidity work together behind the scenes.
                  </p>
                  <p>
                    <Link to="/engine">Go to the Engine pillar →</Link>
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
