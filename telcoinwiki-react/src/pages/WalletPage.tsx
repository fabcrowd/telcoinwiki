import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'
import { StatusValue } from '../components/content/StatusValue'
import { WalletOverviewPanels } from '../components/wallet/WalletOverviewPanels'

export function WalletPage() {
  return (
    <>
      <PageIntro
        id="wallet-overview"
        variant="hero"
        className="bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={<HeroOverlay />}
        eyebrow="Telcoin Wallet"
        title="Mobile-first access to Telcoin services"
        lede="The Telcoin Wallet is the official gateway for remittances, Digital Cash, TEL swaps, and staking. Verification keeps the experience compliant while letting you manage funds directly from your device."
      />

      <section id="wallet-capabilities" className="anchor-offset">
        <h2>What the Wallet enables</h2>
        <div className="card-grid card-grid--cols-2" role="list">
          <article className="card" role="listitem">
            <h3 className="card__title">Send and receive money</h3>
            <p>
              Access{' '}
              <StatusValue metricKey="remittanceCorridors" format="plus" />{' '}
              corridors with mobile money, bank, and cash-out partners while seeing transparent fees before every transfer.
            </p>
            <p>
              <a href="https://telco.in/remittances" target="_blank" rel="noopener noreferrer">
                Review corridor coverage →
              </a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Hold multi-currency Digital Cash</h3>
            <p>
              Maintain balances in eUSD, eCAD, ePHP, and additional fiat-backed tokens that settle instantly on the Telcoin
              Network.
            </p>
            <p>
              <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                Learn about Digital Cash →
              </a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Swap TEL and stablecoins</h3>
            <p>
              In-app swaps route through TELx liquidity pools so you can move between TEL and Digital Cash without leaving the
              Wallet.
            </p>
            <p>
              <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                Explore TELx mechanics →
              </a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Stay compliant by design</h3>
            <p>
              Identity verification, device binding, and SOC-aligned controls keep the experience within regulated guidelines.
            </p>
            <p>
              <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
                Security &amp; compliance updates →
              </a>
            </p>
          </article>
        </div>
      </section>

      <section id="wallet-insights" className="anchor-offset">
        <h2>Overview</h2>
        <p>
          Stay on top of TEL market performance, TELx liquidity, and live service health without leaving the Wallet overview.
          Data refreshes automatically and falls back to contextual guidance if third-party services are temporarily
          unreachable.
        </p>
        <WalletOverviewPanels />
      </section>

      <section id="wallet-resources" className="anchor-offset">
        <h2>Helpful resources</h2>
        <div className="card-grid" role="list">
          <article className="card" role="listitem">
            <h3 className="card__title">Wallet overview</h3>
            <p>Official product page with feature breakdowns, supported countries, and download links.</p>
            <p>
              <a href="https://telco.in/wallet" target="_blank" rel="noopener noreferrer">
                telco.in/wallet →
              </a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Digital Cash list</h3>
            <p>Check currency availability, reserve audits, and how each asset integrates with remittances and TEL swaps.</p>
            <p>
              <a href="https://telco.in/digital-cash" target="_blank" rel="noopener noreferrer">
                Digital Cash overview →
              </a>
            </p>
          </article>
          <article className="card" role="listitem">
            <h3 className="card__title">Support &amp; security</h3>
            <p>Keep up with SOC reports, security advisories, and contact options managed by Telcoin Holdings.</p>
            <p>
              <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
                Security newsroom →
              </a>
            </p>
          </article>
        </div>
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
