import { CardGrid } from '../components/content/CardGrid'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'
import { StatusValue } from '../components/content/StatusValue'

export function ProblemPage() {
  return (
    <>
      <PageIntro
        id="problem-hero"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Pillar one"
        title="Why traditional money fails cross-border"
        lede="Understand the constraints Telcoin is designed to solve before diving into the app, the token, or liquidity programs."
      >
        <nav className="toc-chips" aria-label="Problem sections">
          <a className="toc-chip" href="#problem-fees">
            Fees &amp; delays
          </a>
          <a className="toc-chip" href="#problem-access">
            Access gaps
          </a>
          <a className="toc-chip" href="#problem-stability">
            Stable value
          </a>
        </nav>
      </PageIntro>

      <section id="problem-fees" className="anchor-offset">
        <h2>Remittance fees drain everyday transfers</h2>
        <p>
          Legacy remittance rails route through multiple intermediaries who each take a cut. Families moving funds across
          borders lose precious value to spreads, fees, and settlement delays. Telcoin Wallet corridors publish transparent
          pricing so you can compare costs before you hit send.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'problem-fees-pricing',
              title: 'Transparent corridor pricing',
              body: (
                <>
                  <p>
                    The Telcoin Wallet surfaces live fees and FX rates for every supported route. Confirm corridor availability
                    and compare delivery estimates directly against legacy providers.
                  </p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      Check official corridor listings →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'problem-fees-coverage',
              title: 'Growing corridor coverage',
              body: (
                <>
                  <p>
                    Telcoin focuses on mobile money payouts across{' '}
                    <StatusValue metricKey="remittanceCorridors" format="plus" /> corridors today. Coverage continues to expand
                    as new regulatory approvals land.
                  </p>
                </>
              ),
            },
            {
              id: 'problem-fees-safety',
              title: 'Service transparency',
              body: (
                <>
                  <p>
                    Real-time status updates and dedicated outage reporting keep you informed if a partner rail pauses service or
                    experiences delays.
                  </p>
                  <p>
                    <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
                      Monitor status.telco.in →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="problem-access" className="anchor-offset">
        <h2>Most people rely on mobile-first financial access</h2>
        <p>
          Billions of people operate without traditional bank accounts. Telcoin focuses on mobile money partners, localized
          identity verification, and telecom-grade infrastructure so unbanked and underbanked users can participate without a
          desktop browser or branch visit.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'problem-access-onboarding',
              title: 'Localized onboarding',
              body: (
                <>
                  <p>
                    In-app verification flows adapt to regional requirements. Device approvals, biometric checks, and ID capture
                    are tuned for low-bandwidth contexts.
                  </p>
                  <p>
                    <a href="https://telco.in/wallet" target="_blank" rel="noopener noreferrer">
                      Review the official Wallet guide →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'problem-access-mobile',
              title: 'Mobile money integrations',
              body: (
                <>
                  <p>
                    Telcoin partners with mobile network operators and fintech platforms so senders can cash-in and cash-out using
                    accounts they already trust.
                  </p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      View supported payout partners →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'problem-access-education',
              title: 'Plain-language education',
              body: (
                <>
                  <p>
                    The Telcoin Wiki keeps wallet concepts, corridor walkthroughs, and safety reminders in approachable language so
                    the entire household understands what to expect.
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="problem-stability" className="anchor-offset">
        <h2>Households need predictable purchasing power</h2>
        <p>
          Volatile assets make it difficult to budget for essentials. Telcoin’s Digital Cash lineup prioritizes fiat-backed,
          fully reserved tokens so families can hold value in the currencies they earn and spend every day.
        </p>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'problem-stability-lineup',
              title: 'Collateralized digital cash',
              body: (
                <>
                  <p>
                    Tokens such as eUSD, eCAD, and ePHP are issued against audited reserves and settle instantly on the Telcoin
                    Network.
                  </p>
                  <p>
                    <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                      Learn about Digital Cash →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'problem-stability-telx',
              title: 'Liquidity to match demand',
              body: (
                <>
                  <p>
                    TELx liquidity programs balance pools so remittance and swap demand do not introduce unnecessary slippage.
                  </p>
                  <p>
                    <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                      Dive into TELx →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'problem-stability-policy',
              title: 'Regulated framework',
              body: (
                <>
                  <p>
                    Telcoin Holdings maintains regulatory licenses and compliance disclosures, while the Telcoin Association defines
                    issuance policy.
                  </p>
                  <p>
                    <a href="https://telco.in/legal" target="_blank" rel="noopener noreferrer">
                      Review legal resources →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <SourceBox
        links={[
          { label: 'Telcoin remittance corridors', href: 'https://telco.in/remittances', external: true },
          { label: 'Digital Cash overview', href: 'https://telco.in/digital-cash', external: true },
          { label: 'Status dashboard', href: 'https://status.telco.in', external: true },
        ]}
      />
    </>
  )
}
