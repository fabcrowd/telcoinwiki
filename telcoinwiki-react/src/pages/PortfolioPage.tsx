import { PageIntro } from '../components/content/PageIntro'
import { ContextBox } from '../components/content/ContextBox'
import { SourceBox } from '../components/content/SourceBox'

export function PortfolioPage() {
  return (
    <>
      <PageIntro
        id="portfolio-overview"
        eyebrow="TELx Portfolio"
        title="Your TELx positions"
        lede="A design-time view of TEL claimable rewards and liquidity provider tokens. Use it to imagine how TELx wallets surface positions with glass panels, friendly chips, and clear callouts."
      />

      <section id="portfolio-context" className="anchor-offset">
        <h2>How to read this mock-up</h2>
        <ContextBox title="Context for newcomers">
          <p>
            This walkthrough simulates what a TELx portfolio page could show—balances, claimable rewards, and lifecycle notices. Values are illustrative only. Always verify live staking positions and rewards inside the Telcoin Wallet and on telx.network before taking action.
          </p>
        </ContextBox>
      </section>

      <section id="portfolio-claimable" className="anchor-offset">
        <div className="section-header">
          <h2>Claimable rewards</h2>
          <button type="button" className="btn-primary" disabled aria-disabled="true">
            Claim all
          </button>
        </div>
        <p>Hypothetical accruals ready to harvest.</p>
        <div className="notice notice--warning">
          <p className="notice__title">Deprecated pool notice</p>
          <p>Rewards from deprecated pools stop compounding after the sunset date. Restake to an active pair to keep earning TEL.</p>
        </div>
        <ul className="entry-list" role="list">
          <li className="entry-list__item">
            <div className="entry-list__header">
              <div>
                <p className="entry-list__label">TEL / USDC</p>
                <p className="entry-list__value">1,248 TEL</p>
              </div>
              <span className="tc-chip is-active">Active</span>
            </div>
            <p className="entry-list__meta">Next unlock: 03:12 UTC • Reward stream via TEL issuance</p>
          </li>
          <li className="entry-list__item">
            <div className="entry-list__header">
              <div>
                <p className="entry-list__label">TEL / WETH</p>
                <p className="entry-list__value">482 TEL</p>
              </div>
              <span className="tc-chip is-active">Active</span>
            </div>
            <p className="entry-list__meta">Fees accrued in last 24h: $212</p>
          </li>
          <li className="entry-list__item entry-list__item--deprecated">
            <div className="entry-list__header">
              <div>
                <p className="entry-list__label">TEL / eUSD</p>
                <p className="entry-list__value">176 TEL</p>
              </div>
              <span className="tc-chip is-deprecated">Deprecated</span>
            </div>
            <p className="entry-list__meta">Claim before 15 Sep • incentives ending soon</p>
          </li>
        </ul>
      </section>

      <section id="portfolio-stakes" className="anchor-offset">
        <div className="section-header">
          <h2>Your LPT stakes</h2>
          <button type="button" className="btn-secondary" disabled aria-disabled="true">
            Manage
          </button>
        </div>
        <p>Illustrative balances across TELx positions.</p>
        <ul className="entry-list" role="list">
          <li className="entry-list__item">
            <div className="entry-list__header">
              <div>
                <p className="entry-list__label">TEL / USDC</p>
                <p className="entry-list__value">12.8 LPT</p>
              </div>
              <span className="tc-chip is-active">Active</span>
            </div>
            <p className="entry-list__meta">Share of pool: 0.82% • Staked since 12 Jul 2025</p>
          </li>
          <li className="entry-list__item">
            <div className="entry-list__header">
              <div>
                <p className="entry-list__label">TEL / MATIC</p>
                <p className="entry-list__value">6.4 LPT</p>
              </div>
              <span className="tc-chip is-active">Active</span>
            </div>
            <p className="entry-list__meta">Rewards streaming: 98 TEL / day</p>
          </li>
          <li className="entry-list__item entry-list__item--archived">
            <div className="entry-list__header">
              <div>
                <p className="entry-list__label">TEL / eCAD</p>
                <p className="entry-list__value">3.1 LPT</p>
              </div>
              <span className="tc-chip is-archived">Archived</span>
            </div>
            <p className="entry-list__meta">Consider migrating to TEL / USDC for active incentives</p>
          </li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'TELx overview', href: 'https://www.telcoinassociation.org/telx', external: true },
          { label: 'TELx pools dashboard', href: 'https://www.telx.network/pools', external: true },
          { label: 'TEL token', href: 'https://www.telcoinassociation.org/tel', external: true },
        ]}
      />
    </>
  )
}
