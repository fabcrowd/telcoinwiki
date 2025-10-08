import { CardGrid } from '../components/content/CardGrid'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'
import { StatusValue } from '../components/content/StatusValue'

export function BankPage() {
  return (
    <>
      <PageIntro
        id="bank-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Telcoin Bank"
        title="The user experience layer that makes Telcoin feel familiar"
        lede="Telcoin combines telecom-grade compliance with self-custodied finance. The Telcoin Wallet, Digital Cash reserves, and licensed on/off ramps operate together so newcomers can send money like a fintech app while staying on-chain."
      />

      <section id="bank-pillars" className="anchor-offset">
        <h2>Experience pillars</h2>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'bank-wallet',
              title: 'Telcoin Wallet',
              body: (
                <>
                  <p>Mobile-first access to remittances, swaps, and staking with device binding, recovery phrases, and SOC-aligned security controls.</p>
                  <p>
                    <a href="https://telco.in/wallet" target="_blank" rel="noopener noreferrer">
                      Wallet overview →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'bank-digital-cash',
              title: 'Digital Cash reserves',
              body: (
                <>
                  <p>Fiat-backed tokens such as eUSD and eCAD settle in seconds on the Telcoin Network while retaining compliance attestation and redemption policies.</p>
                  <p>
                    <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                      Digital Cash docs →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'bank-ramps',
              title: 'Licensed ramps',
              body: (
                <>
                  <p>Carrier and fintech partners handle fiat settlement, report through TAN compliance APIs, and keep corridor pricing transparent inside the Wallet.</p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      Remittance coverage →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="bank-metrics" className="anchor-offset">
        <h2>At-a-glance metrics</h2>
        <div className="card-grid card-grid--cols-3" role="list">
          <article className="card" role="listitem">
            <h3 className="card__title">Active corridors</h3>
            <p>
              <StatusValue metricKey="remittanceCorridors" format="plus" /> live corridors spanning mobile money, bank transfer, and cash-out partners.
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Supported currencies</h3>
            <p>
              <StatusValue metricKey="digitalCashCurrencies" format="plus" /> Digital Cash assets, each backed by disclosed reserves and Association oversight.
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Service health</h3>
            <p>
              Track uptime, incident response, and wallet releases via the{' '}
              <a href="https://status.telco.in" target="_blank" rel="noopener noreferrer">
                Telcoin status page
              </a>
              .
            </p>
          </article>
        </div>
      </section>

      <section id="bank-journey" className="anchor-offset">
        <h2>User journey</h2>
        <ol className="numbered-flow">
          <li>
            <strong>Onboard:</strong> Users verify identity, bind their device, and create a recovery phrase to unlock transfers and staking.
          </li>
          <li>
            <strong>Fund:</strong> Cash-in through telecom or fintech partners settles into Digital Cash balances, ready for local payouts or swaps.
          </li>
          <li>
            <strong>Transact:</strong> TEL pays network fees while TELx pools handle instant FX; the Wallet surfaces quotes and status updates in real time.
          </li>
          <li>
            <strong>Report:</strong> TAN APIs send compliance events back to the Telcoin Association and partners to keep jurisdictions satisfied.
          </li>
        </ol>
      </section>

      <section id="bank-resources" className="anchor-offset">
        <h2>Resources &amp; support</h2>
        <CardGrid
          columns={2}
          items={[
            {
              id: 'bank-support',
              title: 'Support center',
              body: (
                <>
                  <p>Access help articles, contact options, and security reminders curated by Telcoin Holdings.</p>
                  <p>
                    <a href="https://telco.in/support" target="_blank" rel="noopener noreferrer">
                      Visit support →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'bank-security',
              title: 'Security newsroom',
              body: (
                <>
                  <p>Monitor SOC reports, advisories, and remediation updates across wallet releases and settlement partners.</p>
                  <p>
                    <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
                      Security updates →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <SourceBox
        title="From the source"
        links={[
          { label: 'Telcoin Wallet', href: 'https://telco.in/wallet', external: true },
          { label: 'Digital Cash', href: 'https://telco.in/digital-cash', external: true },
          { label: 'Remittances', href: 'https://telco.in/remittances', external: true },
        ]}
      />
    </>
  )
}
