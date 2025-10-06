import { CardGrid } from '../components/content/CardGrid'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function DigitalCashPage() {
  return (
    <>
      <PageIntro
        id="digital-cash-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Digital Cash"
        title="Instant-settlement fiat on the Telcoin Network"
        lede="Digital Cash brings fiat-backed currencies like eUSD, eCAD, and ePHP directly into the Telcoin Wallet. Each asset is designed to settle in seconds on the Telcoin Network while preserving the compliance expectations of its underlying fiat."
      />

      <section id="digital-cash-lineup" className="anchor-offset">
        <h2>Currency lineup</h2>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'digital-cash-eusd',
              title: 'eUSD',
              body: (
                <>
                  <p>USD-denominated Digital Cash for remittances, swaps, and TELx liquidity. Backed by regulated custodians.</p>
                  <p>
                    <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                      Confirm availability →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'digital-cash-ecad',
              title: 'eCAD',
              body: (
                <>
                  <p>Canadian Dollar stablecoin tailored to Canada-to-Philippines and other corridors powered by Telcoin.</p>
                  <p>
                    <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                      See details →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'digital-cash-ephp',
              title: 'ePHP & beyond',
              body: (
                <>
                  <p>Philippine Peso support plus new currencies activated as Telcoin expands licensed payout partnerships.</p>
                  <p>
                    <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                      Review latest list →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="digital-cash-use" className="anchor-offset">
        <h2>How Digital Cash is used</h2>
        <CardGrid
          columns={2}
          items={[
            {
              id: 'digital-cash-remittances',
              title: 'Remittances',
              body: (
                <>
                  <p>Senders can hold eUSD and convert to local fiat at the last mile, reducing FX exposure while keeping transparent fees.</p>
                  <p>
                    <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                      Remittance overview →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'digital-cash-merchants',
              title: 'Merchant payouts',
              body: (
                <>
                  <p>Digital Cash enables compliant settlement rails for payouts and fintech partners that integrate with Telcoin services.</p>
                  <p>
                    <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                      Digital Cash docs →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'digital-cash-telx',
              title: 'TELx liquidity',
              body: (
                <>
                  <p>eUSD, eCAD, and other Digital Cash assets pair with TEL in TELx pools, powering in-app swaps and fee generation.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                      TELx overview →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="digital-cash-compliance" className="anchor-offset">
        <h2>Compliance notes</h2>
        <div className="notice notice--info">
          <p>
            Reserve attestations and legal disclosures are managed by Telcoin Holdings and the Telcoin Association. Always review the official legal section for updates on custodians, audits, and any jurisdictional guidance before relying on a specific currency.
          </p>
        </div>
        <p>Key references:</p>
        <ul>
          <li>
            <a href="https://telco.in/legal" target="_blank" rel="noopener noreferrer">
              Legal library
            </a>{' '}
            — privacy, terms, and jurisdiction notices.
          </li>
          <li>
            <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
              Security newsroom
            </a>{' '}
            — SOC updates and risk advisories.
          </li>
          <li>
            <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
              Association network overview
            </a>{' '}
            — validator and settlement policies.
          </li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'Digital Cash', href: 'https://telco.in/digital-cash', external: true },
          { label: 'Remittances', href: 'https://telco.in/remittances', external: true },
          { label: 'Legal & compliance', href: 'https://telco.in/legal', external: true },
        ]}
      />
    </>
  )
}
