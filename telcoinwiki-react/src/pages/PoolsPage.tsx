import { PageIntro } from '../components/content/PageIntro'
import { ContextBox } from '../components/content/ContextBox'
import { TelxPoolsTable } from '../components/content/TelxPoolsTable'
import { SourceBox } from '../components/content/SourceBox'

export function PoolsPage() {
  return (
    <>
      <PageIntro
        id="pools-overview"
        eyebrow="TELx Pools"
        title="Pools overview"
        lede="Monitor the health of Telcoin’s on-chain liquidity. Status chips reflect governance-defined lifecycle stages; metrics refresh alongside community updates."
      />

      <section id="pools-context" className="anchor-offset">
        <h2>How newcomers use this dashboard</h2>
        <ContextBox title="Why TELx pools matter">
          <p>
            TELx pools route the liquidity that powers Telcoin Wallet swaps and remittance settlement. This community dashboard mirrors the official TELx data so you can understand pool status, incentives, and liquidity depth before interacting with the in-app experiences.
          </p>
          <p>Always compare the information below with the live listings at telx.network and any Telcoin Association governance updates before supplying funds.</p>
        </ContextBox>
      </section>

      <section id="pools-table" className="anchor-offset">
        <h2>Live TELx pools</h2>
        <p>The table provides a design-time snapshot of how TELx metrics surface in the community dashboard. Review pool TVL, staking balances, and recent activity to understand market depth.</p>
        <TelxPoolsTable />
        <div className="notice notice--warning" role="status">
          Live TELx pool data may be temporarily unavailable. Visit{' '}
          <a href="https://www.telx.network/pools" target="_blank" rel="noopener noreferrer">
            telx.network/pools
          </a>{' '}
          for the latest dashboard.
        </div>
        <p>
          Live metrics aggregate from{' '}
          <a href="https://www.telx.network/pools" target="_blank" rel="noopener noreferrer">
            telx.network/pools
          </a>
          . Values refresh alongside the source site when integrations are active.
        </p>
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
