import { Link } from 'react-router-dom'
import { CardGrid } from '../components/content/CardGrid'
import { ContextBox } from '../components/content/ContextBox'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function BuildersPage() {
  return (
    <>
      <PageIntro
        id="builders-overview"
        eyebrow="Builders"
        title="Resources for Telcoin contributors"
        lede="Whether you monitor TELx pools, experiment with dashboards, or contribute research, this page surfaces the core tools and official touchpoints for building with Telcoin."
      />

      <section id="builders-tools" className="anchor-offset">
        <h2>Community dashboards</h2>
        <CardGrid
          items={[
            {
              id: 'builders-pools',
              title: 'TELx Pools Dashboard',
              body: (
                <>
                  <p>Snapshot of TELx liquidity pools with status chips, TVL, staking balances, volume, fees, and reward programs.</p>
                  <p>
                    <Link to="/pools">Visit TELx Pools →</Link>
                  </p>
                </>
              ),
            },
            {
              id: 'builders-portfolio',
              title: 'Portfolio Explorer',
              body: (
                <>
                  <p>Design-time view of hypothetical TEL rewards, liquidity provider tokens, and deprecated pool notices.</p>
                  <p>
                    <Link to="/portfolio">Visit Portfolio Explorer →</Link>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="builders-context" className="anchor-offset">
        <h2>Context for newcomers</h2>
        <ContextBox title="Before providing liquidity">
          <p>
            Review the <Link to="/start-here">Start Here guide</Link>, read the{' '}
            <a href="/faq/#what-is-telx">TELx FAQ answer</a>, and confirm pool status directly at{' '}
            <a href="https://www.telx.network/pools" target="_blank" rel="noopener noreferrer">
              telx.network
            </a>
            .
          </p>
        </ContextBox>
        <div className="notice notice--info">
          <p>These dashboards are community-maintained prototypes. For production data, rely on official Telcoin and TELx dashboards.</p>
        </div>
      </section>

      <section id="builders-contribute" className="anchor-offset">
        <h2>Contribute</h2>
        <p>Want to add improvements? Fork the GitHub repo, open an issue, or submit a pull request. Contributions that enhance accessibility, accuracy, or translations are welcome.</p>
        <p>
          <a href="https://github.com/fabcrowd/telcoinwiki" target="_blank" rel="noopener noreferrer">
            GitHub repository →
          </a>
        </p>
      </section>

      <SourceBox
        links={[
          { label: 'TELx docs', href: 'https://www.telcoinassociation.org/telx', external: true },
          { label: 'Governance framework', href: 'https://www.telcoinassociation.org/governance', external: true },
          { label: 'Official TELx pools', href: 'https://www.telx.network/pools', external: true },
        ]}
      />
    </>
  )
}
