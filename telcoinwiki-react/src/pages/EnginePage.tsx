import { Link } from 'react-router-dom'
import { CardGrid } from '../components/content/CardGrid'
import { ContextBox } from '../components/content/ContextBox'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function EnginePage() {
  return (
    <>
      <PageIntro
        id="engine-hero"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Pillar three"
        title="What powers the Telcoin engine"
        lede="Peek under the hood of the Telcoin Network so you know how value moves once you onboard."
      >
        <nav className="toc-chips" aria-label="Engine sections">
          <a className="toc-chip" href="#engine-network">
            Network
          </a>
          <a className="toc-chip" href="#engine-ramps">
            On / off ramps
          </a>
          <a className="toc-chip" href="#engine-liquidity">
            Liquidity
          </a>
        </nav>
      </PageIntro>

      <section id="engine-network" className="anchor-offset">
        <h2>Validator-operated infrastructure</h2>
        <p>
          The Telcoin Network is an EVM-compatible proof-of-stake chain run by vetted telecom and fintech validators. Each
          participant agrees to uptime, security, and compliance requirements defined by the Telcoin Association.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'engine-network-architecture',
              title: 'Architecture',
              body: (
                <>
                  <p>
                    Federated validators secure consensus while keeping compatibility with familiar Ethereum tooling for builders.
                  </p>
                  <p>
                    <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
                      Read the network docs →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'engine-network-security',
              title: 'Security expectations',
              body: (
                <>
                  <p>
                    Validators undergo audits and adhere to telecom-grade security practices. Performance metrics are published
                    publicly.
                  </p>
                  <p>
                    <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
                      Check real-time status →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'engine-network-governance',
              title: 'Governance flow',
              body: (
                <>
                  <p>
                    Council-led proposals govern validator onboarding, staking requirements, and protocol upgrades.
                  </p>
                  <p>
                    <a href="https://www.telcoinassociation.org/governance" target="_blank" rel="noopener noreferrer">
                      Governance resources →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="engine-ramps" className="anchor-offset">
        <h2>Regulated on / off ramps</h2>
        <p>
          Telcoin partners with telecom operators, banks, and licensed fintechs so users can cash-in and cash-out using familiar
          local rails. Ramp availability is tailored to each corridor.
        </p>
        <ContextBox title="Ramp checklist">
          <ol>
            <li>Verify your Telcoin Wallet account and add payout recipients before initiating a transfer.</li>
            <li>Confirm corridor availability, payout partners, and fee schedules in the official remittance directory.</li>
            <li>Track delivery time and status updates from within the Wallet after you send.</li>
          </ol>
        </ContextBox>
      </section>

      <section id="engine-liquidity" className="anchor-offset">
        <h2>Liquidity programs balance the rails</h2>
        <p>
          TELx pools coordinate liquidity between TEL, Digital Cash, and remittance pairs. Community dashboards make it easy to
          inspect rewards and pool health before providing liquidity.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'engine-liquidity-pools',
              title: 'TELx Pools dashboard',
              body: (
                <>
                  <p>Monitor liquidity depth, staking ratios, and uptime for every active TELx pool.</p>
                  <p>
                    <a href="https://www.telx.network/pools" target="_blank" rel="noopener noreferrer">
                      Visit telx.network →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'engine-liquidity-portfolio',
              title: 'Portfolio explorer',
              body: (
                <>
                  <p>
                    The community-built portfolio explorer simulates rewards, claims, and legacy pool status with TELx data feeds.
                  </p>
                  <p>
                    <a href="https://www.telx.network" target="_blank" rel="noopener noreferrer">
                      Explore portfolio tools →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'engine-liquidity-onboarding',
              title: 'Get ready to contribute',
              body: (
                <>
                  <p>
                    Review compliance guidelines, wallet safety practices, and remittance demand before supplying liquidity.
                  </p>
                  <p>
                    <Link to="/bank#bank-resources">Wallet safety checklist →</Link>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin Network docs', href: 'https://www.telcoinassociation.org/network', external: true },
          { label: 'Remittance corridors', href: 'https://telco.in/remittances', external: true },
          { label: 'TELx overview', href: 'https://www.telcoinassociation.org/telx', external: true },
        ]}
      />
    </>
  )
}
