import { Link } from 'react-router-dom'
import { CardGrid } from '../components/content/CardGrid'
import { ContextBox } from '../components/content/ContextBox'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function TelxPage() {
  return (
    <>
      <PageIntro
        id="telx-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="TELx"
        title="The decentralized liquidity engine of the Telcoin Platform"
        lede="TELx orchestrates user-owned liquidity across Telcoin’s regulated DeFi stack. Designers, liquidity miners, and everyday users co-create a compliant, mobile-first financial network."
      >
        <div className="notice notice--info">
          <p>
            TELx integrates with Telcoin Bank, the Telcoin Network, and the Telcoin Application Network to deliver global remittances, digital cash, and staking incentives through a single liquidity engine.
          </p>
        </div>
      </PageIntro>

      <section id="telx-pillars" className="anchor-offset">
        <h2>How it works</h2>
        <p>Three pillars keep TELx aligned with Telcoin’s mission. Together they orchestrate secure infrastructure, incentive-driven liquidity, and user ownership.</p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'telx-pillars-design',
              title: 'Design & development',
              body: (
                <>
                  <p>TELx interfaces with Telcoin’s Layer 1 network, mobile app, and banking rails. Product teams ship wallet UX, contract upgrades, and compliance integrations that respect the TEL governance process.</p>
                  <ul>
                    <li>TELIP & TANIP collaboration with councils</li>
                    <li>Mobile-first wallet experiences</li>
                    <li>Regulatory-grade infrastructure</li>
                  </ul>
                </>
              ),
            },
            {
              id: 'telx-pillars-liquidity',
              title: 'Liquidity mining',
              body: (
                <>
                  <p>TELx is Telcoin’s decentralized liquidity engine, enabling telecom-grade rails for permissionless swaps. Liquidity miners and stakers collaborate with governance councils to route incentives where they create the most value.</p>
                  <ul>
                    <li>Status chips surface pool health</li>
                    <li>Reward streams align with TEL issuance</li>
                    <li>Archived pools remain view-only</li>
                  </ul>
                </>
              ),
            },
            {
              id: 'telx-pillars-ownership',
              title: 'Integration & user ownership',
              body: (
                <>
                  <p>TELx keeps the experience user-owned. Wallet staking, fee rebates, and claimable rewards flow directly to community members who provide liquidity and referrals.</p>
                  <ul>
                    <li>Claim dashboards highlight earnings</li>
                    <li>Referral-driven staking from TANIP-1</li>
                    <li>Open telemetry for community analytics</li>
                  </ul>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="telx-differentiators" className="anchor-offset">
        <h2>Why TELx matters</h2>
        <p>
          TELx is Telcoin’s decentralized liquidity engine, enabling telecom-grade rails for permissionless swaps. Liquidity miners and stakers collaborate with governance councils to route incentives where they create the most value.
        </p>
        <p>
          <Link to="/pools">Explore TELx pools</Link> · <Link to="/portfolio">Review the Portfolio Explorer</Link>
        </p>
      </section>

      <section id="telx-builder-links" className="anchor-offset">
        <h2>Builder resources</h2>
        <ContextBox title="For newcomers">
          <p>
            Start with the <Link to="/start-here">onboarding checklist</Link> and review the{' '}
            <a href="/faq/#what-is-telx">TELx FAQ entry</a> before providing liquidity.
          </p>
        </ContextBox>
        <CardGrid
          items={[
            {
              id: 'telx-builder-pools',
              title: 'TELx Pools Dashboard',
              body: (
                <>
                  <p>Monitor pool status chips, TVL, staking balances, and rewards sourced from telx.network APIs.</p>
                  <p>
                    <Link to="/pools">Open the dashboard →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'telx-builder-portfolio',
              title: 'TELx Portfolio Explorer',
              body: (
                <>
                  <p>Track simulated rewards, LPT stakes, and deprecated pool notices in a TELx-inspired portfolio view.</p>
                  <p>
                    <Link to="/portfolio">View the explorer →</Link>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <SourceBox
        links={[
          { label: 'TELx overview', href: 'https://www.telcoinassociation.org/telx', external: true },
          { label: 'TELx pools', href: 'https://www.telx.network/pools', external: true },
          { label: 'Governance & councils', href: 'https://www.telcoinassociation.org/governance', external: true },
        ]}
      />
    </>
  )
}
