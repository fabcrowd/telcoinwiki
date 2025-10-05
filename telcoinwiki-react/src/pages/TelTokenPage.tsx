import { CardGrid } from '../components/content/CardGrid'
import { PageIntro } from '../components/content/PageIntro'
import { SourceBox } from '../components/content/SourceBox'

export function TelTokenPage() {
  return (
    <>
      <PageIntro
        id="tel-overview"
        eyebrow="TEL Token"
        title="Fuel for Telcoin services and governance"
        lede="TEL is the native asset of the Telcoin Network. It pays for transactions, aligns validators and liquidity providers, and anchors governance programs stewarded by the Telcoin Association."
      />

      <section id="tel-utility" className="anchor-offset">
        <h2>Utility pillars</h2>
        <CardGrid
          columns={3}
          items={[
            {
              id: 'tel-utility-gas',
              title: 'Network gas',
              body: (
                <>
                  <p>TEL covers transaction fees for smart contracts running on the Telcoin Network, including Digital Cash movements and TELx interactions.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/network" target="_blank" rel="noopener noreferrer">
                      Network overview →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tel-utility-staking',
              title: 'Staking incentives',
              body: (
                <>
                  <p>Validators and liquidity providers earn TEL rewards via Association-approved programs such as TANIP and TELx lifecycle policies.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/tel" target="_blank" rel="noopener noreferrer">
                      TEL issuance policy →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tel-utility-governance',
              title: 'Governance participation',
              body: (
                <>
                  <p>TEL holders can delegate to community councils and influence proposals that shape network upgrades and incentive allocations.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/governance" target="_blank" rel="noopener noreferrer">
                      Governance framework →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="tel-rewards" className="anchor-offset">
        <h2>Reward programs</h2>
        <CardGrid
          items={[
            {
              id: 'tel-rewards-telx',
              title: 'TELx liquidity mining',
              body: (
                <>
                  <p>Liquidity providers stake TEL pairs to earn rewards defined by TELx lifecycle stages (Active, Deprecated, Archived).</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/telx" target="_blank" rel="noopener noreferrer">
                      TELx docs →
                    </a>
                  </p>
                </>
              ),
            },
            {
              id: 'tel-rewards-tanip',
              title: 'TANIP-1 incentives',
              body: (
                <>
                  <p>The Telcoin Application Network Incentive Program directs TEL rewards toward wallet referrals, usage, and staking goals.</p>
                  <p>
                    <a href="https://www.telcoinassociation.org/tel" target="_blank" rel="noopener noreferrer">
                      TEL incentive outline →
                    </a>
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section id="tel-risk" className="anchor-offset">
        <h2>Risk awareness</h2>
        <div className="notice notice--info">
          <p>
            TEL remains a volatile digital asset. Always verify contract addresses through the Telcoin Association, use trusted exchanges or the Telcoin Wallet, and review jurisdictional guidance before trading.
          </p>
        </div>
        <p>Official references:</p>
        <ul>
          <li>
            <a href="https://telco.in/legal" target="_blank" rel="noopener noreferrer">
              Legal resources
            </a>{' '}
            — regional availability and disclosures.
          </li>
          <li>
            <a href="https://telco.in/newsroom/security" target="_blank" rel="noopener noreferrer">
              Security newsroom
            </a>{' '}
            — fraud alerts and security advisories.
          </li>
        </ul>
      </section>

      <SourceBox
        links={[
          { label: 'TEL overview', href: 'https://www.telcoinassociation.org/tel', external: true },
          { label: 'TELx programs', href: 'https://www.telcoinassociation.org/telx', external: true },
          { label: 'Governance & councils', href: 'https://www.telcoinassociation.org/governance', external: true },
        ]}
      />
    </>
  )
}
